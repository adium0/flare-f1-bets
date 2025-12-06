import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Race, Bet, BetStatus, FtsoPrice, UserStats } from '@/types/betting';
import { mockRaces, mockBets, mockFtsoPrice, mockUserStats } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface BettingContextType {
  races: Race[];
  bets: Bet[];
  ftsoPrice: FtsoPrice;
  userStats: UserStats;
  placeBet: (raceId: string, driverId: string, stake: number) => Promise<boolean>;
  claimPayout: (betId: string) => Promise<boolean>;
  setRaceResult: (raceId: string, winningDriverId: string) => Promise<boolean>;
  isLoading: boolean;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [races, setRaces] = useState<Race[]>(mockRaces);
  const [bets, setBets] = useState<Bet[]>(mockBets);
  const [ftsoPrice, setFtsoPrice] = useState<FtsoPrice>(mockFtsoPrice);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [isLoading, setIsLoading] = useState(false);

  const placeBet = useCallback(async (raceId: string, driverId: string, stake: number): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const race = races.find(r => r.id === raceId);
      const driver = race?.drivers.find(d => d.id === driverId);
      
      if (!race || !driver) {
        throw new Error('Race or driver not found');
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
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
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
        description: `${stake} C2FLR on ${driver.name} @ ${driver.odds.toFixed(2)}x`,
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: 'Bet Failed',
        description: error.message || 'Failed to place bet.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [races]);

  const claimPayout = useCallback(async (betId: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const bet = bets.find(b => b.id === betId);
      if (!bet || bet.status !== 'won') {
        throw new Error('Invalid bet for claiming');
      }

      setBets(prev => prev.map(b => 
        b.id === betId ? { ...b, status: 'claimed' as BetStatus } : b
      ));

      setUserStats(prev => ({
        ...prev,
        totalWinnings: prev.totalWinnings + bet.potentialPayout,
      }));

      toast({
        title: 'Payout Claimed!',
        description: `${bet.potentialPayout.toFixed(4)} C2FLR has been transferred to your wallet.`,
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: 'Claim Failed',
        description: error.message || 'Failed to claim payout.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [bets]);

  const setRaceResult = useCallback(async (raceId: string, winningDriverId: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Update race with result
      setRaces(prev => prev.map(r => 
        r.id === raceId 
          ? { ...r, status: 'settled' as const, winningDriverId }
          : r
      ));

      // Update bets for this race
      setBets(prev => prev.map(bet => {
        if (bet.raceId !== raceId || bet.status !== 'pending') return bet;
        return {
          ...bet,
          status: bet.driverId === winningDriverId ? 'won' as BetStatus : 'lost' as BetStatus,
        };
      }));

      // Update stats
      const raceBets = bets.filter(b => b.raceId === raceId && b.status === 'pending');
      const wonBets = raceBets.filter(b => b.driverId === winningDriverId);
      
      setUserStats(prev => ({
        ...prev,
        totalWon: prev.totalWon + wonBets.length,
        pendingBets: prev.pendingBets - raceBets.length,
        winRate: ((prev.totalWon + wonBets.length) / (prev.totalBets)) * 100,
      }));

      const race = races.find(r => r.id === raceId);
      const winner = race?.drivers.find(d => d.id === winningDriverId);

      toast({
        title: 'Race Result Set!',
        description: `${race?.name}: ${winner?.name} wins!`,
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: 'Settlement Failed',
        description: error.message || 'Failed to set race result.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [races, bets]);

  // Simulate FTSO price updates
  React.useEffect(() => {
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

  return (
    <BettingContext.Provider value={{
      races,
      bets,
      ftsoPrice,
      userStats,
      placeBet,
      claimPayout,
      setRaceResult,
      isLoading,
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
