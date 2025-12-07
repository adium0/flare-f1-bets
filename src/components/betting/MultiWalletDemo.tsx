import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wallet, RefreshCw, Info, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

/**
 * MultiWalletDemo Component
 * 
 * Helper component for demo purposes to simulate bets from multiple wallets.
 * This allows you to:
 * 1. Place a bet with Wallet 1 (losing bet)
 * 2. Place a bet with Wallet 2 (winning bet)
 * 3. Show the token flow from losing to winning wallet
 * 
 * Instructions:
 * 1. Connect Wallet 1 and place a bet on a driver
 * 2. Switch to Wallet 2 in MetaMask
 * 3. Connect Wallet 2 and place a bet on a different driver
 * 4. Set the race result (oracle) to make Wallet 2's driver win
 * 5. Claim payout from Wallet 2 to see tokens transfer
 */
export function MultiWalletDemo() {
  const { wallet, connect, switchNetwork } = useWallet();
  const { races, bets, placeBet, setRaceResult, claimPayout } = useBetting();
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [stake, setStake] = useState<string>('0.1');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const selectedRace = races.find(r => r.id === selectedRaceId);
  const upcomingRaces = races.filter(r => r.status === 'upcoming');

  // Get bets for current wallet
  const currentWalletBets = bets.filter(b => {
    // In a real scenario, we'd filter by wallet address
    // For demo, show all bets
    return true;
  });

  const pendingBets = currentWalletBets.filter(b => b.status === 'pending');
  const wonBets = currentWalletBets.filter(b => b.status === 'won');
  const lostBets = currentWalletBets.filter(b => b.status === 'lost');

  const handlePlaceBet = async () => {
    if (!selectedRaceId || !selectedDriverId || !stake) {
      toast({
        title: 'Missing Information',
        description: 'Please select a race, driver, and enter a stake amount.',
        variant: 'destructive',
      });
      return;
    }

    if (!wallet.isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }

    setIsPlacingBet(true);
    const success = await placeBet(selectedRaceId, selectedDriverId, parseFloat(stake));
    setIsPlacingBet(false);

    if (success) {
      setSelectedRaceId('');
      setSelectedDriverId('');
      setStake('0.1');
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <CardTitle>Multi-Wallet Demo Instructions</CardTitle>
            </div>
            <CardDescription>
              Simulate betting with multiple wallets to demonstrate the parimutuel system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Connect <strong>Wallet 1</strong> and place a bet on Driver A (e.g., 0.1 C2FLR)</li>
              <li>Switch to <strong>Wallet 2</strong> in MetaMask (click account icon → switch account)</li>
              <li>Connect <strong>Wallet 2</strong> and place a bet on Driver B (e.g., 0.1 C2FLR)</li>
              <li>Go to Oracle page and set race result with Driver B as winner</li>
              <li>Switch back to <strong>Wallet 2</strong> and claim the payout</li>
              <li>Observe: Tokens from Wallet 1 (loser) flow to Wallet 2 (winner)</li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Current Wallet Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!wallet.isConnected ? (
              <Alert>
                <AlertTitle>Wallet Not Connected</AlertTitle>
                <AlertDescription className="mt-2">
                  <Button onClick={connect} className="mt-2">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <span className="text-sm font-mono">{wallet.address?.slice(0, 10)}...{wallet.address?.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance:</span>
                  <span className="text-sm font-semibold">{wallet.balance} C2FLR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network:</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    wallet.isCorrectNetwork ? "text-success" : "text-destructive"
                  )}>
                    {wallet.isCorrectNetwork ? 'Coston2 ✓' : 'Wrong Network'}
                  </span>
                </div>
                {!wallet.isCorrectNetwork && (
                  <Button onClick={switchNetwork} variant="outline" size="sm" className="w-full mt-2">
                    Switch to Coston2
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Bet Form */}
      {wallet.isConnected && wallet.isCorrectNetwork && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Bet (Current Wallet)</CardTitle>
              <CardDescription>
                Place a bet with the currently connected wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Race Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Race</label>
                <select
                  value={selectedRaceId}
                  onChange={(e) => {
                    setSelectedRaceId(e.target.value);
                    setSelectedDriverId('');
                  }}
                  className="w-full p-2 rounded-lg border bg-background"
                >
                  <option value="">Choose a race...</option>
                  {upcomingRaces.map(race => (
                    <option key={race.id} value={race.id}>
                      {race.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Driver Selection */}
              {selectedRace && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Driver</label>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-background"
                  >
                    <option value="">Choose a driver...</option>
                    {selectedRace.drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        #{driver.number} {driver.name} ({driver.team})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stake Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Stake Amount (C2FLR)</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  min="0.01"
                  max="10"
                  step="0.01"
                  className="w-full p-2 rounded-lg border bg-background"
                  placeholder="0.1"
                />
              </div>

              <Button
                onClick={handlePlaceBet}
                disabled={!selectedRaceId || !selectedDriverId || !stake || isPlacingBet}
                className="w-full"
              >
                {isPlacingBet ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Placing Bet...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Place Bet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Current Wallet Bets Summary */}
      {wallet.isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Current Wallet Bets</CardTitle>
              <CardDescription>
                Bets placed with the currently connected wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <RefreshCw className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{pendingBets.length}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">Won</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{wonBets.length}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Lost</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{lostBets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

