import { Race, Bet, Driver, FtsoPrice, UserStats } from '@/types/betting';

export const mockDrivers: Driver[] = [
  { id: 'VER', name: 'Max Verstappen', number: 1, team: 'redbull', odds: 1.85 },
  { id: 'PER', name: 'Sergio Perez', number: 11, team: 'redbull', odds: 4.50 },
  { id: 'LEC', name: 'Charles Leclerc', number: 16, team: 'ferrari', odds: 3.20 },
  { id: 'SAI', name: 'Carlos Sainz', number: 55, team: 'ferrari', odds: 5.00 },
  { id: 'HAM', name: 'Lewis Hamilton', number: 44, team: 'mercedes', odds: 4.00 },
  { id: 'RUS', name: 'George Russell', number: 63, team: 'mercedes', odds: 6.00 },
  { id: 'NOR', name: 'Lando Norris', number: 4, team: 'mclaren', odds: 2.80 },
  { id: 'PIA', name: 'Oscar Piastri', number: 81, team: 'mclaren', odds: 4.20 },
];

export const mockRaces: Race[] = [
  {
    id: 'race-1',
    name: 'Bahrain Grand Prix',
    circuit: 'Bahrain International Circuit',
    country: 'Bahrain',
    date: '2025-03-02',
    cutoffTime: '2025-03-02T14:00:00Z',
    status: 'upcoming',
    drivers: mockDrivers.map(d => ({ ...d, odds: d.odds + Math.random() * 0.5 - 0.25 })),
  },
  {
    id: 'race-2',
    name: 'Saudi Arabian Grand Prix',
    circuit: 'Jeddah Corniche Circuit',
    country: 'Saudi Arabia',
    date: '2025-03-09',
    cutoffTime: '2025-03-09T16:00:00Z',
    status: 'upcoming',
    drivers: mockDrivers.map(d => ({ ...d, odds: d.odds + Math.random() * 0.5 - 0.25 })),
  },
  {
    id: 'race-3',
    name: 'Australian Grand Prix',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    date: '2025-03-23',
    cutoffTime: '2025-03-23T04:00:00Z',
    status: 'upcoming',
    drivers: mockDrivers.map(d => ({ ...d, odds: d.odds + Math.random() * 0.5 - 0.25 })),
  },
  {
    id: 'race-4',
    name: 'Monaco Grand Prix',
    circuit: 'Circuit de Monaco',
    country: 'Monaco',
    date: '2025-05-25',
    cutoffTime: '2025-05-25T13:00:00Z',
    status: 'closed',
    drivers: mockDrivers,
    winningDriverId: 'LEC',
  },
];

export const mockBets: Bet[] = [
  {
    id: 'bet-1',
    raceId: 'race-4',
    raceName: 'Monaco Grand Prix',
    driverId: 'LEC',
    driverName: 'Charles Leclerc',
    driverNumber: 16,
    team: 'ferrari',
    stake: 0.5,
    odds: 3.20,
    status: 'won',
    potentialPayout: 1.6,
    placedAt: '2025-05-24T10:00:00Z',
    txHash: '0x1234...5678',
  },
  {
    id: 'bet-2',
    raceId: 'race-1',
    raceName: 'Bahrain Grand Prix',
    driverId: 'VER',
    driverName: 'Max Verstappen',
    driverNumber: 1,
    team: 'redbull',
    stake: 1.0,
    odds: 1.85,
    status: 'pending',
    potentialPayout: 1.85,
    placedAt: '2025-02-28T15:30:00Z',
    txHash: '0xabcd...efgh',
  },
  {
    id: 'bet-3',
    raceId: 'race-2',
    raceName: 'Saudi Arabian Grand Prix',
    driverId: 'NOR',
    driverName: 'Lando Norris',
    driverNumber: 4,
    team: 'mclaren',
    stake: 0.25,
    odds: 2.80,
    status: 'pending',
    potentialPayout: 0.7,
    placedAt: '2025-03-01T12:00:00Z',
    txHash: '0x9876...5432',
  },
];

export const mockFtsoPrice: FtsoPrice = {
  symbol: 'FLR/USD',
  price: 0.0234,
  timestamp: Date.now(),
  change24h: 5.67,
};

export const mockUserStats: UserStats = {
  totalBets: 12,
  totalWon: 7,
  totalStaked: 8.5,
  totalWinnings: 14.2,
  pendingBets: 2,
  winRate: 58.3,
};

// Contract addresses for Coston2 testnet (placeholders)
export const COSTON2_CONFIG = {
  chainId: 114,
  chainName: 'Flare Coston2',
  rpcUrl: 'https://coston2-api.flare.network/ext/C/rpc',
  explorerUrl: 'https://coston2-explorer.flare.network',
  nativeCurrency: {
    name: 'Coston2 Flare',
    symbol: 'C2FLR',
    decimals: 18,
  },
  contracts: {
    betManager: '0x0000000000000000000000000000000000000000', // Deploy and replace
    mockToken: '0x0000000000000000000000000000000000000000',  // Deploy and replace
  },
};
