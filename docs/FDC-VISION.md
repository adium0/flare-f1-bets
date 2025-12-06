# FDC Vision: Production Oracle Architecture

This document describes how the Flare Data Connector (FDC) would be integrated in a production version of the Flare F1 Betting dApp.

## Current MVP: Single Oracle Wallet

In the hackathon MVP, we use a simplified oracle pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Admin/Demo    │────▶│  Smart Contract  │────▶│   User Claims   │
│  Sets Result    │     │  setRaceResult() │     │    Payout       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Limitations:**
- Single point of failure/trust
- Manual intervention required
- No cryptographic proof of data source

---

## Production: FDC Integration

### Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Official F1    │────▶│  Backend Worker  │────▶│  FDC Request    │
│      API        │     │  (Polls Results) │     │   Submission    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Claims   │◀────│  Smart Contract  │◀────│  Attestation    │
│    Payout       │     │  Verifies Proof  │     │   Providers     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Step-by-Step Flow

#### 1. Data Collection
```typescript
// backend/worker.ts
async function pollF1Results() {
  const response = await fetch('https://ergast.com/api/f1/current/last/results.json');
  const data = await response.json();
  
  const raceResult = {
    raceId: data.MRData.RaceTable.Races[0].round,
    raceName: data.MRData.RaceTable.Races[0].raceName,
    winner: data.MRData.RaceTable.Races[0].Results[0].Driver.driverId,
    timestamp: Date.now()
  };
  
  return raceResult;
}
```

#### 2. FDC Attestation Request
```typescript
// Submit to FDC for attestation
async function requestAttestation(raceResult: RaceResult) {
  const attestationRequest = {
    attestationType: "0x57656241706900", // "WebApi" in hex
    sourceId: "0x574542", // "WEB" source
    requestBody: {
      url: `https://ergast.com/api/f1/${raceResult.raceId}/results.json`,
      responseType: "json",
      jsonPath: "$.MRData.RaceTable.Races[0].Results[0].Driver.driverId"
    }
  };
  
  // Submit to FDC contract on Flare
  const tx = await fdcContract.requestAttestation(attestationRequest);
  return tx.hash;
}
```

#### 3. Attestation Providers Process
- Multiple independent attestation providers fetch the URL
- Each provider verifies the JSON response
- Providers submit their attestations
- Consensus is reached via Merkle tree construction

#### 4. Merkle Proof Generation
```
              Root Hash
             /         \
        Hash(A,B)     Hash(C,D)
        /     \       /     \
    Race1   Race2  Race3   Race4
```

#### 5. Smart Contract Verification
```solidity
// FlareF1BetManager.sol - Production version

import "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";

contract FlareF1BetManagerV2 is FlareF1BetManager {
    IFdcVerification public fdcVerification;
    
    /**
     * @notice Set race result with FDC proof verification
     * @param raceId Race identifier
     * @param proof Merkle proof from FDC
     */
    function setRaceResultWithProof(
        bytes32 raceId,
        IFdcVerification.Proof calldata proof
    ) external {
        // Verify the Merkle proof is valid
        require(fdcVerification.verifyJsonApi(proof), "Invalid FDC proof");
        
        // Extract winner from attested data
        bytes32 winningDriverId = abi.decode(
            proof.response.responseBody.data,
            (bytes32)
        );
        
        // Set result (anyone can call if proof is valid)
        Race storage race = races[raceId];
        race.status = RaceStatus.Settled;
        race.winningDriverId = winningDriverId;
        
        emit RaceResultSet(raceId, winningDriverId);
    }
}
```

---

## Key Benefits of FDC

### 1. Trustless Data
- No single entity controls the data
- Multiple independent providers must agree
- Cryptographic proof of data source and time

### 2. Permissionless Settlement
- Anyone with a valid proof can settle a race
- No admin keys required
- Fully decentralized operation

### 3. Tamper-Proof
- Merkle root stored on-chain
- Historical proofs verifiable forever
- Audit trail for every settlement

### 4. Cost Efficient
- Native to Flare protocol
- No external oracle fees
- Batch multiple events efficiently

---

## FDC Attestation Types

| Type | Use Case | Example |
|------|----------|---------|
| `Payment` | Verify on-chain transactions | Deposit confirmations |
| `BalanceDecreasingTransaction` | Track outflows | Withdrawal proofs |
| `ReferencedPaymentNonexistence` | Prove something didn't happen | No deposit within window |
| `ConfirmedBlockHeightExists` | Chain liveness | Cross-chain bridges |
| **`JsonApi` (Web2)** | **API data attestation** | **F1 race results** |

For F1 betting, we use `JsonApi` to attest HTTP responses from official data sources.

---

## Implementation Roadmap

### Phase 1: FDC Testnet Integration
- [ ] Deploy to Coston2 with FDC contracts
- [ ] Implement proof verification in contract
- [ ] Test with mock attestation data

### Phase 2: Worker Service
- [ ] Build polling service for Ergast API
- [ ] Implement attestation request submission
- [ ] Add retry logic and error handling

### Phase 3: Production Deployment
- [ ] Audit smart contracts
- [ ] Deploy to Flare mainnet
- [ ] Register with attestation provider set

### Phase 4: Decentralization
- [ ] Open attestation to community providers
- [ ] Implement slashing for incorrect attestations
- [ ] DAO governance for parameter updates

---

## Code Examples

### Verifying a Proof in Solidity

```solidity
function verifyAndSettle(
    bytes32 raceId,
    bytes32[] calldata merkleProof,
    bytes calldata attestedData
) external {
    // Compute leaf hash
    bytes32 leaf = keccak256(attestedData);
    
    // Verify against stored Merkle root
    bytes32 root = fdcMerkleRoots[currentRound];
    require(
        MerkleProof.verify(merkleProof, root, leaf),
        "Invalid proof"
    );
    
    // Decode and apply result
    (bytes32 winner) = abi.decode(attestedData, (bytes32));
    _settleRace(raceId, winner);
}
```

### Fetching Proof from FDC (Frontend)

```typescript
async function getSettlementProof(raceId: string) {
  const response = await fetch(
    `https://fdc-api.flare.network/proofs/${raceId}`
  );
  
  const { merkleProof, attestedData, roundId } = await response.json();
  
  return {
    proof: merkleProof,
    data: attestedData,
    round: roundId
  };
}
```

---

## Resources

- [Flare FDC Documentation](https://docs.flare.network/tech/fdc/)
- [FDC Verification Contracts](https://github.com/flare-foundation/flare-smart-contracts-v2)
- [Attestation Provider Guide](https://docs.flare.network/infra/attestation-providers/)

---

*The future is trustless. The future is Flare.* ⚡
