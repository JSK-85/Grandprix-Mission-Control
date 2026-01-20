import { DriverFrameData } from '@/lib/api';

interface LeaderboardProps {
  drivers: (DriverFrameData & { abbreviation: string; teamColor: string })[];
  onDriverSelect: (abbreviation: string) => void;
  selectedDriver?: string;
  driverColors?: Record<string, [number, number, number]>;
}

const TyreIcon = ({ compound }: { compound: number }) => {
  let label = '?';
  let color = 'gray';
  let borderColor = 'gray';

  switch (compound) {
    case 0: // Soft
      label = 'S';
      color = '#FF1801'; // F1 Red
      borderColor = '#FF1801';
      break;
    case 1: // Medium
      label = 'M';
      color = '#FFD700'; // F1 Yellow
      borderColor = '#FFD700';
      break;
    case 2: // Hard
      label = 'H';
      color = '#F0F0F0'; // White
      borderColor = '#F0F0F0';
      break;
    case 3: // Inter
      label = 'I';
      color = '#39B54A'; // Green
      borderColor = '#39B54A';
      break;
    case 4: // Wet
      label = 'W';
      color = '#2251B8'; // Blue
      borderColor = '#2251B8';
      break;
  }

  return (
    <div
      className="flex items-center justify-center w-5 h-5 rounded-full border-2 text-[10px] font-bold bg-black"
      style={{ borderColor: borderColor, color: color, boxShadow: `0 0 4px ${color}40` }}
    >
      {label}
    </div>
  );
};

const DRSIcon = ({ active }: { active: boolean }) => {
  return (
    <div
      className={`
        px-1 py-0.5 rounded border text-[9px] font-black tracking-tighter transition-all duration-200
        ${active
          ? 'bg-green-500 text-black border-green-500 shadow-[0_0_8px_rgba(72,187,120,0.8)] scale-110'
          : 'bg-transparent text-muted-foreground/30 border-muted-foreground/20'
        }
      `}
    >
      DRS
    </div>
  );
};

export const Leaderboard = ({ drivers, onDriverSelect, selectedDriver, driverColors }: LeaderboardProps) => {

  const getDriverColor = (code: string) => {
    if (driverColors && driverColors[code]) {
      const [r, g, b] = driverColors[code];
      return `rgb(${r}, ${g}, ${b})`;
    }
    return 'white';
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="px-3 py-2 border-b border-border/50 bg-secondary/30">
        <div className="grid grid-cols-[24px_4px_40px_1fr_30px_24px] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          <span className="text-center">Pos</span>
          <span></span>
          <span>Code</span>
          <span>Gap</span>
          <span className="text-center">DRS</span>
          <span className="text-center">Tyre</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {drivers.map((driver, index) => {
          const isSelected = selectedDriver === driver.abbreviation;
          const driverColor = getDriverColor(driver.abbreviation);

          return (
            <button
              key={driver.abbreviation}
              onClick={() => onDriverSelect(driver.abbreviation)}
              className={`
                w-full grid grid-cols-[24px_4px_40px_1fr_30px_24px] gap-2 items-center px-3 py-2 rounded-lg mx-1
                transition-all duration-200 border border-transparent
                ${isSelected
                  ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md'
                  : 'hover:bg-white/5 active:scale-[0.98]'}
              `}
            >
              {/* Position */}
              <span className={`text-right font-mono text-sm leading-none ${index < 3 ? 'text-primary drop-shadow-[0_0_5px_rgba(0,180,255,0.5)]' : 'text-foreground'}`}>
                {driver.position}
              </span>

              {/* Team Color Bar */}
              <div
                className="h-full w-1 rounded-full shadow-[0_0_4px_currentColor]"
                style={{ backgroundColor: driverColor, color: driverColor }}
              />

              {/* Driver Code */}
              <span className="font-bold text-sm tracking-tight text-left text-foreground">
                {driver.abbreviation}
              </span>

              {/* Gap (Placeholder for now) */}
              <span className="text-right font-mono text-xs text-muted-foreground">
                {/* +{index * 1.5}s */}
              </span>

              {/* DRS Icon */}
              <div className="flex justify-center">
                <DRSIcon active={driver.drs >= 10} />
              </div>

              {/* Tyre Icon */}
              <div className="flex justify-center">
                <TyreIcon compound={driver.tyre} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
