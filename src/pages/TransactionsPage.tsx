import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Ticket, Trophy, Wallet, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { ContractEvent } from '@/types/betting';
import { getExplorerTxUrl, getExplorerAddressUrl, bytes32ToString } from '@/config/contract';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const eventConfig = {
  BetPlaced: {
    icon: Ticket,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Bet Placed',
  },
  RaceResultSet: {
    icon: Trophy,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    label: 'Race Result',
  },
  PayoutClaimed: {
    icon: Wallet,
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Payout Claimed',
  },
  RaceCreated: {
    icon: Trophy,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    label: 'Race Created',
  },
  DriverAdded: {
    icon: Ticket,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    label: 'Driver Added',
  },
};

function EventCard({ event }: { event: ContractEvent }) {
  const config = eventConfig[event.type];
  const Icon = config.icon;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="racing-card p-4 hover:border-primary/30 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("p-3 rounded-xl", config.bgColor)}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("border-0", config.bgColor, config.color)}>
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(event.timestamp)}
            </span>
          </div>

          {/* Event-specific data */}
          <div className="space-y-1 text-sm">
            {event.type === 'BetPlaced' && (
              <>
                <p className="text-foreground">
                  <span className="text-muted-foreground">User:</span>{' '}
                  <a 
                    href={getExplorerAddressUrl(event.data.user)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {truncateAddress(event.data.user)}
                  </a>
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Amount:</span>{' '}
                  <span className="font-mono font-semibold text-primary">{event.data.amount} C2FLR</span>
                </p>
              </>
            )}

            {event.type === 'RaceResultSet' && (
              <p className="text-foreground">
                <span className="text-muted-foreground">Winner Set:</span>{' '}
                <span className="font-semibold">{bytes32ToString(event.data.winningDriverId) || 'Driver ID'}</span>
              </p>
            )}

            {event.type === 'PayoutClaimed' && (
              <>
                <p className="text-foreground">
                  <span className="text-muted-foreground">User:</span>{' '}
                  <a 
                    href={getExplorerAddressUrl(event.data.user)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {truncateAddress(event.data.user)}
                  </a>
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Payout:</span>{' '}
                  <span className="font-mono font-semibold text-success">{event.data.amount} C2FLR</span>
                </p>
              </>
            )}
          </div>

          {/* Transaction link */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tx:</span>
            <a 
              href={getExplorerTxUrl(event.txHash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
            >
              {truncateHash(event.txHash)}
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-xs text-muted-foreground">
              Block #{event.blockNumber}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TransactionsPage() {
  const { contractEvents, refreshEvents, isContractReady } = useBetting();
  const { wallet } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'BetPlaced' | 'RaceResultSet' | 'PayoutClaimed'>('all');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshEvents();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredEvents = filter === 'all' 
    ? contractEvents 
    : contractEvents.filter(e => e.type === filter);

  const eventCounts = {
    all: contractEvents.length,
    BetPlaced: contractEvents.filter(e => e.type === 'BetPlaced').length,
    RaceResultSet: contractEvents.filter(e => e.type === 'RaceResultSet').length,
    PayoutClaimed: contractEvents.filter(e => e.type === 'PayoutClaimed').length,
  };

  return (
    <MainLayout 
      title="Transaction History" 
      subtitle="All smart contract events on Coston2"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'BetPlaced', 'RaceResultSet', 'PayoutClaimed'] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className="gap-2"
            >
              {type === 'all' ? 'All' : eventConfig[type].label}
              <Badge variant="secondary" className="ml-1">
                {eventCounts[type]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={!isContractReady || isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Status Banner */}
      {!wallet.isConnected && (
        <div className="racing-card p-4 mb-6 border-warning/50 bg-warning/5">
          <p className="text-warning text-sm">
            Connect your wallet to view live contract events
          </p>
        </div>
      )}

      {wallet.isConnected && !wallet.isCorrectNetwork && (
        <div className="racing-card p-4 mb-6 border-destructive/50 bg-destructive/5">
          <p className="text-destructive text-sm">
            Please switch to Coston2 network to view events
          </p>
        </div>
      )}

      {isContractReady && contractEvents.length === 0 && (
        <div className="racing-card p-8 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
          <p className="text-muted-foreground text-sm">
            No contract events have been recorded yet. Place a bet to see activity!
          </p>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Demo Mode Notice */}
      {!isContractReady && (
        <div className="racing-card p-6 mt-6 border-muted">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-muted">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Demo Mode</h3>
              <p className="text-sm text-muted-foreground">
                Contract not deployed or wallet not connected. Events will appear here once you're connected 
                to Coston2 and the contract is deployed.
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
