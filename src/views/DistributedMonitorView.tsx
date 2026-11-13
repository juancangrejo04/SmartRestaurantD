import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CountryCode,
  DistributedEvent,
  FailureTestResult,
  RegionalNodeState,
  ServiceHealth,
  ServiceName,
} from '../types';
import { broker } from '../core/broker';
import { regionNodes } from '../core/regionNodes';
import { distributedClock } from '../core/clock';
import { nameService } from '../core/nameService';
import { apiGateway } from '../core/apiGateway';
import { restaurantService } from '../services/restaurantService';
import { dispatchService } from '../services/dispatchService';
import { orderService } from '../services/orderService';
import { orderSagaService } from '../services/orderSagaService';
import { paymentGatewayService } from '../services/paymentGatewayService';
import {
  getAllRegionProfiles,
  getRegionProfile,
  getSimulatedCountryDraft,
  registerSimulatedCountryDraft,
  clearSimulatedCountryDraft,
  subscribeRegionProfiles,
} from '../data/regions';
import {
  Network,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Zap,
  Code2,
  X,
  RefreshCw,
  Trash2,
  ArrowRight,
  Cpu,
  HardDrive,
  ShieldCheck,
  Download,
  Compass,
  FlaskConical,
  Settings,
  Lock,
  Plus,
} from 'lucide-react';

const FAILURE_RESULTS_KEY = 'smartrestaurant_v4_failure_tests';

