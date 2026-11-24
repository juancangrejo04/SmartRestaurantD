import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, signInAnonymously } from 'firebase/auth';
import {
  collection,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  Query,
  query,
  QuerySnapshot,
  setDoc,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { Order, SyncStatus, Table } from '../types';

export interface FirebaseRuntimeConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export interface SyncScope {
  role: string;
  userId?: string;
  branchId?: string;
  branchIds?: string[];
}

const configModules =
  typeof import.meta !== 'undefined' && typeof (import.meta as any).glob === 'function'
    ? (import.meta as any).glob('/firebase-applet-config.json', { eager: true })
    : {};

function resolveFirebaseConfig(): FirebaseRuntimeConfig | null {
  const globEntry = Object.values(configModules)[0] as { default?: Partial<FirebaseRuntimeConfig> } | Partial<FirebaseRuntimeConfig> | undefined;
  const fileConfig: Partial<FirebaseRuntimeConfig> | undefined =
    globEntry && 'default' in globEntry && globEntry.default
      ? globEntry.default
      : (globEntry as Partial<FirebaseRuntimeConfig> | undefined);

  const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

  const apiKey = (fileConfig?.apiKey || env.VITE_FIREBASE_API_KEY || '').trim();
  const authDomain = (fileConfig?.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || '').trim();
  const projectId = (fileConfig?.projectId || env.VITE_FIREBASE_PROJECT_ID || '').trim();
  const appId = (fileConfig?.appId || env.VITE_FIREBASE_APP_ID || '').trim();
  const firestoreDatabaseId = (
    fileConfig?.firestoreDatabaseId ||
    env.VITE_FIREBASE_DATABASE_ID ||
    ''
  ).trim();

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    ...(firestoreDatabaseId ? { firestoreDatabaseId } : {}),
  };
}

export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val !== undefined) {
        cleaned[key] = stripUndefined(val);
      }
    }
    return cleaned as T;
  }
  return value;
}

export function compareIsoTimestamps(a?: string, b?: string): number {
  const strA = a || '';
  const strB = b || '';
  if (strA === strB) return 0;
  const msA = Date.parse(strA);
  const msB = Date.parse(strB);
  if (!Number.isNaN(msA) && !Number.isNaN(msB)) {
    if (msA > msB) return 1;
    if (msA < msB) return -1;
    return 0;
  }
  return strA > strB ? 1 : -1;
}

export function serializeOrderForFirestore(order: Order): Record<string, unknown> {
  const cleanOrder = stripUndefined({
    ...order,
    updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
  });
  return stripUndefined({
    data: JSON.stringify(cleanOrder),
    branchId: cleanOrder.branchId,
    userId: cleanOrder.userId ?? null,
    courierId: cleanOrder.courierId ?? null,
    orderType: cleanOrder.orderType ?? 'delivery',
    orderNumber: cleanOrder.orderNumber,
    status: cleanOrder.status,
    updatedAt: cleanOrder.updatedAt,
  });
}

export function serializeTableForFirestore(table: Table): Record<string, unknown> {
  const cleanTable = stripUndefined({
    ...table,
    updatedAt: table.updatedAt || new Date().toISOString(),
  });
  return stripUndefined({
    data: JSON.stringify(cleanTable),
    branchId: cleanTable.branchId,
    status: cleanTable.status,
    updatedAt: cleanTable.updatedAt,
  });
}

function parseDocPayload<T>(docData: DocumentData | undefined): T | null {
  if (!docData || typeof docData.data !== 'string') return null;
  try {
    return JSON.parse(docData.data) as T;
  } catch {
    return null;
  }
}

const BACKOFF_STEPS_MS = [500, 1000, 2000, 4000, 8000, 16000, 30000];

export class RemoteSyncService {
  private static instance: RemoteSyncService;

  private config: FirebaseRuntimeConfig | null;
  private status: SyncStatus;
  private statusListeners = new Set<(status: SyncStatus) => void>();

  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;

  private initPromise: Promise<SyncStatus> | null = null;
  private retryCount = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private networkListenersBound = false;

  private constructor() {
    this.config = resolveFirebaseConfig();
    this.status = this.config ? 'connecting' : 'disabled';
    this.bindNetworkListeners();
  }

