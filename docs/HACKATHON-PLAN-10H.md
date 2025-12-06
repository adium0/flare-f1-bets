# 10-Hour Hackathon Plan

A detailed hour-by-hour breakdown for a 2-4 person team building the Flare F1 Betting dApp.

## Team Roles

| Role | Responsibilities |
|------|------------------|
| **Dev 1 (Contracts)** | Solidity, deployment, Hardhat config |
| **Dev 2 (Frontend Lead)** | React pages, state management, wallet |
| **Dev 3 (Frontend UI)** | Components, styling, animations |
| **Dev 4 (Docs/Demo)** | Documentation, demo prep, testing |

---

## Hour 0: Project Setup (0:00 - 1:00)

### All Team Members
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Verify `npm run dev` works
- [ ] Install MetaMask, add Coston2 network
- [ ] Get C2FLR from faucet

### Dev 1 (Contracts)
- [ ] Set up Hardhat project structure
- [ ] Configure Coston2 network in hardhat.config.ts
- [ ] Create deployment script skeleton

### Dev 2 (Frontend Lead)
- [ ] Review WalletContext implementation
- [ ] Test wallet connection flow
- [ ] Identify any missing dependencies

### Dev 3 (Frontend UI)
- [ ] Review design system in index.css
- [ ] Test tailwind.config.ts colors render correctly
- [ ] Identify component gaps

### Dev 4 (Docs/Demo)
- [ ] Set up documentation folder structure
- [ ] Create demo environment checklist
- [ ] Begin README outline

**Success Criteria**: All team members can run the app locally and connect wallet.

---

## Hours 1-2.5: Smart Contracts (1:00 - 3:30)

### Dev 1 (Contracts) - Primary Focus

#### Hour 1
- [ ] Complete FlareF1BetManager.sol structure
- [ ] Implement createRace and addDriver functions
- [ ] Add race/driver storage mappings

#### Hour 1.5
- [ ] Implement placeBet function with validation
- [ ] Add closeRace and setRaceResult (oracle functions)
- [ ] Implement basic access control

#### Hour 2
- [ ] Implement claimPayout with winner logic
- [ ] Add calculatePayout view function
- [ ] Write emergency withdrawal

#### Hour 2.5
- [ ] Compile and fix any errors
- [ ] Write basic deployment script
- [ ] Deploy to Coston2 (first attempt)

**Success Criteria**: Contract deploys to Coston2 without errors.

---

## Hours 1-3: Frontend Development (1:00 - 4:00)

### Dev 2 (Frontend Lead)

#### Hour 1
- [ ] Connect WalletContext to real MetaMask
- [ ] Implement network switching to Coston2
- [ ] Add balance fetching

#### Hour 2
- [ ] Integrate BettingContext with localStorage persistence
- [ ] Build placeBet function (mock for now)
- [ ] Build claimPayout function (mock for now)

#### Hour 3
- [ ] Connect Dashboard page with real data flow
- [ ] Test full betting flow end-to-end
- [ ] Add error handling and loading states

### Dev 3 (Frontend UI)

#### Hour 1
- [ ] Polish Sidebar component with active states
- [ ] Ensure Header FTSO price updates
- [ ] Test responsive breakpoints

#### Hour 2
- [ ] Complete RaceCard hover animations
- [ ] Polish BetForm modal transitions
- [ ] Style BetCard status badges

#### Hour 3
- [ ] Complete OraclePanel styling
- [ ] Add success/error toast variations
- [ ] Mobile navigation testing

**Success Criteria**: Full UI flow works with mock data, looks polished.

---

## Hours 1-3: Backend Worker (1:00 - 4:00)

### Dev 4 (Docs/Demo) - Light Backend Focus

#### Hour 2
- [ ] Create backend/oracleWorker.ts stub
- [ ] Add mock F1 API polling function
- [ ] Document FDC integration points

#### Hour 3
- [ ] Add CLI commands for setting results
- [ ] Test worker script execution
- [ ] Document worker usage

**Success Criteria**: Worker can "set" race results via CLI command.

---

## Hour 4: Integration Testing (4:00 - 5:00)

### All Team Members

- [ ] **Wallet → Contract**: Place real bet on Coston2
- [ ] **Oracle → Contract**: Submit result via contract call
- [ ] **Contract → Wallet**: Claim payout successfully
- [ ] **Explorer Check**: Verify transactions visible

### Bug Triage
- Critical: Blocks demo → Fix immediately
- Major: Visible issue → Fix if time permits
- Minor: Edge case → Document, skip

**Success Criteria**: End-to-end flow works on Coston2 at least once.

---

## Hour 5: UI Polish & Mobile Testing (5:00 - 6:00)

### Dev 2 + Dev 3

- [ ] Fix any layout issues found in testing
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Ensure all toasts/notifications work
- [ ] Add loading spinners where missing
- [ ] Final animation polish

### Dev 1 (Contracts)
- [ ] Verify contract on Coston2 explorer (if supported)
- [ ] Document contract addresses
- [ ] Test edge cases (double claim, invalid bet)

**Success Criteria**: App looks great on desktop and mobile, no broken layouts.

---

## Hour 6: Documentation (6:00 - 7:00)

### Dev 4 (Primary) + All Team Support

- [ ] Complete README.md with all sections
- [ ] Finalize PRODUCT-NARRATIVE.md
- [ ] Complete FDC-VISION.md
- [ ] Create DEMO-SCRIPT.md
- [ ] Create JUDGING-MAP.md
- [ ] Add screenshots to docs

### All Team
- [ ] Review docs for accuracy
- [ ] Add inline code comments
- [ ] Ensure Flare terminology is correct

**Success Criteria**: All documentation complete and accurate.

---

## Hours 7-9: Demo Prep & Final Polish (7:00 - 10:00)

### Hour 7: Demo Rehearsal #1

- [ ] Run through DEMO-SCRIPT.md once
- [ ] Time the presentation (target: 4 min)
- [ ] Note any issues or gaps
- [ ] Assign speaking parts

### Hour 8: Bug Fixes & Polish

- [ ] Fix any issues found in rehearsal
- [ ] Clear browser cache, fresh test
- [ ] Prepare backup demo (video recording)
- [ ] Set up presentation laptop

### Hour 9: Final Rehearsal

- [ ] Full demo run-through
- [ ] Practice Q&A responses
- [ ] Final commit and push
- [ ] Celebrate 🎉

---

## Emergency Protocols

### Contract Won't Deploy
1. Check Coston2 RPC is responsive
2. Verify wallet has C2FLR
3. Simplify contract if needed
4. Use mock mode in frontend

### Frontend Build Fails
1. Check console for specific error
2. Run `npm run build` locally
3. Revert recent changes if needed
4. Have backup branch ready

### Demo Crashes
1. Have screen recording backup
2. Know which parts work for sure
3. Be honest with judges
4. Show code/docs as fallback

---

## Final Checklist

```
[ ] App runs on npm run dev
[ ] Contract deployed to Coston2
[ ] Wallet connects successfully
[ ] Can place a bet
[ ] Can view my bets
[ ] Oracle can set result
[ ] Can claim payout
[ ] FTSO price shows
[ ] Mobile looks good
[ ] All docs complete
[ ] Demo script practiced
[ ] GitHub repo clean
[ ] Team knows their parts
```

---

*Good luck, team! Remember: done is better than perfect.* 🏎️
