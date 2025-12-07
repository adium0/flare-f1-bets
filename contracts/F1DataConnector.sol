// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title F1DataConnector
 * @notice Simulates FDC (Flare Data Connector) for fetching F1 race results
 * @dev MVP version - In production, this would use FDC attestation with Merkle proofs
 * 
 * This contract is designed to work with Flare's Data Connector (FDC) which allows
 * smart contracts to securely access external data. For MVP, we use a simple
 * oracle pattern that can be upgraded to full FDC integration.
 * 
 * Production FDC Flow:
 * 1. Worker fetches data from Jolpica API (or official F1 API)
 * 2. Data is submitted to FDC attestation providers
 * 3. Merkle proof is generated
 * 4. Contract verifies proof and extracts data
 */
contract F1DataConnector is Ownable {
    
    // ============ Structs ============
    
    struct RaceResult {
        bytes32 raceId;
        bytes32 winningDriverId;
        uint256 timestamp;
        bool isValid;
    }
    
    // ============ State Variables ============
    
    address public oracle;
    string public apiEndpoint; // Placeholder for Jolpica API endpoint
    
    mapping(bytes32 => RaceResult) public raceResults;
    bytes32[] public allRaceResultIds;
    
    // ============ Events ============
    
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event ApiEndpointUpdated(string newEndpoint);
    event RaceResultSubmitted(bytes32 indexed raceId, bytes32 winningDriverId, uint256 timestamp);
    
    // ============ Modifiers ============
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _oracle, string memory _apiEndpoint) Ownable(msg.sender) {
        oracle = _oracle;
        apiEndpoint = _apiEndpoint;
    }
    
    // ============ Admin Functions ============
    
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
     * @notice Update API endpoint (placeholder for Jolpica API)
     * @param newEndpoint New API endpoint URL
     */
    function setApiEndpoint(string memory newEndpoint) external onlyOwner {
        apiEndpoint = newEndpoint;
        emit ApiEndpointUpdated(newEndpoint);
    }
    
    // ============ Oracle Functions ============
    
    /**
     * @notice Submit race result (simulates FDC data submission)
     * @param raceId Race identifier
     * @param winningDriverId Winning driver identifier
     * 
     * @dev In production, this would:
     * 1. Verify FDC attestation proof
     * 2. Extract data from Merkle proof
     * 3. Validate data structure matches Jolpica API format
     * 
     * Jolpica API Response Format (expected):
     * {
     *   "raceId": "bahrain-2025",
     *   "winner": {
     *     "driverId": "VER",
     *     "name": "Max Verstappen",
     *     ...
     *   },
     *   "timestamp": 1234567890
     * }
     */
    function submitRaceResult(
        bytes32 raceId,
        bytes32 winningDriverId
    ) external onlyOracle {
        require(raceId != bytes32(0), "Invalid race ID");
        require(winningDriverId != bytes32(0), "Invalid driver ID");
        
        // Check if result already exists
        require(!raceResults[raceId].isValid, "Result already submitted");
        
        raceResults[raceId] = RaceResult({
            raceId: raceId,
            winningDriverId: winningDriverId,
            timestamp: block.timestamp,
            isValid: true
        });
        
        allRaceResultIds.push(raceId);
        
        emit RaceResultSubmitted(raceId, winningDriverId, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get race result
     * @param raceId Race identifier
     * @return winningDriverId Winning driver ID
     * @return timestamp When result was submitted
     * @return isValid Whether result exists
     */
    function getRaceResult(bytes32 raceId) 
        external 
        view 
        returns (
            bytes32 winningDriverId,
            uint256 timestamp,
            bool isValid
        ) 
    {
        RaceResult memory result = raceResults[raceId];
        return (result.winningDriverId, result.timestamp, result.isValid);
    }
    
    /**
     * @notice Get all race result IDs
     * @return Array of race IDs with results
     */
    function getAllRaceResultIds() external view returns (bytes32[] memory) {
        return allRaceResultIds;
    }
    
    /**
     * @notice Get API endpoint (for reference)
     * @return Current API endpoint URL
     */
    function getApiEndpoint() external view returns (string memory) {
        return apiEndpoint;
    }
}

