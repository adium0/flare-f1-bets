# Demo Script: Flare F1 Betting dApp

**Total Time: 4 minutes**

---

## 0:00 - 0:15 | Opening Hook

> *[Show landing page with hero section]*

"Imagine placing a bet on your favorite F1 driver, and knowing that no platform, no middleman, can cheat you out of your winnings. That's what we built with **Flare F1 Betting**."

---

## 0:15 - 0:45 | Problem Statement

> *[Brief pause, look at audience]*

"Traditional sports betting has a trust problem:
- You can't see how odds are calculated
- Settlements are manual and slow  
- Platforms can delay or deny payouts

We asked: *What if race results came from a decentralized oracle network, and payouts happened automatically?*"

---

## 0:45 - 1:00 | Solution Introduction

> *[Point to Flare integration callout in UI]*

"Meet Flare F1 Betting – built on **Flare's Coston2 testnet**, using **enshrined oracles** that are part of the protocol itself, not third-party add-ons."

---

## 1:00 - 1:30 | Connect Wallet Demo

> *[Click "Connect Wallet" button]*

"Let me show you how it works. First, I connect my MetaMask wallet..."

> *[MetaMask popup appears, approve connection]*

"Notice we're on **Coston2** – Flare's testnet. The app detects this automatically."

> *[Point to wallet balance in sidebar]*

"I can see my **C2FLR balance** right here, and look – the **FTSO price feed** showing real-time FLR/USD from Flare's decentralized oracles."

---

## 1:30 - 2:15 | Place a Bet

> *[Navigate to Races page]*

"Let's place a bet on the **Bahrain Grand Prix**."

> *[Click on race card]*

"I can see all the drivers with their odds. I'll bet on **Max Verstappen** at **1.85x**."

> *[Select driver, enter 0.5 C2FLR, click Place Bet]*

"Enter my stake... and confirm in MetaMask."

> *[Approve transaction]*

"Done! My bet is now **on-chain**, completely transparent."

> *[Navigate to My Bets page]*

"I can see it here in 'Pending Bets' with the transaction hash linking to the **Coston2 explorer**."

---

## 2:15 - 3:00 | Oracle Settlement & Payout

> *[Navigate to Oracle page]*

"Now, here's where Flare's magic happens. In production, the **Flare Data Connector** would attest race results from official F1 data."

> *[Select race, select winning driver]*

"For the demo, I'm the oracle. Let's say **Verstappen wins**..."

> *[Click Submit Result]*

"Result submitted on-chain!"

> *[Navigate to My Bets page]*

"Look – my bet status changed to **WON**. I can now claim my payout."

> *[Click Claim button]*

"Confirming... and the **1.85 C2FLR** is in my wallet. Trustless. Automatic."

---

## 3:00 - 3:30 | Technical Highlights

> *[Show Coston2 explorer in new tab with transaction]*

"Every action is verifiable on-chain:
- The bet placement
- The oracle result submission  
- The payout claim

No hidden databases. No manual intervention."

> *[Switch back to app, show FTSO price]*

"And we're using **Flare's native FTSO** for price feeds – not Chainlink, not custom oracles – the protocol's own infrastructure."

---

## 3:30 - 4:00 | Closing & Judging Criteria

> *[Full screen, confident close]*

"To summarize how we meet the criteria:

✅ **Completion**: End-to-end betting flow works  
✅ **Originality**: Native Flare oracles, not third-party  
✅ **Learning**: First time using FTSO/Coston2  
✅ **Design**: F1 dashboard aesthetic, fully responsive  
✅ **Innovation**: This pattern works for *any* verifiable event – sports, elections, weather

**Flare F1 Betting** – transparent betting, powered by enshrined oracles.

Thank you!"

---

## Q&A Preparation

**Q: Why not use Chainlink?**
> "Flare's FTSO and FDC are enshrined at the protocol level – they don't require paying external networks and benefit from Flare's entire validator set."

**Q: How would FDC work in production?**
> "A worker service polls official F1 API, submits to FDC attestation providers, they generate a Merkle proof, and our contract verifies before settling."

**Q: Can this scale to other sports?**
> "Absolutely. The architecture is generic – any event with a verifiable outcome can use FDC. Soccer, tennis, esports, even prediction markets."

**Q: What about gas costs?**
> "Coston2 has very low fees. In production, we'd batch settlements and could use meta-transactions to cover user gas."

---

## Demo Backup Plan

If live demo fails:
1. Show pre-recorded video (have ready)
2. Walk through code explaining flow
3. Show Coston2 explorer with previous transactions
4. Focus on architecture and Flare integration points
