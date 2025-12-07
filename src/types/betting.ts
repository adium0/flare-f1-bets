export interface Driver {
  id: string;
  name: string;
  number: number;
  team: Team;
  odds: number;
  imageUrl?: string;
}

export type Team = 'redbull' | 'ferrari' | 'mercedes' | 'mclaren' | 'alpine' | 'aston';

export type RaceStatus = 'upcoming' | 'closed' | 'settled';
export type BetStatus = 'pending' | 'won' | 'lost' | 'claimed';

export interface Race {
  id: string;
  name: string;
  circuit: string;
  country: string;
  date: string;
  cutoffTime: string;
  status: RaceStatus;
  drivers: Driver[];
  winningDriverId?: string;
  flagUrl?: string;
}

export interface Bet {
  id: string;
  raceId: string;
  raceName: string;
  driverId: string;
  driverName: string;
  driverNumber: number;
  team: Team;
  stake: number;
  odds: number;
  status: BetStatus;
  potentialPayout: number;
  placedAt: string;
  txHash?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  isCorrectNetwork: boolean;
}

export interface FtsoPrice {
  symbol: string;
  price: number;
  timestamp: number;
  change24h: number;
}

export interface UserStats {
  totalBets: number;
  totalWon: number;
  totalStaked: number;
  totalWinnings: number;
  pendingBets: number;
  winRate: number;
}

// Contract event types
export interface ContractEvent {
  id: string;
  type: 'BetPlaced' | 'RaceResultSet' | 'PayoutClaimed' | 'RaceCreated' | 'DriverAdded';
  txHash: string;
  blockNumber: number;
  timestamp: number;
  data: Record<string, any>;
}
