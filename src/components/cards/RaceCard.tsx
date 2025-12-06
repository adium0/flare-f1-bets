import { motion } from 'framer-motion';
import { Race } from '@/types/betting';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RaceCardProps {
  race: Race;
  onSelect: (race: Race) => void;
  delay?: number;
}

export function RaceCard({ race, onSelect, delay = 0 }: RaceCardProps) {
  const statusColors = {
    upcoming: 'text-primary bg-primary/10 border-primary/30',
    closed: 'text-warning bg-warning/10 border-warning/30',
    settled: 'text-muted-foreground bg-muted border-muted',
  };

  const statusLabels = {
    upcoming: 'Betting Open',
    closed: 'Closed',
    settled: 'Settled',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="racing-card group cursor-pointer"
      onClick={() => onSelect(race)}
    >
      {/* Race header with gradient */}
      <div className="relative h-32 bg-gradient-to-br from-card via-accent to-card overflow-hidden">
        <div className="absolute inset-0 racing-stripes opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        
        {/* Status badge */}
        <div className={cn(
          "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border",
          statusColors[race.status]
        )}>
          {statusLabels[race.status]}
        </div>

        {/* Race name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-foreground truncate">{race.name}</h3>
        </div>
      </div>

      {/* Race details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{race.circuit}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(race.date)}</span>
          </div>
          {race.status === 'upcoming' && (
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Betting Open</span>
            </div>
          )}
        </div>

        {/* Top drivers preview */}
        <div className="flex items-center gap-2 pt-2">
          {race.drivers.slice(0, 4).map((driver, i) => (
            <div
              key={driver.id}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold"
              style={{ 
                backgroundColor: `hsl(var(--team-${driver.team}) / 0.2)`,
                color: `hsl(var(--team-${driver.team}))`
              }}
            >
              {driver.number}
            </div>
          ))}
          {race.drivers.length > 4 && (
            <span className="text-sm text-muted-foreground">
              +{race.drivers.length - 4} more
            </span>
          )}
        </div>

        {/* Action button */}
        <Button
          variant="ghost"
          className="w-full mt-2 group-hover:bg-primary/10 group-hover:text-primary"
        >
          {race.status === 'upcoming' ? 'Place Bet' : 'View Details'}
          <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
}
