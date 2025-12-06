import { motion } from 'framer-motion';
import { Bet } from '@/types/betting';
import { Clock, Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useBetting } from '@/context/BettingContext';
import { COSTON2_CONFIG } from '@/data/mockData';

interface BetCardProps {
  bet: Bet;
  delay?: number;
}

export function BetCard({ bet, delay = 0 }: BetCardProps) {
  const { claimPayout, isLoading } = useBetting();

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      label: 'Pending',
    },
    won: {
      icon: Check,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      label: 'Won',
    },
    lost: {
      icon: X,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      label: 'Lost',
    },
    claimed: {
      icon: Check,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-muted',
      label: 'Claimed',
    },
  };

  const config = statusConfig[bet.status];
  const StatusIcon = config.icon;

  const handleClaim = async () => {
    await claimPayout(bet.id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "racing-card p-5 border-l-4",
        config.borderColor
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Bet info */}
        <div className="flex-1 space-y-3">
          {/* Race & Driver */}
          <div>
            <p className="text-sm text-muted-foreground">{bet.raceName}</p>
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: `hsl(var(--team-${bet.team}) / 0.2)`,
                  color: `hsl(var(--team-${bet.team}))`,
                }}
              >
                {bet.driverNumber}
              </div>
              <div>
                <p className="font-semibold text-foreground">{bet.driverName}</p>
                <p className="text-xs text-muted-foreground capitalize">{bet.team}</p>
              </div>
            </div>
          </div>

          {/* Bet details */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Stake</p>
              <p className="font-mono font-semibold text-foreground">{bet.stake} C2FLR</p>
            </div>
            <div>
              <p className="text-muted-foreground">Odds</p>
              <p className="font-mono font-semibold text-primary">{bet.odds.toFixed(2)}x</p>
            </div>
            <div>
              <p className="text-muted-foreground">Potential</p>
              <p className="font-mono font-semibold text-foreground">{bet.potentialPayout.toFixed(4)} C2FLR</p>
            </div>
          </div>

          {/* Timestamp & TX */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formatDate(bet.placedAt)}</span>
            {bet.txHash && (
              <a
                href={`${COSTON2_CONFIG.explorerUrl}/tx/${bet.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{bet.txHash}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Right side - Status & Action */}
        <div className="flex flex-col items-end gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
            config.bgColor,
            config.color,
            config.borderColor
          )}>
            <StatusIcon className="w-4 h-4" />
            <span>{config.label}</span>
          </div>

          {bet.status === 'won' && (
            <Button
              onClick={handleClaim}
              disabled={isLoading}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>Claim {bet.potentialPayout.toFixed(4)} C2FLR</>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
