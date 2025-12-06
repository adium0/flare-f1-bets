import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Loader2, Check, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OraclePanel() {
  const { races, setRaceResult, isLoading } = useBetting();
  const { wallet } = useWallet();
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const closedRaces = races.filter(r => r.status === 'closed' || r.status === 'upcoming');
  const selectedRace = races.find(r => r.id === selectedRaceId);

  const handleSubmitResult = async () => {
    if (!selectedRaceId || !selectedDriverId) return;
    await setRaceResult(selectedRaceId, selectedDriverId);
    setSelectedRaceId('');
    setSelectedDriverId('');
  };

  return (
    <div className="space-y-6">
      {/* Oracle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="racing-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Oracle Settlement</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This panel simulates the oracle role for demo purposes. In production, 
              this would be handled by Flare's Data Connector (FDC) with attested data.
            </p>
          </div>
        </div>

        {/* FDC Vision */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-primary font-medium mb-2">
            <Zap className="w-4 h-4" />
            <span>FDC Production Flow</span>
          </div>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Worker polls official F1 API for race results</li>
            <li>Result is submitted to FDC attestation providers</li>
            <li>Merkle proof is generated for the attested data</li>
            <li>Contract verifies proof and settles bets automatically</li>
          </ol>
        </div>
      </motion.div>

      {/* Settlement Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="racing-card p-6 space-y-6"
      >
        <h3 className="text-lg font-bold text-foreground">Submit Race Result</h3>

        {/* Connection Warning */}
        {!wallet.isConnected && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <p className="text-sm text-warning">
              Connect your wallet to submit oracle results.
            </p>
          </div>
        )}

        {/* Race Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Race</Label>
          <Select value={selectedRaceId} onValueChange={(value) => {
            setSelectedRaceId(value);
            setSelectedDriverId('');
          }}>
            <SelectTrigger className="w-full bg-background border-border">
              <SelectValue placeholder="Choose a race to settle" />
            </SelectTrigger>
            <SelectContent>
              {closedRaces.map((race) => (
                <SelectItem key={race.id} value={race.id}>
                  <div className="flex items-center gap-3">
                    <span>{race.name}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      race.status === 'upcoming' 
                        ? "bg-primary/10 text-primary" 
                        : "bg-warning/10 text-warning"
                    )}>
                      {race.status}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Driver Selection */}
        {selectedRace && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">Winning Driver</Label>
            <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="Select the race winner" />
              </SelectTrigger>
              <SelectContent>
                {selectedRace.drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: `hsl(var(--team-${driver.team}) / 0.2)`,
                          color: `hsl(var(--team-${driver.team}))`,
                        }}
                      >
                        {driver.number}
                      </div>
                      <span>{driver.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {driver.team}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitResult}
          disabled={!selectedRaceId || !selectedDriverId || isLoading || !wallet.isConnected}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-secondary"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Result...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Submit Result
            </>
          )}
        </Button>
      </motion.div>

      {/* Settled Races */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="racing-card p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Settled Races</h3>
        <div className="space-y-3">
          {races.filter(r => r.status === 'settled').map((race) => {
            const winner = race.drivers.find(d => d.id === race.winningDriverId);
            return (
              <div
                key={race.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div>
                  <p className="font-semibold text-foreground">{race.name}</p>
                  <p className="text-sm text-muted-foreground">{race.circuit}</p>
                </div>
                {winner && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: `hsl(var(--team-${winner.team}) / 0.2)`,
                        color: `hsl(var(--team-${winner.team}))`,
                      }}
                    >
                      {winner.number}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{winner.name}</p>
                      <p className="text-xs text-success">Winner</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {races.filter(r => r.status === 'settled').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No races have been settled yet.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
