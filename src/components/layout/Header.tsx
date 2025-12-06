import { useWallet } from '@/context/WalletContext';
import { useBetting } from '@/context/BettingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wallet, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { wallet, connect, switchNetwork, disconnect, isLoading } = useWallet();
  const { ftsoPrice } = useBetting();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full flex items-center justify-between px-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* FTSO Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">FLR/USD (FTSO)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-foreground">
                  ${ftsoPrice.price.toFixed(4)}
                </span>
                <span className={cn(
                  "flex items-center text-xs font-medium",
                  ftsoPrice.change24h >= 0 ? "text-success" : "text-destructive"
                )}>
                  {ftsoPrice.change24h >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(ftsoPrice.change24h).toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Network Warning */}
          {wallet.isConnected && !wallet.isCorrectNetwork && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={switchNetwork}
                className="border-warning text-warning hover:bg-warning/10"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Switch to Coston2
              </Button>
            </motion.div>
          )}

          {/* Wallet Button */}
          {wallet.isConnected ? (
            <Button
              variant="outline"
              onClick={disconnect}
              className="border-border hover:border-destructive hover:text-destructive"
            >
              <div className={cn(
                "w-2 h-2 rounded-full mr-2",
                wallet.isCorrectNetwork ? "bg-success" : "bg-warning"
              )} />
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </Button>
          ) : (
            <Button
              onClick={connect}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
