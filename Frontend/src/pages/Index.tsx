import { useState } from 'react';
import { SessionSelector } from '@/components/SessionSelector';
import { RaceReplay } from '@/components/RaceReplay';
import { RaceSession } from '@/data/mockData';

interface SelectedSession {
  session: RaceSession;
  sessionType: string;
}

const Index = () => {
  const [selectedSession, setSelectedSession] = useState<SelectedSession | null>(null);

  const handleSessionSelect = (session: RaceSession, sessionType: string) => {
    setSelectedSession({ session, sessionType });
  };

  const handleBack = () => {
    setSelectedSession(null);
  };

  if (selectedSession) {
    return (
      <RaceReplay
        session={selectedSession.session}
        sessionType={selectedSession.sessionType}
        onBack={handleBack}
      />
    );
  }

  return <SessionSelector onSessionSelect={handleSessionSelect} />;
};

export default Index;