  public static getInstance(): RemoteSyncService {
    if (!RemoteSyncService.instance) {
      RemoteSyncService.instance = new RemoteSyncService();
    }
    return RemoteSyncService.instance;
  }

  private bindNetworkListeners(): void {
    if (this.networkListenersBound || typeof window === 'undefined') return;
    this.networkListenersBound = true;

    window.addEventListener('offline', () => {
      if (this.status !== 'disabled') {
        this.setStatus('offline');
      }
    });

    window.addEventListener('online', () => {
      if (this.status !== 'disabled') {
        this.retryCount = 0;
        void this.init(true);
      }
    });
  }

  private setStatus(next: SyncStatus): void {
    if (this.status === next) return;
    this.status = next;
    this.statusListeners.forEach((listener) => {
      try {
        listener(next);
      } catch {
        // Ignore subscriber listener errors
      }
    });
  }

  public getStatus(): SyncStatus {
    return this.status;
  }

  public isEnabled(): boolean {
    return this.status !== 'disabled' && this.config !== null;
  }

  public subscribeStatus(listener: (status: SyncStatus) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private clearRetryTimer(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private scheduleRetry(): void {
    if (!this.config || this.retryTimer) return;
    const delayMs =
      BACKOFF_STEPS_MS[Math.min(this.retryCount, BACKOFF_STEPS_MS.length - 1)];
    this.retryCount += 1;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.init(true);
    }, delayMs);
  }

  private handleError(context: string, error: unknown): void {
    const code = (error as { code?: string })?.code || '';
    const message = (error as { message?: string })?.message || String(error);
    console.warn(`[remoteSyncService] ${context} failed (${code || 'unknown'}): ${message}`);
    if (this.status !== 'disabled') {
      this.setStatus('offline');
      this.scheduleRetry();
    }
  }

