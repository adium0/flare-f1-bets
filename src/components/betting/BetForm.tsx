import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Race, Driver } from '@/types/betting';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Check, Loader2, Wallet, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BetFormProps {
  race: Race;
  onClose: () => void;
}

export function BetForm({ race, onClose }: BetFormProps) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [stake, setStake] = useState('');
  const { placeBet, isLoading } = useBetting();
  const { wallet, connect } = useWallet();

  const handleSubmit = async () => {
    if (!selectedDriver || !stake) return;
    
    const success = await placeBet(race.id, selectedDriver.id, parseFloat(stake));
    if (success) {
      onClose();
    }
  };

  const potentialPayout = selectedDriver && stake 
    ? (parseFloat(stake) * selectedDriver.odds).toFixed(4)
    : '0.0000';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">{race.name}</h2>
            <p className="text-sm text-muted-foreground">{race.circuit}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Driver Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Select Driver</Label>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-thin">
              {race.drivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left",
                    selectedDriver?.id === driver.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: `hsl(var(--team-${driver.team}) / 0.2)`,
                      color: `hsl(var(--team-${driver.team}))`,
                    }}
                  >
                    {driver.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{driver.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{driver.team}</p>
                  </div>
                  <div className="odds-badge">
                    {driver.odds.toFixed(2)}x
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stake Input */}
          <AnimatePresence>
            {selectedDriver && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Label htmlFor="stake" className="text-sm font-medium text-foreground">
                  Stake Amount (C2FLR)
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="stake"
                    type="number"
                    placeholder="0.00"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="flex-1 bg-background border-border font-mono"
                  />
                  <div className="flex gap-2">
                    {[0.1, 0.5, 1.0].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setStake(amount.toString())}
                        className="border-border hover:border-primary hover:bg-primary/10"
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Payout Preview */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Payout</p>
                    <p className="text-2xl font-bold text-gradient">{potentialPayout} C2FLR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">at odds</p>
                    <p className="text-xl font-bold text-primary">{selectedDriver.odds.toFixed(2)}x</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Network Warning */}
          {wallet.isConnected && !wallet.isCorrectNetwork && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <p className="text-sm text-warning">
                Please switch to Coston2 network to place bets.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {!wallet.isConnected ? (
            <Button onClick={connect} className="bg-primary text-primary-foreground">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!selectedDriver || !stake || isLoading || !wallet.isCorrectNetwork}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Bet...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Place Bet
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
