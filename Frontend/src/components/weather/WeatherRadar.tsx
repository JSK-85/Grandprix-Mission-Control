import { useMemo } from 'react';
import { ArrowUp } from 'lucide-react';

interface WeatherRadarProps {
    weather: {
        trackTemp: number;
        airTemp: number;
        humidity: number;
        windSpeed: number;
        windDirection: number | string;
        rain: string;
    };
    trackLayout?: { X: number; Y: number }[];
}

// Track coordinates standard (Lat, Lon)
// Hardcoding Bahrain for demo as requested if not available
const TRACK_COORDINATES: Record<string, { lat: number, lon: number, zoom: number }> = {
    'Sakhir': { lat: 26.0325, lon: 50.5106, zoom: 14 }
};

export const WeatherRadar = ({ weather, trackLayout }: WeatherRadarProps) => {
    const windDir = Number(weather.windDirection) || 0;

    // Track overlay simulation
    const trackPath = useMemo(() => {
        if (!trackLayout || trackLayout.length === 0) return '';
        // Normalize track to fit in radar (circle 100x100)
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        trackLayout.forEach(p => {
            minX = Math.min(minX, p.X);
            maxX = Math.max(maxX, p.X);
            minY = Math.min(minY, p.Y);
            maxY = Math.max(maxY, p.Y);
        });

        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        const range = Math.max(rangeX, rangeY);
        // Reduce scale slightly to ensure it fits well within radar
        const scale = 120 / range;

        return 'M ' + trackLayout.map(p => {
            // Need to rotate/flip? Usually telemetry is X=East, Y=North.
            // SVG Y is down.
            const x = (p.X - minX - rangeX / 2) * scale + 100;
            const y = 200 - ((p.Y - minY - rangeY / 2) * scale + 100); // Flip Y for SVG
            return `${x} ${y}`;
        }).join(' ') + ' Z';
    }, [trackLayout]);

    const isBahrain = (trackLayout && trackLayout.length > 500);
    const bgImageStyle = isBahrain
        ? {
            backgroundImage: `url("/assets/bahrain_satellite.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.1) brightness(0.9)'
        }
        : {
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E"), radial-gradient(circle at center, #1a2a1a 0%, #000000 100%)`,
            backgroundSize: 'cover'
        };

    return (
        <div className="h-full flex flex-col relative bg-black border border-white/10 rounded-lg overflow-hidden group">

            {/* Satellite Background Layer */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full transition-all duration-500"
                    style={bgImageStyle}
                />
                {/* Overlay to darken it slightly for legibility, lighter for Bahrain to see details */}
                <div className={`absolute inset-0 ${isBahrain ? 'bg-black/10' : 'bg-black/40'}`} />
            </div>

            {/* Coordinates Overlay */}
            <div className="absolute top-8 right-2 z-10 flex flex-col items-end text-[8px] font-mono text-muted-foreground/50 leading-tight">
                <span>SAT: 26.0325°N</span>
                <span>LON: 50.5106°E</span>
                <span>ALT: 12m</span>
            </div>

            {/* Header */}
            <div className="relative z-10 bg-black/40 px-2 py-1 text-[10px] uppercase font-bold text-muted-foreground flex justify-between border-b border-white/5 backdrop-blur-sm">
                <span>Env. Intelligence</span>
                <span className={weather.rain === 'RAINING' ? 'text-blue-400 animate-pulse' : 'text-green-500'}>
                    {weather.rain || 'DRY'}
                </span>
            </div>

            {/* Radar Visual - ONLY SHOW IF NOT BAHRAIN (or generic mode) */}
            <div className={`flex-1 relative flex items-center justify-center p-4 z-10 ${isBahrain ? 'hidden' : ''}`}>
                <svg viewBox="0 0 200 200" className="w-full h-full text-[hsl(var(--radar-grid))]">
                    {/* Radar Grid - Concentric Rings */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />

                    {/* Crosshairs */}
                    <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />

                    {/* Sweeping Radar Line */}
                    <line x1="100" y1="100" x2="100" y2="10" stroke="hsl(var(--radar-blip))" strokeWidth="2" strokeOpacity="0.8" className="origin-center animate-radar-sweep shadow-[0_0_10px_currentColor]">
                    </line>

                    {/* Track Overlay (Neon Polyline) */}
                    {trackPath && (
                        <path
                            d={trackPath}
                            fill="none"
                            stroke="hsl(var(--radar-overlay))"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_6px_hsl(var(--radar-overlay))]"
                        />
                    )}
                </svg>
            </div>

            {/* Live Stats Overlay - Always visible */}
            <div className="absolute bottom-2 right-2 text-right space-y-1 bg-black/50 p-1.5 rounded border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-end gap-2 text-xs font-mono">
                    <span className="text-muted-foreground text-[9px]">AIR</span>
                    <span className="text-white font-bold">{Math.round(weather.airTemp)}°C</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-xs font-mono">
                    <span className="text-muted-foreground text-[9px]">TRK</span>
                    <span className="text-white font-bold">{Math.round(weather.trackTemp)}°C</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-xs font-mono">
                    <span className="text-muted-foreground text-[9px]">HUM</span>
                    <span className="text-white font-bold">{Math.round(weather.humidity)}%</span>
                </div>
            </div>

            {/* Wind Vector - Top Left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 bg-black/50 p-1.5 rounded border border-white/5 backdrop-blur-sm">
                <span className="text-[9px] text-muted-foreground font-bold">WIND VECTOR</span>
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center bg-black/50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[hsl(var(--radar-blip))] opacity-10"></div>
                        <ArrowUp
                            size={16}
                            className="text-[hsl(var(--radar-blip))]"
                            style={{ transform: `rotate(${windDir}deg)` }}
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-mono font-bold text-white">{weather.windSpeed.toFixed(1)}</span>
                        <span className="text-[8px] text-muted-foreground">m/s</span>
                    </div>
                </div>
            </div>
        </div>

    );
};
