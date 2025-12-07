// F1 API Service - Currently uses stubbed data, swap to live API calls when ready
// Base URL: https://api.jolpi.ca/ergast/f1/

import {
  mockDriversApiResponse,
  mockConstructorsApiResponse,
  mockCircuitsApiResponse,
  mockRacesApiResponse,
  mockDriverStandingsApiResponse,
  mockRaceResultsApiResponse,
  driverConstructorMap,
  teamColors,
} from '@/data/f1ApiMocks';

import {
  F1ApiResponse,
  DriverTableResponse,
  ConstructorTableResponse,
  RaceTableResponse,
  RaceResultsTableResponse,
  DriverStandingsTableResponse,
  CircuitTableResponse,
  ApiDriver,
  ApiConstructor,
  ApiRace,
} from '@/data/f1ApiTypes';

// Toggle between mock and live API
const USE_LIVE_API = false; // Set to true when ready to use live API
const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

// ============ API FETCH HELPERS ============
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  if (!USE_LIVE_API) {
    throw new Error('Live API disabled - using mock data');
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

// ============ DRIVER ENDPOINTS ============
export async function getDrivers(season: string = 'current'): Promise<F1ApiResponse<DriverTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi(`/${season}/drivers.json`);
  }
  // Return stubbed data
  return mockDriversApiResponse;
}

export async function getDriver(driverId: string): Promise<F1ApiResponse<DriverTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi(`/drivers/${driverId}.json`);
  }
  // Filter mock data
  const driver = mockDriversApiResponse.MRData.DriverTable.Drivers.find(d => d.driverId === driverId);
  return {
    MRData: {
      ...mockDriversApiResponse.MRData,
      DriverTable: {
        Drivers: driver ? [driver] : []
      }
    }
  };
}

// ============ CONSTRUCTOR ENDPOINTS ============
export async function getConstructors(season: string = 'current'): Promise<F1ApiResponse<ConstructorTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi(`/${season}/constructors.json`);
  }
  return mockConstructorsApiResponse;
}

// ============ CIRCUIT ENDPOINTS ============
export async function getCircuits(): Promise<F1ApiResponse<CircuitTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi('/circuits.json');
  }
  return mockCircuitsApiResponse;
}

// ============ RACE ENDPOINTS ============
export async function getRaces(season: string = 'current'): Promise<F1ApiResponse<RaceTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi(`/${season}.json`);
  }
  return mockRacesApiResponse;
}

export async function getNextRace(): Promise<ApiRace | null> {
  const races = await getRaces('current');
  const now = new Date();
  
  // Find the next race that hasn't happened yet
  for (const race of races.MRData.RaceTable.Races) {
    const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
    if (raceDate > now) {
      return race;
    }
  }
  return null;
}

export async function getUpcomingRaces(count: number = 5): Promise<ApiRace[]> {
  const races = await getRaces('current');
  const now = new Date();
  
  return races.MRData.RaceTable.Races
    .filter(race => {
      const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
      return raceDate > now;
    })
    .slice(0, count);
}

// ============ RACE RESULTS ENDPOINTS ============
export async function getRaceResults(season: string, round: string): Promise<F1ApiResponse<RaceResultsTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi(`/${season}/${round}/results.json`);
  }
  // Return mock race results
  return mockRaceResultsApiResponse;
}

export async function getLastRaceResults(): Promise<F1ApiResponse<RaceResultsTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi('/current/last/results.json');
  }
  return mockRaceResultsApiResponse;
}

// ============ STANDINGS ENDPOINTS ============
export async function getDriverStandings(season: string = 'current'): Promise<F1ApiResponse<DriverStandingsTableResponse>> {
  if (USE_LIVE_API) {
    return fetchFromApi(`/${season}/driverStandings.json`);
  }
  return mockDriverStandingsApiResponse;
}

// ============ HELPER FUNCTIONS ============
export function getDriverConstructor(driverId: string): string {
  return driverConstructorMap[driverId] || 'unknown';
}

export function getTeamColor(constructorId: string): { primary: string; secondary: string } {
  return teamColors[constructorId] || { primary: '#666666', secondary: '#333333' };
}

export function getDriverFullName(driver: ApiDriver): string {
  return `${driver.givenName} ${driver.familyName}`;
}

export function formatRaceDate(race: ApiRace): string {
  const date = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRaceTime(race: ApiRace): string {
  if (!race.time) return 'TBD';
  const date = new Date(`${race.date}T${race.time}`);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function getRaceCountdown(race: ApiRace): { days: number; hours: number; minutes: number } {
  const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
  const now = new Date();
  const diff = raceDate.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}

// Map API race to internal Race type for betting context
export function mapApiRaceToInternal(race: ApiRace, drivers: ApiDriver[]) {
  const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
  const cutoffTime = new Date(raceDate.getTime() - (60 * 60 * 1000)); // 1 hour before race
  const now = new Date();
  
  let status: 'upcoming' | 'closed' | 'settled' = 'upcoming';
  if (now > raceDate) {
    status = 'settled';
  } else if (now > cutoffTime) {
    status = 'closed';
  }
  
  return {
    id: `${race.season}-${race.round}`,
    name: race.raceName,
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    date: race.date,
    cutoffTime: cutoffTime.toISOString(),
    status,
    drivers: drivers.map((driver, index) => ({
      id: driver.driverId,
      name: getDriverFullName(driver),
      number: parseInt(driver.permanentNumber || '0'),
      team: getDriverConstructor(driver.driverId) as any,
      odds: calculateInitialOdds(index), // Placeholder odds based on position
    })),
  };
}

// Simple initial odds calculation (will be replaced by parimutuel)
function calculateInitialOdds(position: number): number {
  // Top drivers have lower odds (favorites)
  const baseOdds = [1.85, 2.10, 2.50, 3.20, 4.00, 5.00, 6.50, 8.00, 10.00, 12.00];
  return baseOdds[Math.min(position, baseOdds.length - 1)] + (Math.random() * 0.5 - 0.25);
}
