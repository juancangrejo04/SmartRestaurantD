import { CountryCode, RegionalNodeState } from '../types';
import { distributedClock } from './clock';
import { getAllRegionProfiles } from '../data/regions';

const NODES_STORAGE_KEY = 'smartrestaurant_v4_regional_nodes';

function createInitialNodeState(country: CountryCode): RegionalNodeState {
  const now = new Date().toISOString().replace('.000Z', 'Z');
  return {
    nodeId: `node-${country.toLowerCase()}`,
    country,
    partitionKey: `smartrestaurant_v4_partition_${country}`,
    replicaPartitionKey: `smartrestaurant_v4_replica_${country}`,
    primaryStatus: 'up',
    replicaStatus: 'up',
    activeLeader: 'primary',
    term: 1,
    replicationLagMs: 42,
    pendingReplicationCount: 0,
    lastHeartbeatUtc: now,
    lastReplicationUtc: now,
    ntpOffsetMs: distributedClock.getNtpOffsetMs(country),
    writesCount: 0,
  };
}

class RegionNodesManager {
  private static instance: RegionNodesManager;
  private nodes: Record<CountryCode, RegionalNodeState>;
  private listeners = new Set<() => void>();

  private constructor() {
    this.nodes = this.load();
  }

  public static getInstance(): RegionNodesManager {
    if (!RegionNodesManager.instance) {
      RegionNodesManager.instance = new RegionNodesManager();
    }
    return RegionNodesManager.instance;
  }

  private load(): Record<CountryCode, RegionalNodeState> {
    const initial = {} as Record<CountryCode, RegionalNodeState>;
    getAllRegionProfiles().forEach((p) => {
      initial[p.code] = createInitialNodeState(p.code);
    });
    try {
      const raw = localStorage.getItem(NODES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Record<CountryCode, RegionalNodeState>>;
        (Object.keys(initial) as CountryCode[]).forEach((code) => {
          if (parsed[code]) {
            initial[code] = { ...initial[code], ...parsed[code] };
          }
        });
      }
    } catch {
      // Safe fallback
    }
    return initial;
  }

