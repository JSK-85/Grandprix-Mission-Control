import { DriverFrameData } from '@/lib/api';
import { Compass, Wind, ChevronUp, ChevronDown } from 'lucide-react';
import { useRef, useEffect, useState, useMemo } from 'react';

interface TrackMapProps {
  drivers: Record<string, DriverFrameData>;
  trackLayout: { X: number; Y: number; DRS?: number }[];
  driverColors: Record<string, [number, number, number]>;
  selectedDriver?: string;
  weather?: { windSpeed: number; windDirection: number; }; // Add weather prop
}

// Convert RGB tuple to CSS string
const getDriverColor = (colorTuple?: [number, number, number]) => {
  if (!colorTuple) return '#FFFFFF';
  return `rgb(${colorTuple[0]}, ${colorTuple[1]}, ${colorTuple[2]})`;
};

const GearDisplay = ({ gear }: { gear: number }) => {
  const [prevGear, setPrevGear] = useState(gear);
  const [shiftDir, setShiftDir] = useState<'up' | 'down' | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gear !== prevGear) {
      setShiftDir(gear > prevGear ? 'up' : 'down');
      setPrevGear(gear);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShiftDir(null), 500);
    }
  }, [gear, prevGear]);

  return (
    <div className="absolute bottom-6 left-6 z-30 flex items-center gap-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative">
        <div className="text-6xl font-bold bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white font-mono shadow-2xl flex items-center justify-center min-w-[80px]" style={{ fontFamily: '"Roboto Mono", monospace' }}>
          {gear === 0 ? 'N' : gear}
        </div>

        {/* Shift Indicators */}
        <div className={`absolute -right-8 top-1/2 -translate-y-1/2 transition-all duration-200 ${shiftDir === 'up' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <ChevronUp className="w-8 h-8 text-green-500 animate-pulse" strokeWidth={3} />
        </div>
        <div className={`absolute -right-8 top-1/2 -translate-y-1/2 transition-all duration-200 ${shiftDir === 'down' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <ChevronDown className="w-8 h-8 text-red-500 animate-pulse" strokeWidth={3} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-xs text-muted-foreground font-bold tracking-widest uppercase">Gear</div>
        <div className="h-1 w-12 bg-white/20 rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-primary/80 transition-all duration-300" style={{ width: `${(gear / 8) * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

export const TrackMap = ({ drivers, trackLayout, driverColors, selectedDriver, weather }: TrackMapProps) => {
  // Ensure drivers prop change triggers re-render
  // drivers is a new object reference every frame from RaceReplay

  // Calculate track bounds and scaling factors
  const viewBox = useMemo(() => {
    if (!trackLayout || trackLayout.length === 0) return { minX: 0, minY: 0, width: 100, height: 100, path: '' };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    // Create SVG Path string
    let path = 'M ';

    trackLayout.forEach((point, i) => {
      // SVG Coordinate system is Y-down, but data is likely Y-up (Cartesian).
      // Inverting Y fixes the chirality (CW vs ACW).
      const pX = point.X;
      const pY = -point.Y; // Invert Y

      minX = Math.min(minX, pX);
      maxX = Math.max(maxX, pX);
      minY = Math.min(minY, pY);
      maxY = Math.max(maxY, pY);

      if (i === 0) {
        path += `${pX} ${pY}`;
      } else {
        path += ` L ${pX} ${pY}`;
      }
    });

    // Close the loop if it's a circuit (mostly yes)
    path += ' Z';

    // Add some padding
    const padding = Math.max(maxX - minX, maxY - minY) * 0.1;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
      path
    };
  }, [trackLayout]);

  // Generate DRS paths
  const drsPaths = useMemo(() => {
    if (!trackLayout || trackLayout.length < 2) return [];

    const paths = [];
    let currentPath = '';
    let isDrsActive = false;

    for (let i = 0; i < trackLayout.length; i++) {
      const point = trackLayout[i];
      // const nextPoint = trackLayout[i + 1]; // nextPoint unused

      // FastF1 DRS status: 10, 12, 14 are enabled states usually.
      const drsOn = (point.DRS || 0) >= 10;
      const pX = point.X;
      const pY = -point.Y;

      if (drsOn) {
        if (!currentPath) {
          currentPath = `M ${pX} ${pY}`;
        } else {
          currentPath += ` L ${pX} ${pY}`;
        }
      } else {
        if (currentPath) {
          paths.push(currentPath);
          currentPath = '';
        }
      }
    }
    // catch final path
    if (currentPath) paths.push(currentPath);
    return paths;
  }, [trackLayout]);


  // Calculate Start/Finish Line
  const startLine = useMemo(() => {
    if (!trackLayout || trackLayout.length < 2) return null;

    const p1 = trackLayout[0];
    const p2 = trackLayout[1]; // Use second point to get direction

    // Invert Y for points
    const p1X = p1.X;
    const p1Y = -p1.Y;
    const p2X = p2.X;
    const p2Y = -p2.Y;

    // Vector
    const dx = p2X - p1X;
    const dy = p2Y - p1Y;

    // Normalize
    const length = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / length;
    const ny = dy / length;

    // Perpendicular vector (-y, x)
    const px = -ny;
    const py = nx;

    // Width of line (slightly wider than track)
    const w = viewBox.width * 0.04;

    return {
      x1: p1X - px * w,
      y1: p1Y - py * w,
      x2: p1X + px * w,
      y2: p1Y + py * w
    };
  }, [trackLayout, viewBox]);

  // Wind Arrow Calculation
  const windRotation = weather?.windDirection || 0; // Degrees

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">

      {/* 1. Fake "Satellite" Background Texture */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          filter: 'contrast(150%) brightness(60%) sepia(20%) hue-rotate(180deg)',
          backgroundSize: '300px'
        }}
      />
      {/* Grid Overlay for technical feel */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />


      {/* 2. Map SVG */}
      <svg
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.8))' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Track Glow Background */}
        <path
          d={viewBox.path}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={viewBox.width * 0.06}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.1"
          style={{ filter: 'blur(8px)' }}
        />

        {/* DRS Zones - Highlighted segments */}
        {drsPaths.map((dPath, i) => (
          <path
            key={i}
            d={dPath}
            fill="none"
            stroke="hsl(var(--track-drs))"
            strokeWidth={viewBox.width * 0.045}
            strokeLinecap="butt"
            strokeLinejoin="round"
            opacity="0.6"
          />
        ))}

        {/* Track Outline (White/Bright) */}
        <path
          d={viewBox.path}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth={viewBox.width * 0.015}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
        />

        {/* Start/Finish Line */}
        {startLine && (
          <line
            x1={startLine.x1}
            y1={startLine.y1}
            x2={startLine.x2}
            y2={startLine.y2}
            stroke="hsl(var(--destructive))"
            strokeWidth={viewBox.width * 0.018}
          />
        )}

        {/* Driver Markers */}
        {Object.entries(drivers)
          .filter(([_, data]) => data.on_track !== false)
          .map(([code, data]) => {
            const isSelected = selectedDriver === code;
            const color = getDriverColor(driverColors[code]);
            const isLeader = data.position === 1;

            // Invert Y for drivers
            const dX = data.x;
            const dY = -data.y;

            return (
              <g key={code}>
                {/* Selection / Leader Glow */}
                {(isSelected || isLeader) && (
                  <circle
                    cx={dX}
                    cy={dY}
                    r={viewBox.width * 0.04}
                    fill={color}
                    opacity="0.3"
                    className="animate-pulse-slow"
                  />
                )}

                {/* Driver dot */}
                <circle
                  cx={dX}
                  cy={dY}
                  r={isSelected ? viewBox.width * 0.018 : viewBox.width * 0.012}
                  fill={color}
                  stroke={isSelected ? '#FFFFFF' : 'none'}
                  strokeWidth={isSelected ? viewBox.width * 0.003 : 0}
                  style={{
                    filter: `drop-shadow(0 0 ${isSelected ? '8px' : '2px'} ${color})`,
                  }}
                />

                {/* Labels */}
                {(isSelected || isLeader) && (
                  <g>
                    <text
                      x={dX}
                      y={dY - viewBox.width * 0.03}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={viewBox.width * 0.012}
                      fontWeight="bold"
                      fontFamily="Inter"
                      style={{
                        textShadow: '0 2px 4px black',
                        pointerEvents: 'none'
                      }}
                    >
                      {code}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>

      {/* 3. Gear Indicator (Overlay) */}
      {selectedDriver && drivers[selectedDriver] && (
        <GearDisplay gear={drivers[selectedDriver].gear} />
      )}

      {/* 4. Wind Direction Indicator (Overlay) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
        <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Wind</div>
        <div
          className="bg-secondary/50 rounded-full p-1 mb-1 transition-transform duration-1000 ease-in-out"
          style={{ transform: `rotate(${windRotation}deg)` }}
        >
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-primary"></div>
        </div>
        <div className="text-xs font-mono font-bold text-white">
          {weather?.windSpeed ? Math.round(weather.windSpeed) : 0} <span className="text-[9px] text-muted-foreground font-normal">m/s</span>
        </div>
      </div>
    </div>
  );
};
