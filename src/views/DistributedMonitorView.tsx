import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DistributedEvent, ServiceHealth, ServiceName } from '../types';
import {
  Network,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Server,
  Zap,
  Activity,
  Code2,
  X,
  RefreshCw,
  Trash2,
  Layers,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react';

export const DistributedMonitorView: React.FC = () => {
  const {
    t,
    events,
    servicesHealth,
    toggleServiceHealth,
    retryFailedEvents,
    clearEvents,
    runFullDistributedDemo,
    isDemoRunning,
    demoStep,
    demoStepMessage,
    resetToFactoryDefaults,
  } = useApp();

  const [inspectedEvent, setInspectedEvent] = useState<DistributedEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const failedEventsCount = events.filter((e: DistributedEvent) => e.status === 'failed').length;
  const completedEventsCount = events.filter((e: DistributedEvent) => e.status === 'completed').length;

  const filteredEvents =
    filterType === 'all'
      ? events
      : events.filter((e: DistributedEvent) => e.status === filterType);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Academic Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PROYECTO ACADÉMICO DE ARQUITECTURA DISTRIBUIDA
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-mono">Consistencia Eventual & Idempotencia</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Network className="w-6 h-6 text-amber-400" />
              <span>{t('dsm_title')}</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Simulación de arquitectura dirigida por eventos (EDA) con 7 servicios desacoplados,
              despacho asíncrono, detección de duplicados por clave de idempotencia y cola de reintentos
              (Dead Letter Queue).
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              disabled={isDemoRunning}
              onClick={runFullDistributedDemo}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isDemoRunning ? 'Simulación en Curso...' : t('btn_run_demo_flow')}</span>
            </button>

            <button
              onClick={() => toggleServiceHealth('kitchen-service')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
              title="Alternar estado de Kitchen Service para probar tolerancia a fallos"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simular Caos (Cocina)</span>
            </button>

            {failedEventsCount > 0 && (
              <button
                onClick={retryFailedEvents}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reintentar ({failedEventsCount})</span>
              </button>
            )}

            <button
              onClick={clearEvents}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title={t('btn_clear_events')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Step Demo Banner */}
        {isDemoRunning && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center font-mono">
                {demoStep}
              </span>
              <span className="font-semibold text-amber-300">{demoStepMessage}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Paso {demoStep} de 5</span>
          </div>
        )}
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('arch_flow')}</h2>
            <p className="text-xs text-slate-500">
              Topología lógica del sistema distribuido y enrutamiento del bus
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Mensajería asíncrona activa</span>
          </div>
        </div>

        {/* Diagram Flow Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
          {/* Node 1: Client */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-1.5">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900">1. Clientes SPA</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Móvil QR / Meseros / Web</p>
          </div>

          <div className="hidden md:flex justify-center text-slate-300">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Node 2: API Gateway */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-1.5">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900">2. API Gateway</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Enrutador & Auth Token</p>
          </div>

          <div className="hidden md:flex justify-center text-slate-300">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Node 3: Event Bus */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 ring-2 ring-amber-400/20">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 mx-auto flex items-center justify-center mb-1.5 font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-amber-900">3. Internal Event Bus</h3>
            <p className="text-[10px] text-amber-700 mt-0.5">Async Pub/Sub & DLQ</p>
          </div>
        </div>
      </div>

      {/* 7 Domain Services Mesh */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">{t('services_mesh')}</h2>
          <span className="text-xs text-slate-500">
            Haga clic en un servicio para simular fallo o restaurar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicesHealth.map((svc: ServiceHealth) => {
            const isDown = svc.status === 'down';
            const isDegraded = svc.status === 'degraded';

            const serviceId = (svc.id || svc.service || '') as ServiceName;
            return (
              <div
                key={serviceId}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isDown
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : isDegraded
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900 truncate pr-2">
                      {svc.name || serviceId}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isDown
                          ? 'bg-rose-600 text-white'
                          : isDegraded
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {svc.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                    {svc.description || ''}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Eventos</span>
                    <span className="font-bold text-slate-800">{svc.processedEventsCount || svc.processedCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Uptime</span>
                    <span className="font-bold text-slate-800">{svc.uptimePercent || 99.9}%</span>
                  </div>
                  <button
                    onClick={() => toggleServiceHealth(serviceId)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                      isDown
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isDown ? 'Restaurar' : 'Fallo'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Event Stream Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('event_stream')}</h2>
            <p className="text-xs text-slate-500">
              Total: {events.length} eventos · Completados: {completedEventsCount} · Fallidos en DLQ: {failedEventsCount}
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {['all', 'completed', 'pending', 'failed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterType(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase font-mono transition-colors ${
                  filterType === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">{t('event_id')}</th>
                <th className="py-2.5 px-3">{t('event_type')}</th>
                <th className="py-2.5 px-3">Flujo de Servicio</th>
                <th className="py-2.5 px-3">{t('event_status')}</th>
                <th className="py-2.5 px-3 font-mono">Idempotency Key</th>
                <th className="py-2.5 px-3 font-mono">Hora</th>
                <th className="py-2.5 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                    No hay eventos en la cola seleccionada.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev: DistributedEvent) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-800">
                      {ev.id.slice(0, 14)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 font-sans">
                      {ev.eventType || ev.type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="font-semibold text-slate-800">{ev.sourceService}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="font-semibold text-slate-800">{ev.targetService}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ev.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ev.status} ({ev.attempts})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400 truncate max-w-[140px]">
                      {ev.idempotencyKey}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap font-sans">
                      <button
                        onClick={() => setInspectedEvent(ev)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium transition-colors"
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

      {/* Payload Inspection Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white font-mono">
                  Payload Envelope: {inspectedEvent.id}
                </h2>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-slate-800">
                <div>
                  <span className="text-slate-400 block">Tipo:</span>
                  <span className="text-amber-400 font-bold">{inspectedEvent.eventType || inspectedEvent.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Estado / Intentos:</span>
                  <span className="text-emerald-400 font-bold capitalize">
                    {inspectedEvent.status} (Intento {inspectedEvent.attempts} de {inspectedEvent.maxAttempts})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Servicio Emisor:</span>
                  <span className="text-slate-200">{inspectedEvent.sourceService}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Servicio Receptor:</span>
                  <span className="text-slate-200">{inspectedEvent.targetService}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Clave de Idempotencia:</span>
                  <span className="text-slate-300 text-[10px]">{inspectedEvent.idempotencyKey}</span>
                </div>
              </div>

              {(inspectedEvent.errorDetails || inspectedEvent.error) && (
                <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                  <strong>Fallo detectado:</strong> {inspectedEvent.errorDetails || inspectedEvent.error}
                </div>
              )}

              <div>
                <span className="text-slate-400 block mb-1 text-[11px]">Payload JSON:</span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 text-[11px] overflow-x-auto max-h-56">
                  {JSON.stringify(inspectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