  private save(): void {
    try {
      localStorage.setItem(NODES_STORAGE_KEY, JSON.stringify(this.nodes));
      this.listeners.forEach((cb) => cb());
    } catch {
      // Ignore quota errors
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getAllNodes(): RegionalNodeState[] {
    const offsets = distributedClock.getAllNtpOffsets();
    return Object.values(this.nodes).map((n) => ({
      ...n,
      ntpOffsetMs: offsets[n.country] ?? n.ntpOffsetMs,
    }));
  }

  public getNode(country: CountryCode): RegionalNodeState {
    const node = this.nodes[country] || createInitialNodeState(country);
    return {
      ...node,
      ntpOffsetMs: distributedClock.getNtpOffsetMs(country),
    };
  }

  /**
   * Simulates primary failure + automatic leader election to replica
   */
  public failoverPrimary(country: CountryCode): RegionalNodeState {
    const cur = this.getNode(country);
    const now = new Date().toISOString().replace('.000Z', 'Z');
    const next: RegionalNodeState = {
      ...cur,
      primaryStatus: 'down',
      activeLeader: cur.replicaStatus === 'up' ? 'replica' : cur.activeLeader,
      term: cur.term + 1,
      replicationLagMs: 0,
      lastHeartbeatUtc: now,
    };
    this.nodes[country] = next;
    this.save();
    return next;
  }

  /**
   * Simulates restoring primary after downtime; triggers eventual consistency catch-up
   */
  public restorePrimary(country: CountryCode): RegionalNodeState {
    const cur = this.getNode(country);
    const now = new Date().toISOString().replace('.000Z', 'Z');
    const next: RegionalNodeState = {
      ...cur,
      primaryStatus: 'up',
      activeLeader: 'primary',
      term: cur.term + 1,
      replicationLagMs: cur.pendingReplicationCount > 0 ? 320 : 38,
      lastHeartbeatUtc: now,
    };
    this.nodes[country] = next;
    this.save();
    return next;
  }

  /**
   * Synchronizes replica and primary partitions (eventual consistency convergence)
   */
  public syncReplica(country: CountryCode): RegionalNodeState {
    const cur = this.getNode(country);
    const now = new Date().toISOString().replace('.000Z', 'Z');

    // Copy isolated partition contents from active leader partition to follower partition
    try {
      const sourceKey = cur.activeLeader === 'primary' ? cur.partitionKey : cur.replicaPartitionKey;
      const targetKey = cur.activeLeader === 'primary' ? cur.replicaPartitionKey : cur.partitionKey;
      const sourceData = localStorage.getItem(sourceKey);
      if (sourceData) {
        localStorage.setItem(targetKey, sourceData);
      }
    } catch {
      // Safe fallback
    }

    const next: RegionalNodeState = {
      ...cur,
      pendingReplicationCount: 0,
      replicationLagMs: 25,
      lastReplicationUtc: now,
      lastHeartbeatUtc: now,
    };
    this.nodes[country] = next;
    this.save();
    return next;
  }

  /**
   * Appends a serialized partition record to the isolated region partition storage key.
   * Zero cross-region shared tables; demonstrates data partitioning + replication lag.
   */
  public writeToPartition(
    country: CountryCode,
    entityType: string,
    recordId: string,
    summaryPayload: Record<string, unknown>
  ): RegionalNodeState {
    const cur = this.getNode(country);
    const now = new Date().toISOString().replace('.000Z', 'Z');
    const targetStorageKey = cur.activeLeader === 'primary' ? cur.partitionKey : cur.replicaPartitionKey;

    try {
      const existingRaw = localStorage.getItem(targetStorageKey);
      const list: unknown[] = existingRaw ? JSON.parse(existingRaw) : [];
      const entry = JSON.parse(
        JSON.stringify({
          id: recordId,
          entityType,
          region: country,
          leader: cur.activeLeader,
          writtenAtUtc: now,
          payload: summaryPayload,
        })
      );
      list.unshift(entry);
      localStorage.setItem(targetStorageKey, JSON.stringify(list.slice(0, 60)));

      // If both up, asynchronously mirror with slight lag (unless primary is down)
      if (cur.primaryStatus === 'up' && cur.replicaStatus === 'up') {
        localStorage.setItem(cur.replicaPartitionKey, JSON.stringify(list.slice(0, 60)));
      }
    } catch {
      // Ignore quota errors
    }

    const primaryDown = cur.primaryStatus === 'down';
    const next: RegionalNodeState = {
      ...cur,
      writesCount: cur.writesCount + 1,
      pendingReplicationCount: primaryDown ? cur.pendingReplicationCount + 1 : 0,
      replicationLagMs: primaryDown ? 1450 : 35 + Math.floor(Math.random() * 25),
      lastHeartbeatUtc: now,
      lastReplicationUtc: primaryDown ? cur.lastReplicationUtc : now,
    };
    this.nodes[country] = next;
    this.save();
    return next;
  }

  public getPartitionRecordsCount(country: CountryCode): { primaryCount: number; replicaCount: number } {
    const cur = this.getNode(country);
    try {
      const pRaw = localStorage.getItem(cur.partitionKey);
      const rRaw = localStorage.getItem(cur.replicaPartitionKey);
      return {
        primaryCount: pRaw ? JSON.parse(pRaw).length : 0,
        replicaCount: rRaw ? JSON.parse(rRaw).length : 0,
      };
    } catch {
      return { primaryCount: 0, replicaCount: 0 };
    }
  }

  public resetAllNodes(): void {
    getAllRegionProfiles().forEach((p) => {
      const fresh = createInitialNodeState(p.code);
      this.nodes[p.code] = fresh;
      localStorage.removeItem(fresh.partitionKey);
      localStorage.removeItem(fresh.replicaPartitionKey);
    });
    this.save();
  }
}

export const regionNodes = RegionNodesManager.getInstance();
