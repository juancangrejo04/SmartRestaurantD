import { AuditLogEntry } from '../types';

const AUDIT_STORAGE_KEY = 'smartrestaurant_v4_audit_logs';

function getDefaultInitialLogs(): AuditLogEntry[] {
  return [
    {
      id: 'audit-init-01',
      actorId: 'usr-plat-admin',
      actorName: 'Sofía Navarro',
      actorRole: 'platform_admin',
      action: 'USER_CREATED',
      targetId: 'usr-owner-01',
      targetName: 'Carlos Mendoza',
      details: 'Asignación de credenciales maestras y marcas Aura Mestiza y Sora.',
      timestampUtc: '2026-11-10T12:00:00Z',
    },
    {
      id: 'audit-init-02',
      actorId: 'usr-owner-01',
      actorName: 'Carlos Mendoza',
      actorRole: 'owner',
      action: 'ROLE_CREATED',
      targetId: 'cajero',
      targetName: 'cajero',
      details: 'Creación de rol personalizado para caja con permisos de cobro y comandas.',
      timestampUtc: '2026-11-10T14:30:00Z',
      region: 'CO',
    },
    {
      id: 'audit-init-03',
      actorId: 'usr-admin-bogota',
      actorName: 'Elena Rostova',
      actorRole: 'branch_admin',
      action: 'USER_CREATED',
      targetId: 'usr-waiter-bogota',
      targetName: 'Andrés Gómez',
      details: 'Alta de personal de salón para sede Aura Mestiza Bogotá.',
      timestampUtc: '2026-11-11T09:15:00Z',
      region: 'CO',
    },
  ];
}

export const auditStore = {
  getLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return getDefaultInitialLogs();
    try {
      return JSON.parse(raw);
    } catch {
      return getDefaultInitialLogs();
    }
  },

  record(entry: Omit<AuditLogEntry, 'id' | 'timestampUtc'>): AuditLogEntry {
    const logs = this.getLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestampUtc: new Date().toISOString().replace('.000Z', 'Z'),
    };
    const updated = [newEntry, ...logs].slice(0, 500);
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
    return newEntry;
  },

  clear(): void {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  },
};