function loadSavedTestResults(): FailureTestResult[] {
  try {
    const raw = localStorage.getItem(FAILURE_RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const DistributedMonitorView: React.FC = () => {
  const {
    t,
    country: activeMarketCountry,
    currentUser,
    branches,
    menuItems,
    events,
    servicesHealth,
    toggleServiceHealth,
    retryFailedEvents,
    clearEvents,
    appendOrders,
    runFullDistributedDemo,
    isDemoRunning,
    demoStep,
    demoStepMessage,
    showToast,
  } = useApp();

  const isReadOnlyRegional =
    currentUser?.role === 'branch_admin' || currentUser?.role === 'admin';
  const scopedCountry: CountryCode | null = isReadOnlyRegional
    ? currentUser?.country || activeMarketCountry
    : null;
  const pilotCountry: CountryCode = scopedCountry || activeMarketCountry;

  const [inspectedEvent, setInspectedEvent] = useState<DistributedEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>(scopedCountry || 'ALL');
  const [nodes, setNodes] = useState<RegionalNodeState[]>(() => regionNodes.getAllNodes());
  const [testResults, setTestResults] = useState<FailureTestResult[]>(() => loadSavedTestResults());
  const [runningTestKey, setRunningTestKey] = useState<string | null>(null);
  const [liveNarration, setLiveNarration] = useState<string[]>([]);
  const [simCountry, setSimCountry] = useState(() => getSimulatedCountryDraft());
  const [rateLimitReport, setRateLimitReport] = useState<{
    sent: number;
    accepted: number;
    blocked429: number;
  } | null>(null);
  const [, setTickCounter] = useState(0);

  useEffect(() => {
    const unsubNodes = regionNodes.subscribe(() => {
      setNodes(regionNodes.getAllNodes());
    });
    const unsubProfiles = subscribeRegionProfiles(() => {
      setSimCountry(getSimulatedCountryDraft());
    });
    const timer = setInterval(() => {
      setTickCounter((n) => n + 1);
    }, 2500);
    return () => {
      unsubNodes();
      unsubProfiles();
      clearInterval(timer);
    };
  }, []);

  const persistTestResult = (res: FailureTestResult) => {
    setTestResults((prev) => {
      const next = [res, ...prev].slice(0, 30);
      try {
        localStorage.setItem(FAILURE_RESULTS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  // Visible slices based on RBAC read-only regional mode
  const visibleNodes = scopedCountry
    ? nodes.filter((n) => n.country === scopedCountry)
    : nodes;

  const visibleEvents = events.filter((ev) => {
    if (scopedCountry && ev.region && ev.region !== scopedCountry) return false;
    if (filterRegion !== 'ALL' && ev.region !== filterRegion) return false;
    if (filterStatus !== 'all' && ev.status !== filterStatus) return false;
    return true;
  });

  const failedEventsCount = events.filter((e) => e.status === 'failed').length;
  const completedEventsCount = events.filter((e) => e.status === 'completed').length;
  const gatewayMetrics = apiGateway.getMetrics();
  const nameDirectory = nameService
    .getDirectorySnapshot()
    .filter((d) => !scopedCountry || d.region === scopedCountry);
  const nameStats = nameService.getCacheStats();
  const catalogStats = restaurantService.getCatalogCacheStats();
  const activeLeases = dispatchService.getActiveLeases();

  const handleFailoverNode = async (countryCode: CountryCode) => {
    if (isReadOnlyRegional) return;
    const next = regionNodes.failoverPrimary(countryCode);
    await broker.publish({
      sourceService: 'order-service',
      type: 'NODE_FAILOVER_PROMOTED',
      region: countryCode,
      targetServices: ['notification-service', 'analytics-service'],
      payload: {
        nodeId: next.nodeId,
        activeLeader: next.activeLeader,
        term: next.term,
      },
    });
    showToast(
      t('mon_toast_failover', { node: next.nodeId, leader: next.activeLeader }),
      'warning'
    );
  };

  const handleRestoreNode = async (countryCode: CountryCode) => {
    if (isReadOnlyRegional) return;
    const next = regionNodes.restorePrimary(countryCode);
    await broker.publish({
      sourceService: 'order-service',
      type: 'NODE_PRIMARY_RESTORED',
      region: countryCode,
      targetServices: ['notification-service', 'analytics-service'],
      payload: {
        nodeId: next.nodeId,
        activeLeader: next.activeLeader,
        term: next.term,
        pendingSync: next.pendingReplicationCount,
      },
    });
    showToast(t('mon_toast_restored', { node: next.nodeId }), 'success');
  };

  const handleSyncReplica = async (countryCode: CountryCode) => {
    if (isReadOnlyRegional) return;
    const next = regionNodes.syncReplica(countryCode);
    await broker.publish({
      sourceService: 'analytics-service',
      type: 'REPLICA_SYNC_COMPLETED',
      region: countryCode,
      targetServices: ['notification-service'],
      payload: {
        nodeId: next.nodeId,
        lagMs: next.replicationLagMs,
        pending: next.pendingReplicationCount,
      },
    });
    showToast(t('mon_toast_synced', { node: next.nodeId }), 'info');
  };

  const handleSyncNtp = (countryCode: CountryCode) => {
    if (isReadOnlyRegional) return;
    distributedClock.syncNodeClock(countryCode);
    setNodes(regionNodes.getAllNodes());
    showToast(t('mon_toast_ntp_synced', { country: countryCode }), 'info');
  };

  const handleResetAllServices = () => {
    if (isReadOnlyRegional) return;
    broker.resetAllServices();
    showToast(t('mon_toast_services_reset'), 'success');
  };

  // =========================================================================
  // GUIDED FAILURE TESTS 1-5 (Section 8.6)
  // =========================================================================
  const runGuidedTest1Recovery = async () => {
    if (isReadOnlyRegional || runningTestKey) return;
    setRunningTestKey('test1');
    const startedAtUtc = new Date().toISOString().replace('.000Z', 'Z');
    const steps: string[] = [];
    const pushStep = (msg: string) => {
      steps.push(msg);
      setLiveNarration([...steps]);
    };

    try {
      pushStep(t('mon_t1_step1'));
      broker.setServiceHealth('payments-service', 'down');
      await new Promise((r) => setTimeout(r, 250));

      const pilotProf = getRegionProfile(pilotCountry);
      const pilotBranch = branches.find((b) => b.country === pilotCountry) || branches[0];
      const dish =
        menuItems.find((m) => m.countryCode === pilotCountry && m.isLunchOfTheDay) ||
        menuItems[0];
      const order = orderService.createOrder({
        branchId: pilotBranch.id,
        restaurantId: pilotBranch.restaurantId,
        orderType: 'delivery',
        items: [
          {
            menuItemId: dish.id,
            name: dish.name[pilotProf.defaultLanguage] || dish.name.es,
            quantity: 1,
            unitPriceMinorUnits: dish.priceMinorUnits,
            subtotalMinorUnits: dish.priceMinorUnits,
          },
        ],
        countryCode: pilotCountry,
        customerName: 'Prueba Fallo Recuperable',
      });
      orderSagaService.startSaga(order.id, pilotCountry);
      pushStep(t('mon_t1_step2', { order: order.orderNumber }));

      const failedReq = await broker.request({
        sourceService: 'order-service',
        targetService: 'payments-service',
        eventType: 'PAYMENT_AUTHORIZE_REQUEST',
        region: pilotCountry,
        payload: {
          orderId: order.id,
          amountMinorUnits: order.totalMinorUnits,
          currency: order.currency,
          paymentMethod: pilotProf.paymentMethods[0]?.id || 'card',
        },
      });
      pushStep(
        t('mon_t1_step3', {
          attempts: failedReq.event.attempts,
          status: failedReq.event.status,
        })
      );

      broker.setServiceHealth('payments-service', 'up');
      await new Promise((r) => setTimeout(r, 200));
      const replayed = await broker.retryEvent(failedReq.event.id);
      const passed = replayed?.status === 'completed';

      if (passed) {
        orderSagaService.advanceStep(order.id, 'authorize_payment', 'confirm_commerce', pilotCountry);
        appendOrders([{ ...order, paymentStatus: 'paid', status: 'received' }]);
      }
      pushStep(t('mon_t1_step4', { status: replayed?.status || 'failed' }));

      persistTestResult({
        id: `ft-${Date.now().toString(36)}`,
        testKey: 'mon_test1_title',
        region: pilotCountry,
        startedAtUtc,
        completedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
        passed,
        stepsLog: steps,
        summary: t('mon_test1_summary', { order: order.orderNumber }),
      });
      showToast(t('mon_test_done_toast'), passed ? 'success' : 'error');
    } finally {
      setRunningTestKey(null);
    }
  };

  const runGuidedTest2SagaRollback = async () => {
    if (isReadOnlyRegional || runningTestKey) return;
    setRunningTestKey('test2');
    const startedAtUtc = new Date().toISOString().replace('.000Z', 'Z');
    const steps: string[] = [];
    const pushStep = (msg: string) => {
      steps.push(msg);
      setLiveNarration([...steps]);
    };

    try {
      const pilotProf = getRegionProfile(pilotCountry);
      const pilotBranch = branches.find((b) => b.country === pilotCountry) || branches[0];
      const dish =
        menuItems.find((m) => m.countryCode === pilotCountry && m.isLunchOfTheDay) ||
        menuItems[0];
      const order = orderService.createOrder({
        branchId: pilotBranch.id,
        restaurantId: pilotBranch.restaurantId,
        orderType: 'delivery',
        items: [
          {
            menuItemId: dish.id,
            name: dish.name[pilotProf.defaultLanguage] || dish.name.es,
            quantity: 1,
            unitPriceMinorUnits: dish.priceMinorUnits,
            subtotalMinorUnits: dish.priceMinorUnits,
          },
        ],
        countryCode: pilotCountry,
        customerName: 'Prueba Saga Reversión',
      });

      orderSagaService.startSaga(order.id, pilotCountry);
      const auth = await paymentGatewayService.authorizePayment({
        orderId: order.id,
        amountMinorUnits: order.totalMinorUnits ?? 0,
        currency: order.currency,
        paymentMethod: 'card',
      });
      orderSagaService.advanceStep(order.id, 'authorize_payment', 'confirm_commerce', pilotCountry);
      dispatchService.acquireLease(order.id, 'usr-cour-pilot-1', 120);
      orderSagaService.advanceStep(order.id, 'confirm_commerce', 'assign_courier', pilotCountry);
      orderSagaService.advanceStep(order.id, 'assign_courier', 'capture_payment', pilotCountry);
      pushStep(t('mon_t2_step1', { order: order.orderNumber }));

      broker.setServiceHealth('payments-service', 'down');
      pushStep(t('mon_t2_step2'));
      broker.setServiceHealth('payments-service', 'up');

      const compensated = await orderSagaService.executeCompensations(
        order.id,
        'capture_payment',
        'Permanent payment capture failure simulation',
        pilotCountry
      );
      const passed = compensated?.status === 'compensated';
      appendOrders([
        {
          ...order,
          status: 'cancelled',
          paymentStatus: 'refunded',
          cancellationReason: t('mon_test2_summary', { order: order.orderNumber }),
        },
      ]);
      pushStep(t('mon_t2_step3', { status: compensated?.status || 'failed', tx: auth.transaction.id }));

      persistTestResult({
        id: `ft-${Date.now().toString(36)}`,
        testKey: 'mon_test2_title',
        region: pilotCountry,
        startedAtUtc,
        completedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
        passed,
        stepsLog: steps,
        summary: t('mon_test2_summary', { order: order.orderNumber }),
      });
      showToast(t('mon_test_done_toast'), passed ? 'success' : 'error');
    } finally {
      setRunningTestKey(null);
    }
  };

  const runGuidedTest3PrimaryFailover = async () => {
    if (isReadOnlyRegional || runningTestKey) return;
    setRunningTestKey('test3');
    const startedAtUtc = new Date().toISOString().replace('.000Z', 'Z');
    const steps: string[] = [];
    const pushStep = (msg: string) => {
      steps.push(msg);
      setLiveNarration([...steps]);
    };

    try {
      const targetCountry: CountryCode = 'CO';
      const failoverState = regionNodes.failoverPrimary(targetCountry);
      pushStep(
        t('mon_t3_step1', {
          node: failoverState.nodeId,
          leader: failoverState.activeLeader,
          term: failoverState.term,
        })
      );

      await broker.publish({
        sourceService: 'order-service',
        type: 'NODE_FAILOVER_PROMOTED',
        region: targetCountry,
        targetServices: ['notification-service'],
        payload: { nodeId: failoverState.nodeId, term: failoverState.term },
      });

      const afterWrite = regionNodes.writeToPartition(targetCountry, 'ORDER_REPLICA_WRITE', `ord-${Date.now().toString(36)}`, {
        note: 'Written while primary down',
      });
      pushStep(
        t('mon_t3_step2', {
          pending: afterWrite.pendingReplicationCount,
          lag: afterWrite.replicationLagMs,
        })
      );

      await new Promise((r) => setTimeout(r, 300));
      regionNodes.restorePrimary(targetCountry);
      const synced = regionNodes.syncReplica(targetCountry);
      await broker.publish({
        sourceService: 'analytics-service',
        type: 'REPLICA_SYNC_COMPLETED',
        region: targetCountry,
        targetServices: ['notification-service'],
        payload: { nodeId: synced.nodeId, lagMs: synced.replicationLagMs },
      });
      const passed = synced.activeLeader === 'primary' && synced.pendingReplicationCount === 0;
      pushStep(t('mon_t3_step3', { lag: synced.replicationLagMs }));

      persistTestResult({
        id: `ft-${Date.now().toString(36)}`,
        testKey: 'mon_test3_title',
        region: targetCountry,
        startedAtUtc,
        completedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
        passed,
        stepsLog: steps,
        summary: t('mon_test3_summary', { node: synced.nodeId }),
      });
      showToast(t('mon_test_done_toast'), passed ? 'success' : 'error');
    } finally {
      setRunningTestKey(null);
    }
  };

  const runGuidedTest4Idempotency = async () => {
    if (isReadOnlyRegional || runningTestKey) return;
    setRunningTestKey('test4');
    const startedAtUtc = new Date().toISOString().replace('.000Z', 'Z');
    const steps: string[] = [];
    const pushStep = (msg: string) => {
      steps.push(msg);
      setLiveNarration([...steps]);
    };

    try {
      const fixedKey = `idemp-test-${Date.now().toString(36)}`;
      pushStep(t('mon_t4_step1', { key: fixedKey }));

      const first = await broker.request({
        sourceService: 'order-service',
        targetService: 'payments-service',
        eventType: 'PAYMENT_AUTHORIZE_REQUEST',
        region: 'US',
        idempotencyKey: fixedKey,
        payload: {
          orderId: `ord-${fixedKey}`,
          amountMinorUnits: 2590,
          currency: 'USD',
          paymentMethod: 'card',
          idempotencyKey: fixedKey,
        },
      });
      pushStep(t('mon_t4_step2', { id: first.event.id }));

      const second = await broker.request({
        sourceService: 'order-service',
        targetService: 'payments-service',
        eventType: 'PAYMENT_AUTHORIZE_REQUEST',
        region: 'US',
        idempotencyKey: fixedKey,
        payload: {
          orderId: `ord-${fixedKey}`,
          amountMinorUnits: 2590,
          currency: 'USD',
          paymentMethod: 'card',
          idempotencyKey: fixedKey,
        },
      });

      const passed = Boolean(second.event.isDuplicateIgnored);
      pushStep(t('mon_t4_step3', { ignored: String(passed) }));

      persistTestResult({
        id: `ft-${Date.now().toString(36)}`,
        testKey: 'mon_test4_title',
        region: 'US',
        startedAtUtc,
        completedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
        passed,
        stepsLog: steps,
        summary: t('mon_test4_summary', { key: fixedKey }),
      });
      showToast(t('mon_test_done_toast'), passed ? 'success' : 'error');
    } finally {
      setRunningTestKey(null);
    }
  };

  const runGuidedTest5DlqAndReset = async () => {
    if (isReadOnlyRegional || runningTestKey) return;
    setRunningTestKey('test5');
    const startedAtUtc = new Date().toISOString().replace('.000Z', 'Z');
    const steps: string[] = [];
    const pushStep = (msg: string) => {
      steps.push(msg);
      setLiveNarration([...steps]);
    };

    try {
      broker.resetAllServices();
      pushStep(t('mon_t5_step1'));
      const retriedCount = await broker.retryAllFailed();
      pushStep(t('mon_t5_step2', { count: retriedCount }));

      persistTestResult({
        id: `ft-${Date.now().toString(36)}`,
        testKey: 'mon_test5_title',
        region: 'CO',
        startedAtUtc,
        completedAtUtc: new Date().toISOString().replace('.000Z', 'Z'),
        passed: true,
        stepsLog: steps,
        summary: t('mon_test5_summary', { count: retriedCount }),
      });
      showToast(t('mon_test_done_toast'), 'success');
    } finally {
      setRunningTestKey(null);
    }
  };

  const handleSimulateAddCountry = () => {
    if (isReadOnlyRegional) return;
    const draft = registerSimulatedCountryDraft();
    setSimCountry(draft);
    showToast(t('mon_toast_country_draft_created', { code: draft.code }), 'info');
  };

  const handleRateLimitBurstTest = () => {
    if (isReadOnlyRegional) return;
    apiGateway.resetRateLimiter();
    const rep = apiGateway.simulateRateLimitBurst();
    setRateLimitReport(rep);
    showToast(
      t('mon_toast_rate_limit', { accepted: rep.accepted, blocked: rep.blocked429 }),
      'warning'
    );
  };

  const handleExportTestResultsCsv = () => {
    if (testResults.length === 0) return;
    const header = ['ID', 'TEST', 'REGION', 'STARTED_UTC', 'COMPLETED_UTC', 'PASSED', 'SUMMARY'];
    const lines = [header.join(',')];
    for (const r of testResults) {
      lines.push(
        [
          r.id,
          `"${t(r.testKey)}"`,
          r.region,
          r.startedAtUtc,
          r.completedAtUtc,
          String(r.passed),
          `"${r.summary.replace(/"/g, '""')}"`,
        ].join(',')
      );
    }
    const content = 'data:text/csv;charset=utf-8,' + lines.join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(content);
    a.download = `smartrestaurant_failure_tests_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const statusLabel = (st: string) => {
    if (st === 'completed') return t('mon_status_completed');
    if (st === 'processing') return t('mon_status_processing');
    if (st === 'pending') return t('mon_status_pending');
    if (st === 'failed') return t('mon_status_failed');
    if (st === 'up' || st === 'healthy') return t('mon_service_up');
    if (st === 'degraded') return t('mon_service_degraded');
    if (st === 'down') return t('mon_service_down');
    return st;
  };

  return (
    <div className="p-2 lg:p-4 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Academic Banner + Controls */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {t('mon_badge_academic')}
              </span>
              {isReadOnlyRegional && scopedCountry && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>{t('mon_readonly_badge', { country: scopedCountry })}</span>
                </span>
              )}
              <span className="text-xs font-mono text-emerald-400">
                Lamport: L={gatewayMetrics.lamport} · 11 {t('mon_subsystems_unit')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white flex items-center gap-2">
              <Network className="w-6 h-6 text-amber-400" />
              <span>{t('dsm_title')}</span>
            </h1>

            <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
              {t('mon_academic_notice')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {currentUser?.role === 'platform_admin' && (
              <>
                <Link
                  to="/staff/app/sistema"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('staff_nav_system')}</span>
                </Link>
                <Link
                  to="/staff/app/prueba-localizacion"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('staff_nav_loc_test')}</span>
                </Link>
              </>
            )}

            {!isReadOnlyRegional && (
              <>
                <button
                  disabled={isDemoRunning}
                  onClick={runFullDistributedDemo}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 shadow-md transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isDemoRunning ? t('mon_demo_running') : t('btn_run_demo_flow')}</span>
                </button>

                {failedEventsCount > 0 && (
                  <button
                    onClick={retryFailedEvents}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('mon_retry_dlq')} ({failedEventsCount})</span>
                  </button>
                )}

                <button
                  onClick={handleResetAllServices}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('mon_reset_services')}</span>
                </button>

                <button
                  onClick={clearEvents}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title={t('btn_clear_events')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {isDemoRunning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center font-mono">
                {demoStep}
              </span>
              <span className="font-semibold text-amber-300">{demoStepMessage}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {t('mon_demo_step_of', { step: demoStep, total: 5 })}
            </span>
          </div>
        )}
      </div>

      {/* Animated Architecture Diagram (Section 8.8) */}
      <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">{t('arch_flow')}</h2>
            <p className="text-xs text-slate-400">{t('mon_arch_subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{t('mon_broker_live_label')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center text-center">
          <div className="md:col-span-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center mb-1.5">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-white">{t('mon_diag_clients')}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{t('mon_diag_clients_sub')}</p>
          </div>

          <div className="hidden md:flex justify-center">
            <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>

          <div className="md:col-span-2 p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 mx-auto flex items-center justify-center mb-1.5">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-white">{t('mon_diag_gateway')}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Req: {gatewayMetrics.totalRequests} · 429: {gatewayMetrics.blockedRateLimit}
            </p>
          </div>

          <div className="hidden md:flex justify-center">
            <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>

          <div className="md:col-span-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="font-bold text-xs text-amber-300">{t('mon_diag_broker')}</h3>
            </div>
            <p className="text-[10px] text-amber-200/80 mb-2">{t('mon_diag_broker_sub')}</p>
            <div className="flex flex-wrap justify-center gap-1">
              {visibleNodes.map((n) => (
                <span
                  key={n.nodeId}
                  className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border ${
                    n.activeLeader === 'primary'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {n.nodeId} ({n.activeLeader === 'primary' ? 'P' : 'R'})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guided Interactive Failure Tests 1-5 (Section 8.6) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t('mon_failure_tests_title')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t('mon_failure_tests_desc')}</p>
          </div>

          {testResults.length > 0 && (
            <button
              onClick={handleExportTestResultsCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{t('export_csv')} ({testResults.length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            disabled={isReadOnlyRegional || Boolean(runningTestKey)}
            onClick={runGuidedTest1Recovery}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left space-y-1.5 disabled:opacity-50 transition-colors"
          >
            <div className="text-[10px] font-mono text-amber-400 font-bold">01</div>
            <div className="text-xs font-bold text-white">{t('mon_test1_title')}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{t('mon_test1_desc')}</div>
          </button>

          <button
            disabled={isReadOnlyRegional || Boolean(runningTestKey)}
            onClick={runGuidedTest2SagaRollback}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-left space-y-1.5 disabled:opacity-50 transition-colors"
          >
            <div className="text-[10px] font-mono text-rose-400 font-bold">02</div>
            <div className="text-xs font-bold text-white">{t('mon_test2_title')}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{t('mon_test2_desc')}</div>
          </button>

          <button
            disabled={isReadOnlyRegional || Boolean(runningTestKey)}
            onClick={runGuidedTest3PrimaryFailover}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-left space-y-1.5 disabled:opacity-50 transition-colors"
          >
            <div className="text-[10px] font-mono text-sky-400 font-bold">03</div>
            <div className="text-xs font-bold text-white">{t('mon_test3_title')}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{t('mon_test3_desc')}</div>
          </button>

          <button
            disabled={isReadOnlyRegional || Boolean(runningTestKey)}
            onClick={runGuidedTest4Idempotency}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left space-y-1.5 disabled:opacity-50 transition-colors"
          >
            <div className="text-[10px] font-mono text-emerald-400 font-bold">04</div>
            <div className="text-xs font-bold text-white">{t('mon_test4_title')}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{t('mon_test4_desc')}</div>
          </button>

          <button
            disabled={isReadOnlyRegional || Boolean(runningTestKey)}
            onClick={runGuidedTest5DlqAndReset}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-left space-y-1.5 disabled:opacity-50 transition-colors"
          >
            <div className="text-[10px] font-mono text-purple-400 font-bold">05</div>
            <div className="text-xs font-bold text-white">{t('mon_test5_title')}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{t('mon_test5_desc')}</div>
          </button>
        </div>

        {/* Live Narrated Step Trace */}
        {liveNarration.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1.5 text-xs">
            <div className="font-bold text-amber-300 font-mono text-[11px] uppercase">
              {t('mon_narration_title')}
            </div>
            {liveNarration.map((line, i) => (
              <div key={i} className="text-slate-200 font-mono text-[11px]">
                [{i + 1}] {line}
              </div>
            ))}
          </div>
        )}

        {/* Saved Failure Test Results Log */}
        {testResults.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300">{t('mon_test_log_title')}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {testResults.slice(0, 6).map((res) => (
                <div
                  key={res.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-2 ${
                    res.passed
                      ? 'bg-slate-950 border-emerald-500/30'
                      : 'bg-rose-950/30 border-rose-500/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {res.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{t(res.testKey)}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">{res.summary}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      UTC: {res.completedAtUtc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5 Regional Logical Nodes + Primary/Replica Failover + Partition & NTP */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>{t('mon_nodes_title')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t('mon_nodes_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {visibleNodes.map((n) => {
            const counts = regionNodes.getPartitionRecordsCount(n.country);
            return (
              <div
                key={n.nodeId}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{n.nodeId}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                      n.activeLeader === 'primary'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {n.activeLeader} (T{n.term})
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-slate-400">
                  <div>
                    Primary:{' '}
                    <span className={n.primaryStatus === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
                      {n.primaryStatus.toUpperCase()}
                    </span>{' '}
                    · Replica: <span className="text-emerald-400">{n.replicaStatus.toUpperCase()}</span>
                  </div>
                  <div>
                    Lag: <span className="text-slate-200">{n.replicationLagMs}ms</span> · Pending:{' '}
                    <span className="text-amber-300">{n.pendingReplicationCount}</span>
                  </div>
                  <div>
                    NTP: <span className="text-sky-300">{n.ntpOffsetMs >= 0 ? `+${n.ntpOffsetMs}` : n.ntpOffsetMs}ms</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate" title={n.partitionKey}>
                    {n.partitionKey} ({counts.primaryCount}/{counts.replicaCount})
                  </div>
                </div>

                {!isReadOnlyRegional && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {n.primaryStatus === 'up' ? (
                      <button
                        onClick={() => handleFailoverNode(n.country)}
                        className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold"
                      >
                        {t('mon_btn_failover')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestoreNode(n.country)}
                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                      >
                        {t('mon_btn_restore')}
                      </button>
                    )}
                    <button
                      onClick={() => handleSyncReplica(n.country)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                    >
                      {t('mon_btn_sync_replica')}
                    </button>
                    <button
                      onClick={() => handleSyncNtp(n.country)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-bold"
                    >
                      NTP
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 11 Domain Subsystems Mesh */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">{t('services_mesh')} (11)</h2>
          <span className="text-xs text-slate-400">{t('mon_services_hint')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {servicesHealth.map((svc: ServiceHealth) => {
            const isDown = svc.status === 'down';
            const isDegraded = svc.status === 'degraded';
            const serviceId = (svc.id || svc.service || '') as ServiceName;
            return (
              <div
                key={serviceId}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDown
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                    : isDegraded
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white truncate pr-2">
                      {svc.nameKey ? t(svc.nameKey) : serviceId}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isDown
                          ? 'bg-rose-600 text-white'
                          : isDegraded
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {statusLabel(svc.status)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {svc.descriptionKey ? t(svc.descriptionKey) : ''}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[9px]">{t('mon_col_events')}</span>
                    <span className="font-bold text-slate-200">
                      {svc.processedEventsCount || svc.processedCount || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">SLA</span>
                    <span className="font-bold text-slate-200">{svc.uptimePercent || 99.9}%</span>
                  </div>
                  {!isReadOnlyRegional && (
                    <button
                      onClick={() => toggleServiceHealth(serviceId)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        isDown
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isDown ? t('mon_btn_restore') : t('mon_btn_fail')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NameService + Catalog Cache + Dispatch Mutual Exclusion Leases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NameService Directory */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3 overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{t('mon_nameservice_title')}</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">
              Hit Rate: {nameStats.hitRatePct}% (TTL {nameStats.ttlSeconds}s)
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-[11px] text-left font-mono">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 pr-2">{t('mon_ns_col_logical')}</th>
                  <th className="py-2 px-2">{t('mon_ns_col_endpoint')}</th>
                  <th className="py-2 px-2">Leader</th>
                  <th className="py-2 pl-2 text-right">TTL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {nameDirectory.slice(0, 20).map((entry) => (
                  <tr key={entry.logicalName}>
                    <td className="py-1.5 pr-2 text-amber-300 font-bold">{entry.logicalName}</td>
                    <td className="py-1.5 px-2 text-slate-300">{entry.endpoint}</td>
                    <td className="py-1.5 px-2 text-emerald-400 uppercase">{entry.leaderTarget}</td>
                    <td className="py-1.5 pl-2 text-right text-slate-400">{entry.ttlSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catalog TTL Cache + Dispatch Leases */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-2 text-xs">
            <h3 className="text-sm font-bold text-white">{t('mon_catalog_cache_title')}</h3>
            <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Hits</div>
                <div className="text-base font-bold text-emerald-400">{catalogStats.hits}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Hit %</div>
                <div className="text-base font-bold text-amber-400">{catalogStats.hitRatePct}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">TTL</div>
                <div className="text-base font-bold text-white">{catalogStats.ttlSeconds}s</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-2 text-xs">
            <h3 className="text-sm font-bold text-white">{t('mon_leases_title')} ({activeLeases.length})</h3>
            {activeLeases.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">{t('mon_leases_empty')}</p>
            ) : (
              <div className="space-y-1.5 font-mono text-[11px]">
                {activeLeases.map((l) => (
                  <div key={l.orderId} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-amber-300 truncate">{l.orderId}</span>
                    <span className="text-emerald-400">{l.courierId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SD Objectives Matrix ("Matriz de objetivos del SD", Section 8.7) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t('mon_matrix_title')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t('mon_matrix_desc')}</p>
          </div>

          {!isReadOnlyRegional && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSimulateAddCountry}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('mon_btn_sim_country')}</span>
              </button>
              <button
                onClick={handleRateLimitBurstTest}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-bold text-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('mon_btn_rate_limit')}</span>
              </button>
            </div>
          )}
        </div>

        {(simCountry || rateLimitReport) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {simCountry && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-amber-300 mr-2">{simCountry.code}</span>
                  <span className="text-white font-bold">{simCountry.name.es}</span>
                  <span className="block text-[10px] font-mono text-slate-400">
                    {simCountry.currency} · {simCountry.timeZone} · enabled=false ({simCountry.registeredAtUtc})
                  </span>
                </div>
                {!isReadOnlyRegional && (
                  <button
                    onClick={() => {
                      clearSimulatedCountryDraft();
                      setSimCountry(null);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {rateLimitReport && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/30 font-mono text-[11px] flex items-center justify-between">
                <span>
                  Gateway Burst ({rateLimitReport.sent} req):{' '}
                  <strong className="text-emerald-400">{rateLimitReport.accepted} OK</strong> ·{' '}
                  <strong className="text-rose-400">{rateLimitReport.blocked429} HTTP 429</strong>
                </span>
              </div>
            )}
          </div>
        )}

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <th className="py-2.5 px-3">{t('mon_mat_col_obj')}</th>
              <th className="py-2.5 px-3">{t('mon_mat_col_impl')}</th>
              <th className="py-2.5 px-3 text-right">{t('mon_mat_col_demo')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_transparency')}</td>
              <td className="py-2.5 px-3 text-slate-300">{t('mon_obj_transparency_desc')}</td>
              <td className="py-2.5 px-3 text-right font-mono text-amber-300">NameService + Restaura</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_reliability')}</td>
              <td className="py-2.5 px-3 text-slate-300">{t('mon_obj_reliability_desc')}</td>
              <td className="py-2.5 px-3 text-right font-mono text-emerald-400">Primary/Replica + DLQ</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_performance')}</td>
              <td className="py-2.5 px-3 text-slate-300">
                {t('mon_obj_performance_desc', { hit: catalogStats.hitRatePct, ttl: catalogStats.ttlSeconds })}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-amber-300">
                {catalogStats.hitRatePct}% Hit
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_scalability')}</td>
              <td className="py-2.5 px-3 text-slate-300">{t('mon_obj_scalability_desc')}</td>
              <td className="py-2.5 px-3 text-right">
                <button
                  disabled={isReadOnlyRegional}
                  onClick={handleSimulateAddCountry}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] disabled:opacity-40"
                >
                  {t('mon_btn_sim_country')}
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_openness')}</td>
              <td className="py-2.5 px-3 text-slate-300">{t('mon_obj_openness_desc')}</td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-300">Envelope v1.0 UTF-8</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_security')}</td>
              <td className="py-2.5 px-3 text-slate-300">{t('mon_obj_security_desc')}</td>
              <td className="py-2.5 px-3 text-right">
                <button
                  disabled={isReadOnlyRegional}
                  onClick={handleRateLimitBurstTest}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-[11px] disabled:opacity-40"
                >
                  {t('mon_btn_rate_limit')}
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-bold text-white">{t('mon_obj_acid')}</td>
              <td className="py-2.5 px-3 text-slate-300">{t('mon_obj_acid_desc')}</td>
              <td className="py-2.5 px-3 text-right">
                <button
                  disabled={isReadOnlyRegional || Boolean(runningTestKey)}
                  onClick={runGuidedTest2SagaRollback}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-[11px] disabled:opacity-40"
                >
                  {t('mon_test2_title')}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Live Event Stream Queue */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-950/50">
          <div>
            <h2 className="text-sm font-bold text-white">{t('event_stream')}</h2>
            <p className="text-xs text-slate-400">
              {t('mon_stream_summary', {
                total: visibleEvents.length,
                completed: completedEventsCount,
                failed: failedEventsCount,
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isReadOnlyRegional && (
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
              >
                <option value="ALL">ALL</option>
                {getAllRegionProfiles().map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-1">
              {['all', 'completed', 'processing', 'pending', 'failed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors ${
                    filterStatus === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {st === 'all' ? t('filter_all') : statusLabel(st)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">{t('event_id')}</th>
                <th className="py-2.5 px-3">{t('event_type')}</th>
                <th className="py-2.5 px-3">{t('mon_col_flow')}</th>
                <th className="py-2.5 px-3">{t('mon_col_region_lamport')}</th>
                <th className="py-2.5 px-3">{t('event_status')}</th>
                <th className="py-2.5 px-3 font-mono">{t('mon_col_idempotency')}</th>
                <th className="py-2.5 px-3 font-mono">{t('mon_col_utc')}</th>
                <th className="py-2.5 px-4 text-right">{t('mon_col_detail')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {visibleEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    {t('mon_no_events')}
                  </td>
                </tr>
              ) : (
                visibleEvents.slice(0, 60).map((ev: DistributedEvent) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-200">{ev.id.slice(0, 14)}</td>
                    <td className="py-2.5 px-3 font-semibold text-amber-300 font-sans">
                      {ev.eventType || ev.type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      <span>{ev.sourceService}</span>
                      <span className="text-slate-500 mx-1">→</span>
                      <span>{ev.targetService}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-sky-300">
                      {ev.region || 'CO'} · L={ev.lamport ?? ev.lamportClock ?? 0}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.isDuplicateIgnored
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : ev.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ev.status === 'failed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ev.isDuplicateIgnored ? t('mon_dup_ignored') : `${statusLabel(ev.status)} (${ev.attempts})`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-slate-400 truncate max-w-[130px]">
                      {ev.idempotencyKey}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {(ev.createdAtUtc || ev.timestamp).slice(11, 19)}Z
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap font-sans">
                      <button
                        onClick={() => setInspectedEvent(ev)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] font-bold"
                      >
                        {t('inspect_payload')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Canonical Envelope & Attempt Timeline Inspector Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700 text-white">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/70">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white font-mono">
                  {t('mon_modal_envelope')}: {inspectedEvent.id}
                </h2>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 font-mono text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] pb-3 border-b border-slate-800">
                <div>
                  <span className="text-slate-400 block">{t('event_type')}:</span>
                  <span className="text-amber-400 font-bold">{inspectedEvent.eventType || inspectedEvent.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t('event_status')}:</span>
                  <span className="text-emerald-400 font-bold">
                    {statusLabel(inspectedEvent.status)} ({inspectedEvent.attempts}/{inspectedEvent.maxAttempts})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Region / Lamport:</span>
                  <span className="text-sky-300">
                    {inspectedEvent.region || 'CO'} · L={inspectedEvent.lamport ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t('mon_modal_source')}:</span>
                  <span className="text-slate-200">{inspectedEvent.sourceService}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t('mon_modal_target')}:</span>
                  <span className="text-slate-200">{inspectedEvent.targetService}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Correlation / Trace:</span>
                  <span className="text-slate-300 text-[10px]">{inspectedEvent.correlationId}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 block">{t('mon_col_idempotency')}:</span>
                  <span className="text-slate-300 text-[10px]">{inspectedEvent.idempotencyKey}</span>
                </div>
              </div>

              {inspectedEvent.attemptHistory && inspectedEvent.attemptHistory.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 block text-[11px]">{t('mon_modal_timeline')}:</span>
                  <div className="space-y-1">
                    {inspectedEvent.attemptHistory.map((h) => (
                      <div
                        key={h.attempt}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            #{h.attempt} · {statusLabel(h.status)}
                          </span>
                          {h.backoffMs && <span className="text-amber-300">(backoff {h.backoffMs}ms)</span>}
                        </div>
                        <span className="text-slate-400">{h.timestampUtc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(inspectedEvent.errorDetails || inspectedEvent.error) && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                  <strong>{t('mon_modal_error')}:</strong> {inspectedEvent.errorDetails || inspectedEvent.error}
                </div>
              )}

              <div>
                <span className="text-slate-400 block mb-1 text-[11px]">Payload JSON (UTF-8):</span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 text-[11px] overflow-x-auto max-h-56">
                  {JSON.stringify(inspectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectedEvent(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-sans"
              >
                {t('btn_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
