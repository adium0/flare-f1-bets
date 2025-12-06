import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { RaceCard } from '@/components/cards/RaceCard';
import { BetForm } from '@/components/betting/BetForm';
import { useBetting } from '@/context/BettingContext';
import { Race } from '@/types/betting';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RacesPage() {
  const { races } = useBetting();
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const upcomingRaces = races.filter(r => r.status === 'upcoming');
  const closedRaces = races.filter(r => r.status === 'closed');
  const settledRaces = races.filter(r => r.status === 'settled');

  return (
    <MainLayout title="Races" subtitle="Browse and bet on F1 races">
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger 
            value="upcoming"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Upcoming ({upcomingRaces.length})
          </TabsTrigger>
          <TabsTrigger 
            value="closed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Closed ({closedRaces.length})
          </TabsTrigger>
          <TabsTrigger 
            value="settled"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Settled ({settledRaces.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingRaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRaces.map((race, index) => (
                <RaceCard
                  key={race.id}
                  race={race}
                  onSelect={setSelectedRace}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="racing-card p-12 text-center">
              <p className="text-muted-foreground">No upcoming races at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          {closedRaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedRaces.map((race, index) => (
                <RaceCard
                  key={race.id}
                  race={race}
                  onSelect={setSelectedRace}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="racing-card p-12 text-center">
              <p className="text-muted-foreground">No closed races pending settlement.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settled" className="mt-6">
          {settledRaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settledRaces.map((race, index) => (
                <RaceCard
                  key={race.id}
                  race={race}
                  onSelect={setSelectedRace}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="racing-card p-12 text-center">
              <p className="text-muted-foreground">No races have been settled yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bet Form Modal */}
      <AnimatePresence>
        {selectedRace && selectedRace.status === 'upcoming' && (
          <BetForm race={selectedRace} onClose={() => setSelectedRace(null)} />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
