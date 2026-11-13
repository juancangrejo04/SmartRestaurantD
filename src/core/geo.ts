import { RegionProfile } from '../types';

export interface GeoCoordinates {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

export function normalizeCoords(coord: GeoCoordinates): { latitude: number; longitude: number } {
  return {
    latitude: coord.latitude ?? coord.lat ?? 0,
    longitude: coord.longitude ?? coord.lng ?? 0,
  };
}

/**
 * Standard Haversine distance formula between two GPS coordinates.
 * Returns distance in kilometers.
 */
export function haversineDistanceKm(coord1: GeoCoordinates, coord2: GeoCoordinates): number {
  const c1 = normalizeCoords(coord1);
  const c2 = normalizeCoords(coord2);
  const R = 6371; // Earth's radius in km
  const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
  const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.latitude * Math.PI) / 180) *
      Math.cos((c2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Convert km to miles
 */
export function kmToMiles(km: number): number {
  return Number((km * 0.621371).toFixed(2));
}

/**
 * Format distance according to active RegionProfile (km or mi)
 */
export function formatRegionalDistance(km: number, profile: RegionProfile): string {
  if (profile.distanceUnit === 'mi') {
    const mi = kmToMiles(km);
    return `${mi.toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Estimate travel time in minutes based on distance and average urban courier speed (20 km/h)
 */
export function estimateDeliveryMinutes(km: number, prepTimeMinutes: number = 20): number {
  const travelMinutes = Math.ceil((km / 20) * 60);
  return prepTimeMinutes + Math.max(5, travelMinutes);
}

/**
 * Generate simulated GPS waypoint coordinates between a source and a destination
 * to display in a real-time SVG delivery tracking map.
 */
export function interpolateCoordinates(
  from: GeoCoordinates,
  to: GeoCoordinates,
  fraction: number // 0.0 to 1.0
): { latitude: number; longitude: number } {
  const f = normalizeCoords(from);
  const t = normalizeCoords(to);
  const clamped = Math.max(0, Math.min(1, fraction));
  return {
    latitude: Number((f.latitude + (t.latitude - f.latitude) * clamped).toFixed(6)),
    longitude: Number((f.longitude + (t.longitude - f.longitude) * clamped).toFixed(6)),
  };
}

/**
 * Determine if a branch is currently open in its regional timezone,
 * taking into account its openingHours string (e.g. "11:00 - 23:00") and regional holidays.
 */
export function isBranchOpenNow(
  openingHours: string | undefined,
  profile: RegionProfile
): { isOpen: boolean; holidayKey?: string } {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: profile.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now);

    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    const hour = Number(parts.find((p) => p.type === 'hour')?.value || '12');
    const minute = Number(parts.find((p) => p.type === 'minute')?.value || '0');
    const todayStr = `${year}-${month}-${day}`;

    const holiday = profile.holidays.find((h) => h.date === todayStr);
    if (holiday) {
      return { isOpen: false, holidayKey: holiday.nameKey };
    }

    if (!openingHours) return { isOpen: true };
    const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
    if (!match) return { isOpen: true };

    const openMins = Number(match[1]) * 60 + Number(match[2]);
    let closeMins = Number(match[3]) * 60 + Number(match[4]);
    const nowMins = hour * 60 + minute;
    if (closeMins <= openMins) closeMins += 24 * 60; // crosses midnight

    const isOpen = nowMins >= openMins && nowMins <= closeMins;
    return { isOpen };
  } catch {
    return { isOpen: true };
  }
}
