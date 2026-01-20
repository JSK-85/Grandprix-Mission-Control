import { Flag } from 'lucide-react';

interface StatusBarProps {
  trackStatus: 'green' | 'yellow' | 'vsc' | 'sc' | 'red';
  sessionName: string;
  eventName: string;
}

const statusConfig = {
  green: { label: 'GREEN FLAG', color: 'bg-status-green', textColor: 'text-status-green' },
  yellow: { label: 'YELLOW FLAG', color: 'bg-status-yellow', textColor: 'text-status-yellow' },
  vsc: { label: 'VSC', color: 'bg-status-yellow', textColor: 'text-status-yellow' },
  sc: { label: 'SAFETY CAR', color: 'bg-status-yellow', textColor: 'text-status-yellow' },
  red: { label: 'RED FLAG', color: 'bg-status-red', textColor: 'text-status-red' },
};

export const StatusBar = ({ trackStatus, sessionName, eventName }: StatusBarProps) => {
  const status = statusConfig[trackStatus];

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card/50 border-b border-border">
      {/* Event Info */}
      <div>
        <h1 className="font-semibold text-foreground">{eventName}</h1>
        <p className="text-sm text-muted-foreground">{sessionName}</p>
      </div>

      {/* Track Status */}
      <div className="flex items-center gap-2">
        <div className={`status-indicator ${status.color}`} />
        <span className={`text-sm font-semibold ${status.textColor}`}>
          {status.label}
        </span>
        <Flag className={`w-4 h-4 ${status.textColor}`} />
      </div>
    </div>
  );
};
