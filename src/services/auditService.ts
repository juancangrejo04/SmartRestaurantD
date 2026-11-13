import { AuditLogEntry } from '../types';
import { auditStore } from '../core/auditStore';
import { broker } from '../core/broker';

export class AuditService {
  private static instance: AuditService;

  private constructor() {
    broker.subscribe('AUDIT_RECORD', 'analytics-service', async (event) => {
      if (event.payload && event.payload.actorId && event.payload.action) {
        auditStore.record({
          actorId: String(event.payload.actorId),
          actorName: String(event.payload.actorName || ''),
          actorRole: String(event.payload.actorRole || 'system'),
          action: event.payload.action,
          targetId: event.payload.targetId ? String(event.payload.targetId) : undefined,
          targetName: event.payload.targetName ? String(event.payload.targetName) : undefined,
          details: String(event.payload.details || ''),
          region: event.payload.region,
        });
      }
    });
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  public getLogs(): AuditLogEntry[] {
    return auditStore.getLogs();
  }

  public getAll(): AuditLogEntry[] {
    return auditStore.getLogs();
  }

  public record(entry: Omit<AuditLogEntry, 'id' | 'timestampUtc'>): AuditLogEntry {
    return auditStore.record(entry);
  }

  public clear(): void {
    auditStore.clear();
  }
}

export const auditService = AuditService.getInstance();
