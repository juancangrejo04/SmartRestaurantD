import { CountryCode, RegionProfile } from '../types';

const LAMPORT_STORAGE_KEY = 'smartrestaurant_v4_lamport_clock';
const NTP_STORAGE_KEY = 'smartrestaurant_v4_ntp_offsets';

const DEFAULT_OFFSETS: Record<CountryCode, number> = {
  CO: 12,
  BR: -18,
  US: 5,
  FR: -9,
  JP: 14,
};

/**
 * Simulated logical Lamport clock + Simulated per-region NTP clock synchronization
 * plus deterministic IANA timezone wall-clock <-> UTC ISO conversions.
 */
class DistributedClockService {
  private static instance: DistributedClockService;
  private lamportValue: number = 100;
  private ntpOffsets: Record<CountryCode, number> = { ...DEFAULT_OFFSETS };

  private constructor() {
    this.load();
  }

  public static getInstance(): DistributedClockService {
    if (!DistributedClockService.instance) {
      DistributedClockService.instance = new DistributedClockService();
    }
    return DistributedClockService.instance;
  }

  private load(): void {
    try {
      const savedLamport = localStorage.getItem(LAMPORT_STORAGE_KEY);
      if (savedLamport) {
        const parsed = Number(savedLamport);
        if (!Number.isNaN(parsed) && parsed > 0) {
          this.lamportValue = parsed;
        }
      }
      const savedNtp = localStorage.getItem(NTP_STORAGE_KEY);
      if (savedNtp) {
        this.ntpOffsets = { ...DEFAULT_OFFSETS, ...JSON.parse(savedNtp) };
      }
    } catch {
      // Safe browser fallback
    }
  }

  private save(): void {
    try {
      localStorage.setItem(LAMPORT_STORAGE_KEY, String(this.lamportValue));
      localStorage.setItem(NTP_STORAGE_KEY, JSON.stringify(this.ntpOffsets));
    } catch {
      // Safe browser fallback
    }
  }

  /**
   * Local send/internal event tick: L = L + 1
   */
  public tick(): number {
    this.lamportValue += 1;
    this.save();
    return this.lamportValue;
  }

  /**
   * Message receipt update: L = max(L, receivedLamport) + 1
   */
  public receive(remoteLamport: number): number {
    this.lamportValue = Math.max(this.lamportValue, remoteLamport || 0) + 1;
    this.save();
    return this.lamportValue;
  }

  public getLamport(): number {
    return this.lamportValue;
  }

  public resetLamport(value: number = 100): void {
    this.lamportValue = value;
    this.save();
  }

  public getNtpOffsetMs(region: CountryCode): number {
    return this.ntpOffsets[region] ?? 0;
  }

  public getAllNtpOffsets(): Record<CountryCode, number> {
    return { ...this.ntpOffsets };
  }

  public getNodeUtcNow(region: CountryCode): Date {
    const offset = this.getNtpOffsetMs(region);
    return new Date(Date.now() + offset);
  }

  public syncNodeClock(region: CountryCode): number {
    this.ntpOffsets[region] = 0;
    this.save();
    return 0;
  }

  public syncAllNtpClocks(): void {
    (Object.keys(this.ntpOffsets) as CountryCode[]).forEach((code) => {
      this.ntpOffsets[code] = 0;
    });
    this.save();
  }

  public injectDrift(region: CountryCode, offsetMs: number): void {
    this.ntpOffsets[region] = offsetMs;
    this.save();
  }
}

export const distributedClock = DistributedClockService.getInstance();

/**
 * Converts a local wall-clock date ("YYYY-MM-DD") and time ("HH:mm") in an IANA timeZone
 * to its exact canonical UTC ISO-8601 instant ("YYYY-MM-DDTHH:mm:ssZ"), handling DST transitions.
 */
export function localDateTimeToUtcIso(
  dateStr: string,
  timeStr: string,
  timeZone: string
): string {
  const [yStr, mStr, dStr] = dateStr.split('-');
  const [hStr, minStr] = timeStr.split(':');
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  const hour = Number(hStr);
  const minute = Number(minStr);

  const targetWallUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidateMs = targetWallUtc;

  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  for (let i = 0; i < 2; i++) {
    const parts = dtf.formatToParts(new Date(candidateMs));
    const pYear = Number(parts.find((p) => p.type === 'year')?.value || year);
    const pMonth = Number(parts.find((p) => p.type === 'month')?.value || month);
    const pDay = Number(parts.find((p) => p.type === 'day')?.value || day);
    let pHour = Number(parts.find((p) => p.type === 'hour')?.value || hour);
    if (pHour === 24) pHour = 0;
    const pMinute = Number(parts.find((p) => p.type === 'minute')?.value || minute);

    const renderedWallUtc = Date.UTC(pYear, pMonth - 1, pDay, pHour, pMinute, 0);
    const diffMs = renderedWallUtc - targetWallUtc;
    candidateMs -= diffMs;
  }

  return new Date(candidateMs).toISOString().replace('.000Z', 'Z');
}

/**
 * Formats a UTC instant in the target RegionProfile's localized date & time format.
 */
export function formatUtcForProfile(utcIso: string, profile: RegionProfile): string {
  const date = new Date(utcIso);
  if (Number.isNaN(date.getTime())) return utcIso;

  const dtf = new Intl.DateTimeFormat(profile.defaultLanguage, {
    timeZone: profile.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: profile.clockFormat === '12h',
  });

  const parts = dtf.formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value || '2026';
  const m = parts.find((p) => p.type === 'month')?.value || '01';
  const d = parts.find((p) => p.type === 'day')?.value || '01';

  const datePart =
    profile.dateFormatPattern === 'dd/mm/aaaa'
      ? `${d}/${m}/${y}`
      : profile.dateFormatPattern === 'mm/dd/aaaa'
      ? `${m}/${d}/${y}`
      : `${y}/${m}/${d}`;

  const timePart = date.toLocaleTimeString(profile.defaultLanguage, {
    timeZone: profile.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: profile.clockFormat === '12h',
  });

  const sep = profile.defaultLanguage === 'fr' || profile.defaultLanguage === 'ja' ? ' ' : ', ';
  return `${datePart}${sep}${timePart}`;
}
