// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FlareF1BetManager
 * @notice Parimutuel F1 race betting with oracle-based settlement
 * @dev MVP contract for Flare F1 Betting dApp - Coston2 testnet
 * 
 * PARIMUTUEL SYSTEM:
 * - Odds are NOT fixed; they're derived from the betting pool
 * - impliedOdds = (totalPool * 100) / driverPool
 * - Payouts come from losing bets, distributed proportionally to winners
 * 
 * Production upgrades:
 * - Replace single oracle with FDC attestation verification
 * - Add Merkle proof validation for race results
 */
contract FlareF1BetManager is Ownable, ReentrancyGuard {
    
    // ============ Enums ============
    
    enum RaceStatus { Upcoming, Closed, Settled }
    enum BetStatus { Pending, Won, Lost, Claimed }
    
    // ============ Structs ============
    
    struct Race {
        string name;
        string circuit;
        uint256 cutoffTime;
        RaceStatus status;
        bytes32 winningDriverId;
        uint256 totalPool;
    }
    
    struct Driver {
        bytes32 driverId;
        string name;
        uint256 totalStake; // Total amount staked on this driver
    }
    
    struct Bet {
        address user;
        bytes32 raceId;
        bytes32 driverId;
        uint256 amount;
        BetStatus status;
        uint256 payout;
    }
    
    // ============ State Variables ============
    
    address public oracle;
    uint256 public minBetAmount = 0.01 ether;
    uint256 public maxBetAmount = 10 ether;
    uint256 public platformFee = 250; // 2.5% in basis points
    
    mapping(bytes32 => Race) public races;
    mapping(bytes32 => Driver[]) public raceDrivers;
    mapping(bytes32 => Bet) public bets;
    mapping(address => bytes32[]) public userBets;
    
    // Parimutuel pool tracking
    mapping(bytes32 => mapping(bytes32 => uint256)) public driverPools; // raceId => driverId => totalStake
    
    bytes32[] public allRaceIds;
    uint256 public betCounter;
    
    // ============ Events ============
    
    event RaceCreated(bytes32 indexed raceId, string name, uint256 cutoffTime);
    event DriverAdded(bytes32 indexed raceId, bytes32 driverId, string name);
    event BetPlaced(bytes32 indexed betId, bytes32 indexed raceId, bytes32 driverId, address indexed user, uint256 amount);
    event RaceClosed(bytes32 indexed raceId);
    event RaceResultSet(bytes32 indexed raceId, bytes32 winningDriverId);
    event PayoutClaimed(bytes32 indexed betId, address indexed user, uint256 amount);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    
    // ============ Modifiers ============
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }
    
    modifier raceExists(bytes32 raceId) {
        require(bytes(races[raceId].name).length > 0, "Race does not exist");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _oracle) Ownable(msg.sender) {
        oracle = _oracle;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Create a new race for betting
     * @param raceId Unique identifier for the race
     * @param name Race name (e.g., "Bahrain Grand Prix")
     * @param circuit Circuit name
     * @param cutoffTime Unix timestamp when betting closes
     */
    function createRace(
        bytes32 raceId,
        string memory name,
        string memory circuit,
        uint256 cutoffTime
    ) external onlyOwner {
        require(bytes(races[raceId].name).length == 0, "Race already exists");
        require(cutoffTime > block.timestamp, "Cutoff must be in future");
        
        races[raceId] = Race({
            name: name,
            circuit: circuit,
            cutoffTime: cutoffTime,
            status: RaceStatus.Upcoming,
            winningDriverId: bytes32(0),
            totalPool: 0
        });
        
        allRaceIds.push(raceId);
        emit RaceCreated(raceId, name, cutoffTime);
    }
    
    /**
     * @notice Add a driver option for a race (no fixed odds - parimutuel system)
     * @param raceId Race identifier
     * @param driverId Driver identifier
     * @param name Driver name
     */
    function addDriver(
        bytes32 raceId,
        bytes32 driverId,
        string memory name
    ) external onlyOwner raceExists(raceId) {
        require(races[raceId].status == RaceStatus.Upcoming, "Race not upcoming");
        
        raceDrivers[raceId].push(Driver({
            driverId: driverId,
            name: name,
            totalStake: 0
        }));
        
        emit DriverAdded(raceId, driverId, name);
    }
    
    /**
     * @notice Update oracle address
     * @param newOracle New oracle address
     */
    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        address oldOracle = oracle;
        oracle = newOracle;
        emit OracleUpdated(oldOracle, newOracle);
    }
    
    /**
     * @notice Update betting limits
     */
    function setBetLimits(uint256 _min, uint256 _max) external onlyOwner {
        require(_min < _max, "Invalid limits");
        minBetAmount = _min;
        maxBetAmount = _max;
    }
    
    // ============ Betting Functions ============
    
    /**
     * @notice Place a bet on a driver to win a race (parimutuel - odds determined by pool)
     * @param raceId Race identifier
     * @param driverId Driver identifier
     */
    function placeBet(bytes32 raceId, bytes32 driverId) 
        external 
        payable 
        nonReentrant 
        raceExists(raceId) 
    {
        Race storage race = races[raceId];
        require(race.status == RaceStatus.Upcoming, "Race not open for betting");
        require(block.timestamp < race.cutoffTime, "Betting closed");
        require(msg.value >= minBetAmount, "Below minimum bet");
        require(msg.value <= maxBetAmount, "Above maximum bet");
        
        // Verify driver exists
        bool driverExists = false;
        Driver[] storage drivers = raceDrivers[raceId];
        for (uint i = 0; i < drivers.length; i++) {
            if (drivers[i].driverId == driverId) {
                driverExists = true;
                drivers[i].totalStake += msg.value;
                break;
            }
        }
        require(driverExists, "Invalid driver");
        
        // Create bet
        bytes32 betId = keccak256(abi.encodePacked(msg.sender, raceId, driverId, betCounter++, block.timestamp));
        
        bets[betId] = Bet({
            user: msg.sender,
            raceId: raceId,
            driverId: driverId,
            amount: msg.value,
            status: BetStatus.Pending,
            payout: 0
        });
        
        userBets[msg.sender].push(betId);
        
        // Update pools
        race.totalPool += msg.value;
        driverPools[raceId][driverId] += msg.value;
        
        emit BetPlaced(betId, raceId, driverId, msg.sender, msg.value);
    }
    
    // ============ Odds Functions (Parimutuel) ============
    
    /**
     * @notice Get implied odds for a driver (parimutuel calculation)
     * @param raceId Race identifier
     * @param driverId Driver identifier
     * @return Odds in x100 format (e.g., 185 = 1.85x)
     * 
     * Formula: impliedOdds = (totalPool * 100) / driverPool
     * If no bets on driver, returns 0 (undefined odds)
     */
    function getImpliedOdds(bytes32 raceId, bytes32 driverId) 
        external 
        view 
        raceExists(raceId) 
        returns (uint256) 
    {
        uint256 driverPool = driverPools[raceId][driverId];
        uint256 totalPool = races[raceId].totalPool;
        
        if (driverPool == 0 || totalPool == 0) {
            return 0; // No bets yet
        }
        
        // Calculate odds: (totalPool / driverPool) * 100
        // Using * 100 for precision (185 = 1.85x)
        return (totalPool * 100) / driverPool;
    }
    
    /**
     * @notice Get the current pool size for a driver
     * @param raceId Race identifier
     * @param driverId Driver identifier
     * @return Amount staked on this driver
     */
    function getDriverPool(bytes32 raceId, bytes32 driverId) 
        external 
        view 
        returns (uint256) 
    {
        return driverPools[raceId][driverId];
    }
    
    // ============ Oracle Functions ============
    
    /**
     * @notice Close betting for a race (called before race starts)
     * @param raceId Race identifier
     */
    function closeRace(bytes32 raceId) external onlyOracle raceExists(raceId) {
        Race storage race = races[raceId];
        require(race.status == RaceStatus.Upcoming, "Race not upcoming");
        
        race.status = RaceStatus.Closed;
        emit RaceClosed(raceId);
    }
    
    /**
     * @notice Set race result and determine winners
     * @param raceId Race identifier
     * @param winningDriverId The winning driver's identifier
     * 
     * @dev In production, this would verify FDC attestation proof
     * TODO: Implement Merkle proof verification for FDC integration
     */
    function setRaceResult(bytes32 raceId, bytes32 winningDriverId) 
        external 
        onlyOracle 
        raceExists(raceId) 
    {
        Race storage race = races[raceId];
        require(race.status == RaceStatus.Upcoming || race.status == RaceStatus.Closed, "Race already settled");
        
        race.status = RaceStatus.Settled;
        race.winningDriverId = winningDriverId;
        
        emit RaceResultSet(raceId, winningDriverId);
    }
    
    // ============ Payout Functions ============
    
    /**
     * @notice Claim payout for a winning bet (parimutuel payout)
     * @param betId Bet identifier
     * 
     * Parimutuel payout formula:
     * payout = (betAmount / winningPool) * totalPool * (1 - platformFee)
     */
    function claimPayout(bytes32 betId) external nonReentrant {
        Bet storage bet = bets[betId];
        require(bet.user == msg.sender, "Not your bet");
        require(bet.status == BetStatus.Pending, "Bet already processed");
        
        Race storage race = races[bet.raceId];
        require(race.status == RaceStatus.Settled, "Race not settled");
        
        if (bet.driverId == race.winningDriverId) {
            // Winner - calculate parimutuel payout
            uint256 winningPool = driverPools[bet.raceId][bet.driverId];
            uint256 totalPool = race.totalPool;
            
            // Payout = (userStake / winningPool) * totalPool
            uint256 grossPayout = (bet.amount * totalPool) / winningPool;
            uint256 fee = (grossPayout * platformFee) / 10000;
            uint256 netPayout = grossPayout - fee;
            
            bet.status = BetStatus.Won;
            bet.payout = netPayout;
            
            (bool success, ) = payable(msg.sender).call{value: netPayout}("");
            require(success, "Transfer failed");
            
            emit PayoutClaimed(betId, msg.sender, netPayout);
        } else {
            // Loser
            bet.status = BetStatus.Lost;
            bet.payout = 0;
        }
    }
    
    /**
     * @notice Calculate potential payout for a bet (before race result)
     * @param betId Bet identifier
     * @return Estimated payout based on current pool state
     */
    function calculatePayout(bytes32 betId) external view returns (uint256) {
        Bet storage bet = bets[betId];
        Race storage race = races[bet.raceId];
        
        uint256 driverPool = driverPools[bet.raceId][bet.driverId];
        uint256 totalPool = race.totalPool;
        
        if (driverPool == 0) return 0;
        
        uint256 grossPayout = (bet.amount * totalPool) / driverPool;
        uint256 fee = (grossPayout * platformFee) / 10000;
        return grossPayout - fee;
    }
    
    // ============ View Functions ============
    
    function getRaceDrivers(bytes32 raceId) external view returns (Driver[] memory) {
        return raceDrivers[raceId];
    }
    
    function getUserBets(address user) external view returns (bytes32[] memory) {
        return userBets[user];
    }
    
    function getAllRaces() external view returns (bytes32[] memory) {
        return allRaceIds;
    }
    
    function getRaceInfo(bytes32 raceId) external view returns (
        string memory name,
        string memory circuit,
        uint256 cutoffTime,
        RaceStatus status,
        bytes32 winningDriverId,
        uint256 totalPool
    ) {
        Race storage race = races[raceId];
        return (
            race.name,
            race.circuit,
            race.cutoffTime,
            race.status,
            race.winningDriverId,
            race.totalPool
        );
    }
    
    function getBetInfo(bytes32 betId) external view returns (
        address user,
        bytes32 raceId,
        bytes32 driverId,
        uint256 amount,
        BetStatus status,
        uint256 payout
    ) {
        Bet storage bet = bets[betId];
        return (
            bet.user,
            bet.raceId,
            bet.driverId,
            bet.amount,
            bet.status,
            bet.payout
        );
    }
    
    // ============ Emergency Functions ============
    
    function withdrawEmergency() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
    
    receive() external payable {}
}
