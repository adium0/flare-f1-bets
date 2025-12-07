import { COSTON2_CONFIG } from '@/data/mockData';

// Contract ABI - matches FlareF1BetManager.sol with parimutuel odds
export const BET_MANAGER_ABI = [
  // Events
  "event RaceCreated(bytes32 indexed raceId, string name, uint256 cutoffTime)",
  "event DriverAdded(bytes32 indexed raceId, bytes32 driverId, string name)",
  "event BetPlaced(bytes32 indexed betId, bytes32 indexed raceId, bytes32 driverId, address indexed user, uint256 amount)",
  "event RaceClosed(bytes32 indexed raceId)",
  "event RaceResultSet(bytes32 indexed raceId, bytes32 winningDriverId)",
  "event PayoutClaimed(bytes32 indexed betId, address indexed user, uint256 amount)",
  "event OracleUpdated(address indexed oldOracle, address indexed newOracle)",
  
  // Read functions
  "function races(bytes32 raceId) view returns (string name, string circuit, uint256 cutoffTime, uint8 status, bytes32 winningDriverId, uint256 totalPool)",
  "function bets(bytes32 betId) view returns (address user, bytes32 raceId, bytes32 driverId, uint256 amount, uint8 status, uint256 payout)",
  "function getRaceDrivers(bytes32 raceId) view returns (tuple(bytes32 driverId, string name, uint256 totalStake)[])",
  "function getUserBets(address user) view returns (bytes32[])",
  "function getAllRaces() view returns (bytes32[])",
  "function getImpliedOdds(bytes32 raceId, bytes32 driverId) view returns (uint256)",
  "function calculatePayout(bytes32 betId) view returns (uint256)",
  "function oracle() view returns (address)",
  "function minBetAmount() view returns (uint256)",
  "function maxBetAmount() view returns (uint256)",
  "function platformFee() view returns (uint256)",
  "function driverPools(bytes32 raceId, bytes32 driverId) view returns (uint256)",
  
  // Write functions
  "function placeBet(bytes32 raceId, bytes32 driverId) payable",
  "function claimPayout(bytes32 betId)",
  "function closeRace(bytes32 raceId)",
  "function setRaceResult(bytes32 raceId, bytes32 winningDriverId)",
  "function createRace(bytes32 raceId, string name, string circuit, uint256 cutoffTime)",
  "function addDriver(bytes32 raceId, bytes32 driverId, string name)",
  "function setOracle(address newOracle)",
] as const;

// Contract address - update after deployment
export const CONTRACT_ADDRESS = COSTON2_CONFIG.contracts.betManager;

// Explorer URL helper
export const getExplorerTxUrl = (txHash: string) => 
  `${COSTON2_CONFIG.explorerUrl}/tx/${txHash}`;

export const getExplorerAddressUrl = (address: string) => 
  `${COSTON2_CONFIG.explorerUrl}/address/${address}`;

// Helper to convert string to bytes32
export const stringToBytes32 = (str: string): string => {
  const hex = Buffer.from(str).toString('hex');
  return '0x' + hex.padEnd(64, '0');
};

// Helper to convert bytes32 to string
export const bytes32ToString = (bytes32: string): string => {
  const hex = bytes32.slice(2);
  const str = Buffer.from(hex, 'hex').toString('utf8');
  return str.replace(/\0/g, '');
};
