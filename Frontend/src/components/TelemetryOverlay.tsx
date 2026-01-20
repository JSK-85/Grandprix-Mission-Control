import { Driver } from '@/data/mockData';

interface TelemetryOverlayProps {
  driver: Driver | null;
  speed: number;
  gear: number;
  rpm: number;
  throttle: number;
  brake: number;
  drsActive: boolean;
}

export const TelemetryOverlay = ({
  driver,
  speed,
  gear,
  rpm,
  throttle,
  brake,
  drsActive,
}: TelemetryOverlayProps) => {
  if (!driver) return null;

  return (
    <div className="glass-panel p-4 space-y-4 min-w-[200px]">
      {/* Driver Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <span className="font-bold text-lg">{driver.position}</span>
        </div>
        <div>
          <p className="font-bold text-foreground">{driver.abbreviation}</p>
          <p className="text-xs text-muted-foreground">{driver.team}</p>
        </div>
      </div>

      {/* Speed & Gear */}
      <div className="flex items-end gap-4">
        <div>
          <p className="text-3xl font-mono font-bold text-foreground">
            {speed}
          </p>
          <p className="text-xs text-muted-foreground">km/h</p>
        </div>

      </div>

      {/* RPM Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>RPM</span>
          <span>{rpm.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent via-accent to-primary transition-all duration-75"
            style={{ width: `${(rpm / 15000) * 100}%` }}
          />
        </div>
      </div>

      {/* Throttle & Brake */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Throttle</span>
            <span>{throttle}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-75"
              style={{ width: `${throttle}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Brake</span>
            <span>{brake}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-75"
              style={{ width: `${brake}%` }}
            />
          </div>
        </div>
      </div>

      {/* DRS Status */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">DRS</span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${drsActive
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-muted-foreground'
            }`}
        >
          {drsActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>
    </div>
  );
};
