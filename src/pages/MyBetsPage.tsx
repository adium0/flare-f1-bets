import { MainLayout } from '@/components/layout/MainLayout';
import { BetCard } from '@/components/cards/BetCard';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MyBetsPage() {
  const { bets } = useBetting();
  const { wallet, connect } = useWallet();

  const pendingBets = bets.filter(b => b.status === 'pending');
  const wonBets = bets.filter(b => b.status === 'won');
  const lostBets = bets.filter(b => b.status === 'lost');
  const claimedBets = bets.filter(b => b.status === 'claimed');

  if (!wallet.isConnected) {
    return (
      <MainLayout title="My Bets" subtitle="View and manage your bets">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="racing-card p-12 text-center"
        >
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your betting history.
          </p>
          <Button
            onClick={connect}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </motion.div>
      </MainLayout>
    );
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="racing-card p-12 text-center">
      <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground mb-4">{message}</p>
      <Link to="/races">
        <Button variant="outline">Browse Races</Button>
      </Link>
    </div>
  );

  return (
    <MainLayout title="My Bets" subtitle="View and manage your bets">
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-warning/20 data-[state=active]:text-warning"
          >
            Pending ({pendingBets.length})
          </TabsTrigger>
          <TabsTrigger 
            value="won"
            className="data-[state=active]:bg-success/20 data-[state=active]:text-success"
          >
            Won ({wonBets.length})
          </TabsTrigger>
          <TabsTrigger 
            value="lost"
            className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
          >
            Lost ({lostBets.length})
          </TabsTrigger>
          <TabsTrigger 
            value="claimed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Claimed ({claimedBets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingBets.length > 0 ? (
            pendingBets.map((bet, index) => (
              <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
            ))
          ) : (
            <EmptyState message="No pending bets. Place a bet on an upcoming race!" />
          )}
        </TabsContent>

        <TabsContent value="won" className="mt-6 space-y-4">
          {wonBets.length > 0 ? (
            wonBets.map((bet, index) => (
              <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
            ))
          ) : (
            <EmptyState message="No winning bets yet. Keep betting!" />
          )}
        </TabsContent>

        <TabsContent value="lost" className="mt-6 space-y-4">
          {lostBets.length > 0 ? (
            lostBets.map((bet, index) => (
              <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
            ))
          ) : (
            <EmptyState message="No lost bets. Great streak!" />
          )}
        </TabsContent>

        <TabsContent value="claimed" className="mt-6 space-y-4">
          {claimedBets.length > 0 ? (
            claimedBets.map((bet, index) => (
              <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
            ))
          ) : (
            <EmptyState message="No claimed payouts yet." />
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
