import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, FastForward, Rewind, SkipBack, SkipForward } from 'lucide-react';

import DashboardLayout from './layout/DashboardLayout';
import { Leaderboard } from './Leaderboard';
import { TrackMap } from './TrackMap';
import { TelemetryOscilloscope } from './telemetry/TelemetryOscilloscope';
import { WeatherRadar } from './weather/WeatherRadar';

import { RaceSession } from '@/data/mockData';
import { fetchRaceData, RaceDataResponse } from '@/lib/api';
import { Slider } from '@/components/ui/slider';

interface RaceReplayProps {
  session: RaceSession;
  sessionType: string;
  onBack: () => void;
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const RaceReplay = ({ session, sessionType, onBack }: RaceReplayProps) => {
  const [raceData, setRaceData] = useState<RaceDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<string>('VER');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let typeCode = 'R';
        if (sessionType.includes('Qualifying')) typeCode = 'Q';
        else if (sessionType.includes('Sprint')) typeCode = 'S';

        const data = await fetchRaceData(session.year, session.round, typeCode);
        setRaceData(data);

        if (data.frames.length > 0) {
          const firstFrameDrivers = Object.keys(data.frames[0].drivers);
          if (firstFrameDrivers.length > 0) setSelectedDriver(firstFrameDrivers[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [session, sessionType]);

  // Timer Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;

      if (isPlaying && raceData && raceData.frames.length > 1) {
        // Calculate FPS dynamically from the first two frames to ensure accuracy
        // Default to 1 FPS if we can't determine (e.g. only 1 frame)
        const t0 = raceData.frames[0].t;
        const t1 = raceData.frames[1].t;
        const dataFPS = (t1 > t0) ? 1 / (t1 - t0) : 1;

        const framesToAdd = (deltaTime / 1000) * dataFPS * playbackSpeed;

        setCurrentFrameIndex(prev => {
          let next = prev + framesToAdd;
          if (next >= raceData.frames.length - 1) {
            setIsPlaying(false);
            return raceData.frames.length - 1;
          }
          return next;
        });
      }

      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, playbackSpeed, raceData]);

  const handlePlayPause = useCallback(() => setIsPlaying((prev) => !prev), []);
  const handlePrevLap = useCallback(() => setCurrentFrameIndex(prev => Math.max(0, prev - 25 * 60)), []);
  const handleNextLap = useCallback(() => setCurrentFrameIndex(prev => Math.min(raceData?.frames.length || 0, prev + 25 * 60)), [raceData]);
  const handleSliderChange = useCallback((value: number[]) => {
    if (!raceData) return;
    const frameIndex = Math.floor((value[0] / 100) * raceData.frames.length);
    setCurrentFrameIndex(frameIndex);
  }, [raceData]);


  if (isLoading) return <div className="h-screen flex items-center justify-center text-primary font-mono animate-pulse">SYSTEM INITIALIZING...</div>;
  if (error) return <div className="h-screen flex flex-col items-center justify-center space-y-4"><p className="text-destructive font-mono">CRITICAL ERROR: {error}</p><Button onClick={onBack} variant="destructive">ABORT</Button></div>;
  if (!raceData || raceData.frames.length === 0) return <div className="h-screen flex flex-col items-center justify-center"><p className="text-muted-foreground">NO TELEMETRY DATA</p><Button onClick={onBack} className="mt-4">RETURN</Button></div>;

  // Helper for Linear Interpolation
  const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

  // Get Interpolated Driver Positions
  const getInterpolatedDrivers = (frames: any[], index: number) => {
    const floorIndex = Math.floor(index);
    const ceilIndex = Math.min(Math.ceil(index), frames.length - 1);

    if (floorIndex === ceilIndex) return frames[floorIndex].drivers;

    const frame1 = frames[floorIndex];
    const frame2 = frames[ceilIndex];
    const t = index - floorIndex;

    const interpolatedDrivers: Record<string, any> = {};

    Object.keys(frame1.drivers).forEach(driver => {
      if (frame2.drivers[driver]) {
        interpolatedDrivers[driver] = {
          ...frame1.drivers[driver], // Copy other props like color, etc.
          x: lerp(frame1.drivers[driver].x, frame2.drivers[driver].x, t),
          y: lerp(frame1.drivers[driver].y, frame2.drivers[driver].y, t),
          // We can interpolate speed etc if needed, but X/Y is most important for visual smoothness
        };
      } else {
        // Fallback if driver missing in next frame (rare)
        interpolatedDrivers[driver] = frame1.drivers[driver];
      }
    });

    return interpolatedDrivers;
  };

  // Current State
  const safeIndex = Math.floor(currentFrameIndex);
  const currentFrame = raceData.frames[Math.min(safeIndex, raceData.frames.length - 1)];
  const currentLap = currentFrame.lap;
  const totalLaps = raceData.total_laps;
  const progress = (safeIndex / raceData.frames.length) * 100;

  // Interpolated Drivers for Smooth Map
  const smoothDrivers = getInterpolatedDrivers(raceData.frames, currentFrameIndex);

  // Prepare Driver List (for Leaderboard - can keep using integer frame for order stability)
  const driversList = Object.entries(currentFrame.drivers).map(([code, d]) => ({
    abbreviation: code,
    teamColor: 'white',
    ...d
  })).sort((a, b) => a.position - b.position);

  // Weather extraction
  const weather = currentFrame.weather ? {
    trackTemp: currentFrame.weather.track_temp,
    airTemp: currentFrame.weather.air_temp,
    humidity: currentFrame.weather.humidity,
    windSpeed: currentFrame.weather.wind_speed,
    windDirection: currentFrame.weather.wind_direction,
    rain: currentFrame.weather.rain_state
  } : { trackTemp: 0, airTemp: 0, humidity: 0, windSpeed: 0, windDirection: 0, rain: 'DRY' };

  // Sidebar Content
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden glass-sidebar">

      {/* Top: Exit & Session Info (Fixed) */}
      <div className="flex-shrink-0 p-4 space-y-4 border-b border-white/5 bg-white/5">
        <Button onClick={onBack} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/10 h-8 px-2 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Exit
        </Button>

        <div className="space-y-1 pl-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Session</div>
          <div className="text-xs font-mono text-white truncate drop-shadow-md" title={`${session.year} ${session.eventName}`}>
            {session.year} {session.eventName}
          </div>
        </div>
      </div>

      {/* Middle: Leaderboard (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <Leaderboard
          drivers={driversList}
          onDriverSelect={setSelectedDriver}
          selectedDriver={selectedDriver}
          driverColors={raceData.driver_colors}
        />
      </div>

      {/* Bottom: Playback Controls (Fixed) */}
      <div className="flex-shrink-0 p-4 space-y-4 bg-black/20 border-t border-white/5 backdrop-blur-md">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Playback</div>

        {/* Play/Pause & Seek */}
        <div className="flex items-center justify-between gap-2 p-1 rounded-xl bg-black/20 border border-white/5 shadow-inner">
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-95" onClick={() => setCurrentFrameIndex(0)}><SkipBack className="h-3 w-3" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-95" onClick={handlePrevLap}><Rewind className="h-3 w-3" /></Button>
          <Button size="icon" className="h-10 w-10 bg-primary/90 text-black hover:bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] rounded-xl transition-all active:scale-95" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="fill-current h-4 w-4" /> : <Play className="fill-current h-4 w-4 ml-0.5" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-95" onClick={handleNextLap}><FastForward className="h-3 w-3" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-95" onClick={() => setCurrentFrameIndex(raceData?.frames.length || 0)}><SkipForward className="h-3 w-3" /></Button>
        </div>

        {/* Speed Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono p-1 px-2 rounded-lg bg-white/5 border border-white/5">
            <span className="text-muted-foreground">SPEED</span>
            <span className="text-primary font-bold shadow-glow">x{playbackSpeed}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 4, 8].map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`text-[9px] py-1.5 rounded-md transition-all duration-200 border ${playbackSpeed === s ? 'bg-primary/90 border-primary text-black font-bold shadow-[0_0_10px_rgba(20,184,166,0.4)]' : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/20'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebar={sidebarContent}>
      <div className="grid grid-rows-[auto_1fr_250px] h-full gap-6 p-2">

        {/* Header Bar */}
        <div className="glass-panel flex items-center justify-between p-4 rounded-2xl">
          <div className="flex items-center gap-6">
            <div className={`px-4 py-1.5 font-black text-sm rounded-lg shadow-lg tracking-wider ${sessionType === 'R' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-purple-500 text-white'}`}>
              {sessionType === 'R' ? 'RACE' : 'QUALIFYING'}
            </div>
            <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              LAP {currentLap} <span className="text-white/30 text-lg font-medium">/ {totalLaps}</span>
            </div>
            {/* Timeline Slider embedded in header for space efficiency */}
            <div className="w-[400px] px-4 opacity-80 hover:opacity-100 transition-opacity">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSliderChange}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="font-mono text-3xl font-bold text-primary tabular-nums tracking-wider drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]">
            {formatTime(currentFrame.t)}
          </div>
        </div>

