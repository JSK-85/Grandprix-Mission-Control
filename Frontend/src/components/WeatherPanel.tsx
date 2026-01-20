import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';
import { WeatherData } from '@/data/mockData';

interface WeatherPanelProps {
  weather: WeatherData;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const WeatherPanel = ({ weather }: WeatherPanelProps) => {
  const windDirVal = parseFloat(weather.windDirection);
  const showDegrees = !isNaN(windDirVal);
  const windDirDisplay = showDegrees
    ? `${windDirVal.toFixed(2)}° (${getWindDirection(windDirVal)})`
    : weather.windDirection;

  return (
    <div className="glass-panel p-4 space-y-3">
      <h3 className="font-semibold text-foreground text-sm">Weather</h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Thermometer className="w-4 h-4 text-primary" />
          <span>Track: {weather.trackTemp}°C</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Thermometer className="w-4 h-4 text-accent" />
          <span>Air: {weather.airTemp}°C</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span>Humidity: {Number(weather.humidity).toFixed(1)}%</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Wind className="w-4 h-4" />
          <span>Wind: {Number(weather.windSpeed).toFixed(2)} km/h {windDirDisplay}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <CloudRain className="w-4 h-4" />
          <span>Rain: {weather.rain}</span>
        </div>
      </div>
    </div>
  );
};
