import { Play, Pause, SkipBack, SkipForward, Minus, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentLap: number;
  totalLaps: number;
  progress: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onPrevLap: () => void;
  onNextLap: () => void;
  onProgressChange: (value: number[]) => void;
  onSpeedChange: (delta: number) => void;
}

const SPEED_OPTIONS = [1, 2, 4, 8, 16, 32, 64];

export const PlaybackControls = ({
  isPlaying,
  currentLap,
  totalLaps,
  progress,
  playbackSpeed,
  onPlayPause,
  onPrevLap,
  onNextLap,
  onProgressChange,
  onSpeedChange,
}: PlaybackControlsProps) => {
  return (
    <div className="glass-panel px-6 py-4">
      <div className="flex items-center gap-6">
        {/* Timeline */}
        <div className="flex-1">
          <Slider
            value={[progress]}
            onValueChange={onProgressChange}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
        </div>

        {/* Transport Controls */}
        <div className="flex items-center gap-2">
          <button onClick={onPrevLap} className="control-btn">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onPlayPause} 
            className="control-btn bg-primary hover:bg-primary/90 text-primary-foreground p-3"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button onClick={onNextLap} className="control-btn">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1">
          <button 
            onClick={() => onSpeedChange(-1)} 
            className="p-1 hover:bg-muted rounded transition-colors"
            disabled={playbackSpeed <= SPEED_OPTIONS[0]}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="font-mono text-sm w-12 text-center">
            {playbackSpeed}.0x
          </span>
          
          <button 
            onClick={() => onSpeedChange(1)} 
            className="p-1 hover:bg-muted rounded transition-colors"
            disabled={playbackSpeed >= SPEED_OPTIONS[SPEED_OPTIONS.length - 1]}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
