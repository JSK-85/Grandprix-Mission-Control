import { useState, useEffect } from 'react';
import { ChevronRight, Calendar, MapPin, Flag, Search, Loader2 } from 'lucide-react';
import { years, RaceSession } from '@/data/mockData';
import { fetchRounds } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SessionSelectorProps {
  onSessionSelect: (session: RaceSession, sessionType: string) => void;
}

export const SessionSelector = ({ onSessionSelect }: SessionSelectorProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRound, setSelectedRound] = useState<RaceSession | null>(null);

  const [sessions, setSessions] = useState<RaceSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRounds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // The backend returns a list of events. We need to map them to RaceSession interface if needed,
        // or just use what backend sends if matches.
        // Backend `get_rounds` returns: { year: number, round: number, eventName: string, country: string, countryCode: string, date: string, sessions: string[] }[]
        // This matches RaceSession interface exactly? checking api_server.py...
        // Yes, api_server returns list of dicts.
        const data = await fetchRounds(selectedYear);
        setSessions(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load race calendar");
      } finally {
        setIsLoading(false);
      }
    };
    loadRounds();
  }, [selectedYear]);


  const filteredSessions = sessions
    .filter((s) => s.year === selectedYear)
    .filter(
      (s) =>
        s.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSessionTypeSelect = (sessionType: string) => {
    if (selectedRound) {
      onSessionSelect(selectedRound, sessionType);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            F1 Race Replay
          </h1>
          <p className="text-muted-foreground">
            Select a session to begin visualization
          </p>
        </div>

        {/* Year Selection */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-sm text-muted-foreground">Season</span>
          <Select
            value={selectedYear.toString()}
            onValueChange={(v) => setSelectedYear(parseInt(v))}
          >
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Grand Prix..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Round Selection or Session Type Selection */}
        {!selectedRound ? (
          <>
            {isLoading && <div className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto text-primary" /> Loading calendar...</div>}

            {error && <div className="text-center text-red-500 py-10">{error}</div>}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[600px] overflow-y-auto pr-2">
                {filteredSessions.map((session) => (
                  <button
                    type="button"
                    key={session.round}
                    onClick={() => setSelectedRound(session)}
                    className="glass-panel p-4 text-left hover:bg-secondary/80 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {session.round}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {session.eventName}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {session.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {session.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="fade-in">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => setSelectedRound(null)}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              ← Back to rounds
            </Button>

            {/* Selected Round Info */}
            <div className="glass-panel p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {selectedRound.round}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedRound.eventName}
                  </h2>
                  <div className="flex items-center gap-3 text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Flag className="w-4 h-4" />
                      {selectedRound.country}
                    </span>
                    <span>{selectedRound.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Type Selection */}
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Select Session
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedRound.sessions.map((sessionType) => (
                <button
                  type="button"
                  key={sessionType}
                  onClick={() => handleSessionTypeSelect(sessionType)}
                  className="glass-panel p-4 text-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                >
                  <span className="font-medium text-foreground">
                    {sessionType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