  public async init(forceRetry = false): Promise<SyncStatus> {
    if (!this.config) {
      this.setStatus('disabled');
      return 'disabled';
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.setStatus('offline');
      this.scheduleRetry();
      return 'offline';
    }

    if (this.initPromise && !forceRetry) {
      return this.initPromise;
    }

    if (forceRetry) {
      this.initPromise = null;
    }

    this.initPromise = (async () => {
      try {
        this.setStatus('connecting');
        if (!this.app) {
          const existingApps = getApps();
          this.app =
            existingApps.length > 0
              ? existingApps[0]
              : initializeApp({
                  apiKey: this.config!.apiKey,
                  authDomain: this.config!.authDomain,
                  projectId: this.config!.projectId,
                  appId: this.config!.appId,
                });
        }

        if (!this.auth) {
          this.auth = getAuth(this.app);
        }

        if (!this.db) {
          this.db = this.config!.firestoreDatabaseId
            ? getFirestore(this.app, this.config!.firestoreDatabaseId)
            : getFirestore(this.app);
        }

        if (!this.auth.currentUser) {
          await signInAnonymously(this.auth);
        }

        // Verify live reachability to Firestore server without altering user data
        await getDocFromServer(doc(this.db, 'orders', 'healthcheck-probe'));
        this.clearRetryTimer();
        this.retryCount = 0;
        this.setStatus('online');
        return 'online' as SyncStatus;
      } catch (error) {
        const msg = (error as { message?: string })?.message || '';
        const code = (error as { code?: string })?.code || '';
        // Permission denied or unavailable still drops cleanly to offline/local mode without throwing to UI
        if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
          console.warn(
            '[remoteSyncService] Anonymous auth is disabled in Firebase Console. Enable Anonymous Sign-In to activate cross-device sync.'
          );
        } else if (msg.includes('client is offline')) {
          console.warn('[remoteSyncService] Client is offline, running locally.');
        }
        this.handleError('init', error);
        return 'offline' as SyncStatus;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  private async ensureReady(): Promise<boolean> {
    if (!this.config) return false;
    if (this.status === 'online' && this.db && this.auth?.currentUser) {
      return true;
    }
    const next = await this.init();
    return next === 'online' && Boolean(this.db) && Boolean(this.auth?.currentUser);
  }

  public async pushOrder(order: Order): Promise<boolean> {
    if (!this.config) return false;
    try {
      const ready = await this.ensureReady();
      if (!ready || !this.db) return false;
      const payload = serializeOrderForFirestore(order);
      await setDoc(doc(this.db, 'orders', order.id), payload, { merge: true });
      if (this.status !== 'online') this.setStatus('online');
      return true;
    } catch (error) {
      this.handleError(`pushOrder(${order.id})`, error);
      return false;
    }
  }

  public async pushTable(table: Table): Promise<boolean> {
    if (!this.config) return false;
    try {
      const ready = await this.ensureReady();
      if (!ready || !this.db) return false;
      const payload = serializeTableForFirestore(table);
      await setDoc(doc(this.db, 'tables', table.id), payload, { merge: true });
      if (this.status !== 'online') this.setStatus('online');
      return true;
    } catch (error) {
      this.handleError(`pushTable(${table.id})`, error);
      return false;
    }
  }

  private extractOrdersFromSnapshot(
    snapshot: QuerySnapshot<DocumentData>,
    predicate?: (order: Order) => boolean
  ): Order[] {
    const changed: Order[] = [];
    for (const change of snapshot.docChanges()) {
      if (change.type === 'added' || change.type === 'modified') {
        const parsed = parseDocPayload<Order>(change.doc.data());
        if (parsed && (!predicate || predicate(parsed))) {
          changed.push(parsed);
        }
      }
    }
    return changed;
  }

  private extractTablesFromSnapshot(
    snapshot: QuerySnapshot<DocumentData>,
    predicate?: (table: Table) => boolean
  ): Table[] {
    const changed: Table[] = [];
    for (const change of snapshot.docChanges()) {
      if (change.type === 'added' || change.type === 'modified') {
        const parsed = parseDocPayload<Table>(change.doc.data());
        if (parsed && (!predicate || predicate(parsed))) {
          changed.push(parsed);
        }
      }
    }
    return changed;
  }

  public subscribeOrders(
    scope: SyncScope,
    onChange: (orders: Order[]) => void
  ): () => void {
    if (!this.config) return () => {};

    let cancelled = false;
    const unsubs: Unsubscribe[] = [];

    const start = async () => {
      try {
        const ready = await this.ensureReady();
        if (cancelled || !ready || !this.db) return;

        const ordersRef = collection(this.db, 'orders');

        const attach = (
          q: Query<DocumentData>,
          predicate?: (order: Order) => boolean
        ) => {
          const unsub = onSnapshot(
            q,
            (snap) => {
              if (cancelled) return;
              if (this.status !== 'online') this.setStatus('online');
              const items = this.extractOrdersFromSnapshot(snap, predicate);
              if (items.length > 0) {
                onChange(items);
              }
            },
            (err) => {
              this.handleError('subscribeOrders.onSnapshot', err);
            }
          );
          unsubs.push(unsub);
        };

        if (scope.role === 'customer') {
          if (scope.userId) {
            attach(query(ordersRef, where('userId', '==', scope.userId)));
          }
          return;
        }

        if (scope.role === 'courier') {
          if (scope.userId) {
            attach(query(ordersRef, where('courierId', '==', scope.userId)));
          }
          const isReadyDelivery = (o: Order) =>
            (o.orderType === 'delivery' || !o.tableNumber) && o.status === 'ready';

          if (scope.branchId) {
            attach(
              query(ordersRef, where('branchId', '==', scope.branchId)),
              isReadyDelivery
            );
          } else if (scope.branchIds && scope.branchIds.length > 0) {
            attach(
              query(ordersRef, where('branchId', 'in', scope.branchIds.slice(0, 30))),
              isReadyDelivery
            );
          }
          return;
        }

        if (scope.role === 'owner' || scope.role === 'platform_admin') {
          const allowedSet =
            scope.branchIds && scope.branchIds.length > 0
              ? new Set(scope.branchIds)
              : null;
          attach(
            query(ordersRef),
            allowedSet ? (o) => allowedSet.has(o.branchId) : undefined
          );
          return;
        }

        // Branch-scoped staff: kitchen, waiter, branch_admin, admin, cashier, custom roles
        if (scope.branchId) {
          attach(query(ordersRef, where('branchId', '==', scope.branchId)));
        }
      } catch (error) {
        this.handleError('subscribeOrders', error);
      }
    };

    void start();

    return () => {
      cancelled = true;
      unsubs.forEach((u) => {
        try {
          u();
        } catch {
          // Ignore unsubscribe errors
        }
      });
    };
  }

  public subscribeTables(
    scope: string | { branchId?: string; branchIds?: string[]; role?: string },
    onChange: (tables: Table[]) => void
  ): () => void {
    if (!this.config) return () => {};

    let cancelled = false;
    let unsub: Unsubscribe | null = null;

    const normalized =
      typeof scope === 'string'
        ? { branchId: scope }
        : scope;

    const start = async () => {
      try {
        const ready = await this.ensureReady();
        if (cancelled || !ready || !this.db) return;

        const tablesRef = collection(this.db, 'tables');
        const isElevated =
          normalized.role === 'owner' || normalized.role === 'platform_admin';

        if (isElevated) {
          const allowed =
            normalized.branchIds && normalized.branchIds.length > 0
              ? new Set(normalized.branchIds)
              : null;
          unsub = onSnapshot(
            query(tablesRef),
            (snap) => {
              if (cancelled) return;
              if (this.status !== 'online') this.setStatus('online');
              const items = this.extractTablesFromSnapshot(
                snap,
                allowed ? (t) => allowed.has(t.branchId) : undefined
              );
              if (items.length > 0) onChange(items);
            },
            (err) => {
              this.handleError('subscribeTables.onSnapshot', err);
            }
          );
        } else if (normalized.branchId) {
          unsub = onSnapshot(
            query(tablesRef, where('branchId', '==', normalized.branchId)),
            (snap) => {
              if (cancelled) return;
              if (this.status !== 'online') this.setStatus('online');
              const items = this.extractTablesFromSnapshot(snap);
              if (items.length > 0) onChange(items);
            },
            (err) => {
              this.handleError('subscribeTables.onSnapshot', err);
            }
          );
        }
      } catch (error) {
        this.handleError('subscribeTables', error);
      }
    };

    void start();

    return () => {
      cancelled = true;
      if (unsub) {
        try {
          unsub();
        } catch {
          // Ignore unsubscribe errors
        }
      }
    };
  }

  public async fetchOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
    if (!this.config || !idOrNumber) return null;
    try {
      const ready = await this.ensureReady();
      if (!ready || !this.db) return null;

      const byIdSnap = await getDoc(doc(this.db, 'orders', idOrNumber));
      if (byIdSnap.exists()) {
        return parseDocPayload<Order>(byIdSnap.data());
      }

      const byNumSnap = await getDocs(
        query(collection(this.db, 'orders'), where('orderNumber', '==', idOrNumber), limit(1))
      );
      if (!byNumSnap.empty) {
        return parseDocPayload<Order>(byNumSnap.docs[0].data());
      }
      return null;
    } catch (error) {
      this.handleError(`fetchOrderByIdOrNumber(${idOrNumber})`, error);
      return null;
    }
  }

  public subscribeOrderByIdOrNumber(
    idOrNumber: string,
    onChange: (order: Order) => void
  ): () => void {
    if (!this.config || !idOrNumber) return () => {};

    let cancelled = false;
    const unsubs: Unsubscribe[] = [];

    const start = async () => {
      try {
        const ready = await this.ensureReady();
        if (cancelled || !ready || !this.db) return;

        const docUnsub = onSnapshot(
          doc(this.db, 'orders', idOrNumber),
          (snap) => {
            if (cancelled) return;
            if (snap.exists()) {
              const parsed = parseDocPayload<Order>(snap.data());
              if (parsed) onChange(parsed);
            }
          },
          (err) => this.handleError('subscribeOrderById', err)
        );
        unsubs.push(docUnsub);

        const numUnsub = onSnapshot(
          query(collection(this.db, 'orders'), where('orderNumber', '==', idOrNumber), limit(1)),
          (snap) => {
            if (cancelled) return;
            const items = this.extractOrdersFromSnapshot(snap);
            if (items[0]) onChange(items[0]);
          },
          (err) => this.handleError('subscribeOrderByNumber', err)
        );
        unsubs.push(numUnsub);
      } catch (error) {
        this.handleError(`subscribeOrderByIdOrNumber(${idOrNumber})`, error);
      }
    };

    void start();

    return () => {
      cancelled = true;
      unsubs.forEach((u) => {
        try {
          u();
        } catch {
          // Ignore unsubscribe errors
        }
      });
    };
  }
}

export const remoteSyncService = RemoteSyncService.getInstance();
