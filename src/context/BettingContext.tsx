import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { Race, Bet, BetStatus, FtsoPrice, UserStats, ContractEvent } from '@/types/betting';
import { mockBets, mockFtsoPrice, mockUserStats, COSTON2_CONFIG } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/context/WalletContext';
import { stringToBytes32, bytes32ToString, getExplorerTxUrl } from '@/config/contract';
import { getDrivers, getRaces, mapApiRaceToInternal, getDriverFullName, getDriverConstructor } from '@/services/f1ApiService';

interface BettingContextType {
  races: Race[];
  bets: Bet[];
  ftsoPrice: FtsoPrice;
  userStats: UserStats;
  contractEvents: ContractEvent[];
  placeBet: (raceId: string, driverId: string, stake: number) => Promise<boolean>;
  claimPayout: (betId: string) => Promise<boolean>;
  setRaceResult: (raceId: string, winningDriverId: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
  getImpliedOdds: (raceId: string, driverId: string) => Promise<number>;
  fetchUserBetsFromContract: (userAddress: string) => Promise<void>;
  isLoading: boolean;
  isContractReady: boolean;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const { contract, signer, provider, isReady: isContractReady } = useContract();
  const { wallet } = useWallet();
  const [races, setRaces] = useState<Race[]>([]);
  const [bets, setBets] = useState<Bet[]>(mockBets);
  const [ftsoPrice, setFtsoPrice] = useState<FtsoPrice>(mockFtsoPrice);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [contractEvents, setContractEvents] = useState<ContractEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load races from F1 API on mount
  useEffect(() => {
    async function loadRaces() {
      try {
        const [driversResponse, racesResponse] = await Promise.all([
          getDrivers('2025'),
          getRaces('2025'),
        ]);
        
        const drivers = driversResponse.MRData.DriverTable.Drivers;
        const apiRaces = racesResponse.MRData.RaceTable.Races;
        
        // Map API races to internal format
        const mappedRaces = apiRaces.slice(0, 8).map(race => mapApiRaceToInternal(race, drivers));
        setRaces(mappedRaces);
      } catch (error) {
        console.error('Failed to load F1 data:', error);
      }
    }
    loadRaces();
  }, []);

  // Place a bet with real MetaMask transaction
  const placeBet = useCallback(async (raceId: string, driverId: string, stake: number): Promise<boolean> => {
    if (!contract || !signer) {
      // Fallback to mock if contract not ready
      console.log('Contract not ready, using mock');
      return placeBetMock(raceId, driverId, stake);
    }

    setIsLoading(true);
    
    try {
      const race = races.find(r => r.id === raceId);
      const driver = race?.drivers.find(d => d.id === driverId);
      
      if (!race || !driver) {
        throw new Error('Race or driver not found');
      }

      const raceIdBytes = stringToBytes32(raceId);
      const driverIdBytes = stringToBytes32(driverId);
      const betAmountWei = ethers.parseEther(stake.toString());

      console.log('Placing bet:', { raceId: raceIdBytes, driverId: driverIdBytes, amount: betAmountWei.toString() });

      // Call contract with value
      const tx = await contract.placeBet(raceIdBytes, driverIdBytes, {
        value: betAmountWei,
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Waiting for confirmation...',
      });

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Extract betId from BetPlaced event
      let contractBetId: string | undefined;
      if (receipt.logs) {
        const iface = contract.interface;
        for (const log of receipt.logs) {
          try {
            const parsedLog = iface.parseLog(log);
            if (parsedLog && parsedLog.name === 'BetPlaced') {
              contractBetId = parsedLog.args[0]; // betId is first arg
              console.log('Extracted betId from event:', contractBetId);
              break;
            }
          } catch (e) {
            // Not a BetPlaced event, continue
          }
        }
      }

      // Create local bet record
      const newBet: Bet = {
        id: `bet-${Date.now()}`,
        contractBetId: contractBetId,
        raceId,
        raceName: race.name,
        driverId,
        driverName: driver.name,
        driverNumber: driver.number,
        team: driver.team,
        stake,
        odds: driver.odds,
        status: 'pending',
        potentialPayout: stake * driver.odds,
        placedAt: new Date().toISOString(),
        txHash: receipt.hash,
      };

      setBets(prev => [newBet, ...prev]);
      setUserStats(prev => ({
        ...prev,
        totalBets: prev.totalBets + 1,
        totalStaked: prev.totalStaked + stake,
        pendingBets: prev.pendingBets + 1,
      }));

      toast({
        title: 'Bet Placed Successfully!',
        description: (
          <span>
            {stake} C2FLR on {driver.name} @ {driver.odds.toFixed(2)}x.{' '}
            <a 
              href={getExplorerTxUrl(receipt.hash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              View on Explorer
            </a>
          </span>
        ),
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Bet failed:', error);
      toast({
        title: 'Bet Failed',
        description: error.reason || error.message || 'Transaction failed',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [contract, signer, races]);

  // Mock fallback for when contract isn't deployed
  const placeBetMock = async (raceId: string, driverId: string, stake: number): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const race = races.find(r => r.id === raceId);
    const driver = race?.drivers.find(d => d.id === driverId);
    
    if (!race || !driver) {
      toast({ title: 'Error', description: 'Race or driver not found', variant: 'destructive' });
      setIsLoading(false);
      return false;
    }

    const newBet: Bet = {
      id: `bet-${Date.now()}`,
      raceId,
      raceName: race.name,
      driverId,
      driverName: driver.name,
      driverNumber: driver.number,
      team: driver.team,
      stake,
      odds: driver.odds,
      status: 'pending',
      potentialPayout: stake * driver.odds,
      placedAt: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    };

    setBets(prev => [newBet, ...prev]);
    setUserStats(prev => ({
      ...prev,
      totalBets: prev.totalBets + 1,
      totalStaked: prev.totalStaked + stake,
      pendingBets: prev.pendingBets + 1,
    }));

    toast({
      title: 'Bet Placed (Demo Mode)',
      description: `${stake} C2FLR on ${driver.name} @ ${driver.odds.toFixed(2)}x`,
    });

    setIsLoading(false);
    return true;
  };

  // Claim payout with real transaction
  const claimPayout = useCallback(async (betId: string): Promise<boolean> => {
    if (!contract || !signer) {
      return claimPayoutMock(betId);
    }

    setIsLoading(true);
    
    try {
      const bet = bets.find(b => b.id === betId);
      if (!bet || bet.status !== 'won') {
        throw new Error('Invalid bet for claiming');
      }

      // Use contract betId if available, otherwise fallback to string conversion
      if (!bet.contractBetId) {
        throw new Error('Contract betId not found. Please refresh your bets.');
      }

      const betIdBytes = bet.contractBetId;
      
      console.log('Claiming payout for bet:', betIdBytes);

      const tx = await contract.claimPayout(betIdBytes);

      toast({
        title: 'Transaction Submitted',
        description: 'Claiming your winnings...',
      });

      const receipt = await tx.wait();

      setBets(prev => prev.map(b => 
        b.id === betId ? { ...b, status: 'claimed' as BetStatus, txHash: receipt.hash } : b
      ));

      setUserStats(prev => ({
        ...prev,
        totalWinnings: prev.totalWinnings + bet.potentialPayout,
      }));

      toast({
        title: 'Payout Claimed!',
        description: (
          <span>
            {bet.potentialPayout.toFixed(4)} C2FLR transferred.{' '}
            <a 
              href={getExplorerTxUrl(receipt.hash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              View on Explorer
            </a>
          </span>
        ),
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Claim failed:', error);
      toast({
        title: 'Claim Failed',
        description: error.reason || error.message || 'Transaction failed',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [contract, signer, bets]);

  const claimPayoutMock = async (betId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const bet = bets.find(b => b.id === betId);
    if (!bet || bet.status !== 'won') {
      toast({ title: 'Error', description: 'Invalid bet', variant: 'destructive' });
      setIsLoading(false);
      return false;
    }

    setBets(prev => prev.map(b => 
      b.id === betId ? { ...b, status: 'claimed' as BetStatus } : b
    ));

    setUserStats(prev => ({
      ...prev,
      totalWinnings: prev.totalWinnings + bet.potentialPayout,
    }));

    toast({
      title: 'Payout Claimed (Demo Mode)',
      description: `${bet.potentialPayout.toFixed(4)} C2FLR transferred.`,
    });

    setIsLoading(false);
    return true;
  };

  // Set race result (Oracle function)
  const setRaceResult = useCallback(async (raceId: string, winningDriverId: string): Promise<boolean> => {
    if (!contract || !signer) {
      return setRaceResultMock(raceId, winningDriverId);
    }

    setIsLoading(true);
    
    try {
      const raceIdBytes = stringToBytes32(raceId);
      const driverIdBytes = stringToBytes32(winningDriverId);

      console.log('Setting race result:', { raceId: raceIdBytes, winningDriverId: driverIdBytes });

      const tx = await contract.setRaceResult(raceIdBytes, driverIdBytes);

      toast({
        title: 'Transaction Submitted',
        description: 'Setting race result...',
      });

      const receipt = await tx.wait();

      // Update local state
      setRaces(prev => prev.map(r => 
        r.id === raceId 
          ? { ...r, status: 'settled' as const, winningDriverId }
          : r
      ));

      setBets(prev => prev.map(bet => {
        if (bet.raceId !== raceId || bet.status !== 'pending') return bet;
        return {
          ...bet,
          status: bet.driverId === winningDriverId ? 'won' as BetStatus : 'lost' as BetStatus,
        };
      }));

      const race = races.find(r => r.id === raceId);
      const winner = race?.drivers.find(d => d.id === winningDriverId);

      toast({
        title: 'Race Result Set!',
        description: (
          <span>
            {race?.name}: {winner?.name} wins!{' '}
            <a 
              href={getExplorerTxUrl(receipt.hash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              View on Explorer
            </a>
          </span>
        ),
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Set result failed:', error);
      toast({
        title: 'Settlement Failed',
        description: error.reason || error.message || 'Only oracle can set results',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [contract, signer, races]);

  const setRaceResultMock = async (raceId: string, winningDriverId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRaces(prev => prev.map(r => 
      r.id === raceId 
        ? { ...r, status: 'settled' as const, winningDriverId }
        : r
    ));

    setBets(prev => prev.map(bet => {
      if (bet.raceId !== raceId || bet.status !== 'pending') return bet;
      return {
        ...bet,
        status: bet.driverId === winningDriverId ? 'won' as BetStatus : 'lost' as BetStatus,
      };
    }));

    const race = races.find(r => r.id === raceId);
    const winner = race?.drivers.find(d => d.id === winningDriverId);

    toast({
      title: 'Race Result Set (Demo Mode)',
      description: `${race?.name}: ${winner?.name} wins!`,
    });

    setIsLoading(false);
    return true;
  };

  // Get implied odds from parimutuel pool
  const getImpliedOdds = useCallback(async (raceId: string, driverId: string): Promise<number> => {
    if (!contract) {
      // Return mock odds
      const race = races.find(r => r.id === raceId);
      const driver = race?.drivers.find(d => d.id === driverId);
      return driver?.odds || 2.0;
    }

    try {
      const raceIdBytes = stringToBytes32(raceId);
      const driverIdBytes = stringToBytes32(driverId);
      const odds = await contract.getImpliedOdds(raceIdBytes, driverIdBytes);
      return Number(odds) / 100; // Convert from x100 format
    } catch (error) {
      console.error('Failed to get implied odds:', error);
      return 2.0;
    }
  }, [contract, races]);

  // Fetch user bets from contract
  const fetchUserBetsFromContract = useCallback(async (userAddress: string): Promise<void> => {
    if (!contract || !provider) {
      console.log('Contract not ready for fetching user bets');
      return;
    }

    try {
      // Get all bet IDs for this user
      const betIds: string[] = await contract.getUserBets(userAddress);
      console.log('Fetched bet IDs from contract:', betIds.length);

      // Fetch bet details for each betId
      const fetchedBets: Bet[] = [];
      for (const betIdBytes of betIds) {
        try {
          const betInfo = await contract.getBetInfo(betIdBytes);
          const raceInfo = await contract.getRaceInfo(betInfo.raceId);
          
          // Convert bytes32 to string for raceId and driverId
          const raceIdStr = bytes32ToString(betInfo.raceId);
          const driverIdStr = bytes32ToString(betInfo.driverId);
          
          // Find race and driver in local state
          const race = races.find(r => r.id === raceIdStr);
          const driver = race?.drivers.find(d => d.id === driverIdStr);
          
          if (race && driver) {
            // Map contract status (0=Pending, 1=Won, 2=Lost, 3=Claimed)
            const statusMap: BetStatus[] = ['pending', 'won', 'lost', 'claimed'];
            const betStatus = statusMap[betInfo.status] || 'pending';
            
            // Get potential payout
            let potentialPayout = 0;
            if (betInfo.status === 1) { // Won
              potentialPayout = Number(ethers.formatEther(betInfo.payout));
            } else if (betInfo.status === 0) { // Pending
              const calculatedPayout = await contract.calculatePayout(betIdBytes);
              potentialPayout = Number(ethers.formatEther(calculatedPayout));
            }

            const bet: Bet = {
              id: `bet-${betIdBytes.slice(0, 10)}`,
              contractBetId: betIdBytes,
              raceId: raceIdStr,
              raceName: race.name,
              driverId: driverIdStr,
              driverName: driver.name,
              driverNumber: driver.number,
              team: driver.team,
              stake: Number(ethers.formatEther(betInfo.amount)),
              odds: driver.odds,
              status: betStatus,
              potentialPayout,
              placedAt: new Date().toISOString(), // Could fetch from events if needed
            };
            
            fetchedBets.push(bet);
          }
        } catch (error) {
          console.error(`Failed to fetch bet info for ${betIdBytes}:`, error);
        }
      }

      // Merge with existing bets (avoid duplicates)
      setBets(prev => {
        const existingContractBetIds = new Set(
          prev.filter(b => b.contractBetId).map(b => b.contractBetId)
        );
        const newBets = fetchedBets.filter(b => !existingContractBetIds.has(b.contractBetId));
        return [...newBets, ...prev];
      });

      console.log('Synced bets from contract:', fetchedBets.length);
    } catch (error) {
      console.error('Failed to fetch user bets:', error);
    }
  }, [contract, provider, races]);

  // Fetch contract events
  const refreshEvents = useCallback(async () => {
    if (!contract || !provider) {
      console.log('Contract not ready for event fetching');
      return;
    }

    try {
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

      // Query all event types
      const [betPlacedEvents, raceResultEvents, payoutEvents, raceCreatedEvents, driverAddedEvents, raceClosedEvents] = await Promise.all([
        contract.queryFilter('BetPlaced', fromBlock, currentBlock),
        contract.queryFilter('RaceResultSet', fromBlock, currentBlock),
        contract.queryFilter('PayoutClaimed', fromBlock, currentBlock),
        contract.queryFilter('RaceCreated', fromBlock, currentBlock),
        contract.queryFilter('DriverAdded', fromBlock, currentBlock),
        contract.queryFilter('RaceClosed', fromBlock, currentBlock),
      ]);

      const events: ContractEvent[] = [];

      // Process BetPlaced events
      for (const event of betPlacedEvents) {
        if (!('args' in event)) continue;
        const block = await event.getBlock();
        events.push({
          id: `${event.transactionHash}-${event.index}`,
          type: 'BetPlaced',
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000,
          data: {
            betId: event.args[0],
            raceId: event.args[1],
            driverId: event.args[2],
            user: event.args[3],
            amount: ethers.formatEther(event.args[4] || 0),
          },
        });
      }

      // Process RaceResultSet events
      for (const event of raceResultEvents) {
        if (!('args' in event)) continue;
        const block = await event.getBlock();
        events.push({
          id: `${event.transactionHash}-${event.index}`,
          type: 'RaceResultSet',
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000,
          data: {
            raceId: event.args[0],
            winningDriverId: event.args[1],
          },
        });
      }

      // Process PayoutClaimed events
      for (const event of payoutEvents) {
        if (!('args' in event)) continue;
        const block = await event.getBlock();
        events.push({
          id: `${event.transactionHash}-${event.index}`,
          type: 'PayoutClaimed',
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000,
          data: {
            betId: event.args[0],
            user: event.args[1],
            amount: ethers.formatEther(event.args[2] || 0),
          },
        });
      }

      // Process RaceCreated events
      for (const event of raceCreatedEvents) {
        if (!('args' in event)) continue;
        const block = await event.getBlock();
        events.push({
          id: `${event.transactionHash}-${event.index}`,
          type: 'RaceCreated',
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000,
          data: {
            raceId: event.args[0],
            name: event.args[1],
            cutoffTime: event.args[2]?.toString(),
          },
        });
      }

      // Process DriverAdded events
      for (const event of driverAddedEvents) {
        if (!('args' in event)) continue;
        const block = await event.getBlock();
        events.push({
          id: `${event.transactionHash}-${event.index}`,
          type: 'DriverAdded',
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000,
          data: {
            raceId: event.args[0],
            driverId: event.args[1],
            name: event.args[2],
          },
        });
      }

      // Process RaceClosed events (if needed in future)
      for (const event of raceClosedEvents) {
        if (!('args' in event)) continue;
        const block = await event.getBlock();
        events.push({
          id: `${event.transactionHash}-${event.index}`,
          type: 'RaceResultSet', // Use existing type for now, or add new type
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000,
          data: {
            raceId: event.args[0],
            action: 'closed',
          },
        });
      }

      // Sort by timestamp descending
      events.sort((a, b) => b.timestamp - a.timestamp);
      setContractEvents(events);
      console.log('Fetched events:', events.length);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }, [contract, provider]);

  // Set up live event listeners
  useEffect(() => {
    if (!contract) return;

    const handleBetPlaced = (betId: string, raceId: string, driverId: string, user: string, amount: bigint) => {
      console.log('New BetPlaced event:', { betId, raceId, driverId, user, amount: ethers.formatEther(amount) });
      refreshEvents();
    };

    const handleRaceResultSet = (raceId: string, winningDriverId: string) => {
      console.log('New RaceResultSet event:', { raceId, winningDriverId });
      refreshEvents();
    };

    const handlePayoutClaimed = (betId: string, user: string, amount: bigint) => {
      console.log('New PayoutClaimed event:', { betId, user, amount: ethers.formatEther(amount) });
      refreshEvents();
    };

    // Subscribe to events
    contract.on('BetPlaced', handleBetPlaced);
    contract.on('RaceResultSet', handleRaceResultSet);
    contract.on('PayoutClaimed', handlePayoutClaimed);

    // Initial fetch
    refreshEvents();

    return () => {
      contract.off('BetPlaced', handleBetPlaced);
      contract.off('RaceResultSet', handleRaceResultSet);
      contract.off('PayoutClaimed', handlePayoutClaimed);
    };
  }, [contract, refreshEvents]);

  // Simulate FTSO price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFtsoPrice(prev => ({
        ...prev,
        price: prev.price * (1 + (Math.random() - 0.5) * 0.01),
        timestamp: Date.now(),
        change24h: prev.change24h + (Math.random() - 0.5) * 0.5,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sync user bets when wallet connects
  useEffect(() => {
    if (wallet.isConnected && wallet.address && isContractReady) {
      fetchUserBetsFromContract(wallet.address);
    }
  }, [wallet.isConnected, wallet.address, isContractReady, fetchUserBetsFromContract]);

  return (
    <BettingContext.Provider value={{
      races,
      bets,
      ftsoPrice,
      userStats,
      contractEvents,
      placeBet,
      claimPayout,
      setRaceResult,
      refreshEvents,
      getImpliedOdds,
      fetchUserBetsFromContract,
      isLoading,
      isContractReady,
    }}>
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}
