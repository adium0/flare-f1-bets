import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/cards/StatCard';
import { RaceCard } from '@/components/cards/RaceCard';
import { BetForm } from '@/components/betting/BetForm';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Race } from '@/types/betting';
import { 
  Trophy, 
  Ticket, 
  TrendingUp, 
  Percent,
  Zap,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { races, userStats, ftsoPrice } = useBetting();
  const { wallet, connect } = useWallet();
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const upcomingRaces = races.filter(r => r.status === 'upcoming').slice(0, 3);

  return (
    <MainLayout title="Dashboard" subtitle="Welcome to Flare F1 Betting">
      <div className="space-y-8">
        {/* Hero Section */}
        {!wallet.isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-accent to-card border border-border p-8"
          >
            <div className="absolute inset-0 racing-stripes opacity-30" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-glow-gradient opacity-50" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Powered by Flare FTSO & FDC
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Decentralized F1 Betting
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Place bets on Formula 1 races with trustless, oracle-secured settlements. 
                No middlemen, transparent payouts.
              </p>
              <Button
                onClick={connect}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet to Start
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Bets"
            value={userStats.totalBets}
            subtitle="Lifetime bets placed"
            icon={Ticket}
            delay={0}
          />
          <StatCard
            title="Win Rate"
            value={`${userStats.winRate.toFixed(1)}%`}
            subtitle={`${userStats.totalWon} wins`}
            icon={Percent}
            trend={{ value: 5.2, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Total Staked"
            value={`${userStats.totalStaked.toFixed(2)}`}
            subtitle="C2FLR wagered"
            icon={TrendingUp}
            delay={0.2}
          />
          <StatCard
            title="Total Winnings"
            value={`${userStats.totalWinnings.toFixed(2)}`}
            subtitle="C2FLR won"
            icon={Trophy}
            trend={{ value: 12.5, isPositive: true }}
            delay={0.3}
          />
        </div>

        {/* FTSO Integration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="racing-card p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Flare FTSO Price Feed</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time decentralized oracle data
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-foreground">
                ${ftsoPrice.price.toFixed(4)}
              </p>
              <p className={`text-sm font-medium ${ftsoPrice.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                {ftsoPrice.change24h >= 0 ? '+' : ''}{ftsoPrice.change24h.toFixed(2)}% (24h)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Races */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Upcoming Races</h3>
            <Link to="/races">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingRaces.map((race, index) => (
              <RaceCard
                key={race.id}
                race={race}
                onSelect={setSelectedRace}
                delay={0.5 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bet Form Modal */}
      <AnimatePresence>
        {selectedRace && (
          <BetForm race={selectedRace} onClose={() => setSelectedRace(null)} />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
