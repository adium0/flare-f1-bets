// Jolpica F1 API Types - Matches https://api.jolpi.ca/ergast/f1/
// These types mirror the actual API response structures for easy swapping from mock to live

// ============ Common Response Wrapper ============
export interface F1ApiResponse<T> {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
  } & T;
}

// ============ Driver Types ============
export interface ApiDriver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface DriverTableResponse {
  DriverTable: {
    season?: string;
    circuitId?: string;
    Drivers: ApiDriver[];
  };
}

// ============ Constructor/Team Types ============
export interface ApiConstructor {
  constructorId: string;
  url?: string;
  name: string;
  nationality?: string;
}

export interface ConstructorTableResponse {
  ConstructorTable: {
    season?: string;
    Constructors: ApiConstructor[];
  };
}

// ============ Circuit Types ============
export interface ApiLocation {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface ApiCircuit {
  circuitId: string;
  url?: string;
  circuitName: string;
  Location: ApiLocation;
}

export interface CircuitTableResponse {
  CircuitTable: {
    Circuits: ApiCircuit[];
  };
}

// ============ Race Types ============
export interface ApiSession {
  date: string;
  time?: string;
}

export interface ApiRace {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: ApiCircuit;
  date: string;
  time?: string;
  FirstPractice?: ApiSession;
  SecondPractice?: ApiSession;
  ThirdPractice?: ApiSession;
  Qualifying?: ApiSession;
  Sprint?: ApiSession;
  SprintQualifying?: ApiSession;
}

export interface RaceTableResponse {
  RaceTable: {
    season?: string;
    Races: ApiRace[];
  };
}

// ============ Race Result Types ============
export interface ApiFastestLap {
  rank: string;
  lap: string;
  Time: {
    time: string;
  };
  AverageSpeed?: {
    units: string;
    speed: string;
  };
}

export interface ApiRaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: ApiDriver;
  Constructor?: ApiConstructor;
  grid?: string;
  laps?: string;
  status?: string;
  Time?: {
    millis?: string;
    time: string;
  };
  FastestLap?: ApiFastestLap;
}

export interface ApiRaceWithResults extends ApiRace {
  Results: ApiRaceResult[];
}

export interface RaceResultsTableResponse {
  RaceTable: {
    season?: string;
    round?: string;
    Races: ApiRaceWithResults[];
  };
}

// ============ Driver Standings Types ============
export interface ApiDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: ApiDriver;
  Constructors: ApiConstructor[];
}

export interface ApiStandingsList {
  season: string;
  round: string;
  DriverStandings: ApiDriverStanding[];
}

export interface DriverStandingsTableResponse {
  StandingsTable: {
    season?: string;
    StandingsLists: ApiStandingsList[];
  };
}

// ============ Constructor Standings Types ============
export interface ApiConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: ApiConstructor;
}

export interface ConstructorStandingsTableResponse {
  StandingsTable: {
    season?: string;
    StandingsLists: {
      season: string;
      round: string;
      ConstructorStandings: ApiConstructorStanding[];
    }[];
  };
}

// ============ Lap Time Types ============
export interface ApiTiming {
  driverId: string;
  position: string;
  time: string;
}

export interface ApiLap {
  number: string;
  Timings: ApiTiming[];
}

export interface ApiRaceWithLaps extends ApiRace {
  Laps: ApiLap[];
}

export interface LapsTableResponse {
  RaceTable: {
    season?: string;
    round?: string;
    Races: ApiRaceWithLaps[];
  };
}

// ============ Pit Stop Types ============
export interface ApiPitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}

export interface ApiRaceWithPitStops extends ApiRace {
  PitStops: ApiPitStop[];
}

export interface PitStopsTableResponse {
  RaceTable: {
    season?: string;
    round?: string;
    Races: ApiRaceWithPitStops[];
  };
}

// ============ Status Types ============
export interface ApiStatus {
  statusId: string;
  count: string;
  status: string;
}

export interface StatusTableResponse {
  StatusTable: {
    Status: ApiStatus[];
  };
}
