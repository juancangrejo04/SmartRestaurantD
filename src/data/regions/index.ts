import { CountryCode, RegionProfile } from '../../types';
import {
  getAllRegionProfilesMap,
  getStoredRegionProfile,
  updateStoredRegionProfile,
  resetStoredRegionProfiles,
  subscribeRegionProfiles,
  getSimulatedCountryDraft,
  registerSimulatedCountryDraft,
  clearSimulatedCountryDraft,
} from '../../core/regionProfilesStore';

export const REGION_PROFILES: Record<CountryCode, RegionProfile> = getAllRegionProfilesMap();

export const SUPPORTED_COUNTRY_CODES: CountryCode[] = ['CO', 'BR', 'US', 'FR', 'JP'];

export function getRegionProfile(countryCode: CountryCode): RegionProfile {
  return getStoredRegionProfile(countryCode);
}

export function getAllRegionProfiles(): RegionProfile[] {
  return Object.values(getAllRegionProfilesMap());
}

export {
  updateStoredRegionProfile,
  resetStoredRegionProfiles,
  subscribeRegionProfiles,
  getSimulatedCountryDraft,
  registerSimulatedCountryDraft,
  clearSimulatedCountryDraft,
};
