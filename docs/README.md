# Flare F1 Betting dApp

A decentralized sports betting platform built on Flare Network, leveraging enshrined oracles (FTSO & FDC) for transparent, trustless race settlements.

![Flare F1 Betting](https://img.shields.io/badge/Flare-Coston2-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🏎️ Overview

Flare F1 Betting is a hackathon MVP demonstrating how Flare's native data infrastructure can revolutionize sports betting:

- **FTSO Integration**: Real-time FLR/USD price feeds displayed in UI
- **FDC-Ready Architecture**: Single oracle wallet simulates production FDC flow
- **Transparent Settlements**: All bets and payouts verifiable on-chain
- **Beautiful UX**: F1 analytics dashboard aesthetic with responsive design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Smart Contracts | Solidity 0.8.20 |
| Network | Flare Coston2 Testnet |
| Wallet | MetaMask |
| Styling | Tailwind CSS + Framer Motion |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Coston2 testnet C2FLR tokens ([faucet](https://faucet.flare.network/coston2))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd flare-f1-betting

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create `.env` file:

```env
VITE_COSTON2_RPC=https://coston2-api.flare.network/ext/C/rpc
VITE_BET_MANAGER_ADDRESS=0x... # After deployment
```

## 📦 Project Structure

```
├── contracts/
│   └── FlareF1BetManager.sol    # Main betting contract
├── src/
│   ├── components/
│   │   ├── betting/             # Betting UI components
│   │   ├── cards/               # Stat and race cards
│   │   └── layout/              # Sidebar, header, layout
│   ├── context/
│   │   ├── WalletContext.tsx    # MetaMask integration
│   │   └── BettingContext.tsx   # Betting state management
│   ├── data/
│   │   └── mockData.ts          # Demo races and bets
│   ├── pages/
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── RacesPage.tsx        # Race listings
│   │   ├── MyBetsPage.tsx       # User's bets
│   │   └── OraclePage.tsx       # Oracle settlement
│   └── types/
│       └── betting.ts           # TypeScript interfaces
└── docs/
    ├── PRODUCT-NARRATIVE.md
    ├── HACKATHON-PLAN-10H.md
    ├── DEMO-SCRIPT.md
    ├── FDC-VISION.md
    └── JUDGING-MAP.md
```

## ✅ Hackathon Deliverables Checklist

- [x] **Smart Contracts**: BetManager with oracle settlement
- [x] **Frontend**: React app with wallet connection
- [x] **Wallet Integration**: MetaMask + Coston2 network detection
- [x] **FTSO Display**: Real-time FLR/USD price feed
- [x] **Betting Flow**: Place bet → Oracle result → Claim payout
- [x] **Oracle Panel**: Demo settlement interface
- [x] **Responsive Design**: Mobile-friendly UI
- [x] **Documentation**: Complete project docs

## 🔧 Contract Deployment (Coston2)

```bash
# Install Hardhat (if using Hardhat)
npm install --save-dev hardhat

# Deploy to Coston2
npx hardhat run scripts/deploy.ts --network coston2
```

See `docs/DEPLOYMENT.md` for detailed instructions.

## 🎯 Demo Flow

1. **Connect Wallet** → MetaMask on Coston2
2. **Browse Races** → View upcoming F1 races
3. **Place Bet** → Select driver, enter stake
4. **Oracle Settlement** → (Admin) Submit race result
5. **Claim Payout** → Winners claim their winnings

## 📚 Documentation

- [Product Narrative](docs/PRODUCT-NARRATIVE.md) - Problem, solution, roadmap
- [10-Hour Hackathon Plan](docs/HACKATHON-PLAN-10H.md) - Hour-by-hour breakdown
- [Demo Script](docs/DEMO-SCRIPT.md) - 4-minute presentation guide
- [FDC Vision](docs/FDC-VISION.md) - Production oracle architecture
- [Judging Map](docs/JUDGING-MAP.md) - Features vs. criteria alignment

## 🌟 Flare Integration Highlights

### FTSO (Price Feeds)
- FLR/USD price displayed in dashboard header
- Demonstrates native oracle data integration
- Updates every 5 seconds (simulated for MVP)

### FDC (Data Connector) - Production Vision
- MVP uses single oracle wallet for simplicity
- Production would use FDC attestation with Merkle proofs
- See `docs/FDC-VISION.md` for full architecture

## 🏆 Judging Criteria Alignment

| Criteria | Implementation |
|----------|---------------|
| **Completion** | End-to-end betting flow works |
| **Originality** | Native Flare oracles vs. Chainlink |
| **Learning** | FTSO/Coston2 integration documented |
| **Design** | F1 dashboard aesthetic, responsive |
| **Innovation** | Extensible to any sport/event |

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Flare Network for native oracle infrastructure
- Flared Up Hybrid Hackathon Bangalore organizers
- Formula 1 for the exciting race data inspiration

---

**Built with ⚡ at Flared Up Hybrid Hackathon Bangalore**