        {/* Middle Row: Track Map */}
        <div className="relative glass-panel rounded-2xl overflow-hidden min-h-0 shadow-2xl">
          <div className="absolute inset-0 z-0 bg-black/40">
            <TrackMap
              drivers={smoothDrivers}
              trackLayout={raceData.track_layout}
              driverColors={raceData.driver_colors}
              selectedDriver={selectedDriver}
              weather={weather}
            />
          </div>



          {/* Overlay Info (Bottom Right) */}
          <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
            <div className="text-[10px] font-bold tracking-widest text-white/40 text-right mb-1 uppercase">Selected Driver</div>
            <div className="text-5xl font-black text-white text-right tracking-tighter" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
              {selectedDriver}
            </div>
          </div>
        </div>

        {/* Bottom Row: Telemetry + Weather */}
        <div className="grid grid-cols-[1fr_300px] gap-6">
          {/* Telemetry Oscilloscope */}
          <div className="glass-panel rounded-2xl overflow-hidden p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Telemetry Live Feed</div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tel-speed))]" /><span className="text-[9px] text-white/40">SPD</span></div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tel-throttle))]" /><span className="text-[9px] text-white/40">THR</span></div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tel-brake))]" /><span className="text-[9px] text-white/40">BRK</span></div>
              </div>
            </div>
            <div className="flex-1 min-h-0 relative bg-black/20 rounded-xl border border-white/5">
              <TelemetryOscilloscope
                data={raceData.frames}
                currentIndex={safeIndex}
                selectedDriver={selectedDriver}
                windowSize={200}
              />
            </div>
          </div>

          {/* Weather Radar */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <WeatherRadar
              weather={weather}
              trackLayout={raceData.track_layout}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
