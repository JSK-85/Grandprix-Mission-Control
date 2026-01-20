export interface Driver {
  position: number;
  abbreviation: string;
  name: string;
  team: string;
  teamColor: string;
  interval: string;
  gapToLeader: string;
  tyreCompound: 'soft' | 'medium' | 'hard' | 'inter' | 'wet';
  tyreAge: number;
  pitStops: number;
  hasFastestLap: boolean;
  trackPosition: { x: number; y: number };
}

export interface RaceSession {
  year: number;
  round: number;
  eventName: string;
  country: string;
  countryCode: string;
  date: string;
  sessions: string[];
}

export interface WeatherData {
  trackTemp: number;
  airTemp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rain: string;
}

export const mockDrivers: Driver[] = [
  { position: 1, abbreviation: 'VER', name: 'Max Verstappen', team: 'Red Bull', teamColor: 'team-redbull', interval: 'LEADER', gapToLeader: '-', tyreCompound: 'medium', tyreAge: 12, pitStops: 1, hasFastestLap: false, trackPosition: { x: 78, y: 20 } },
  { position: 2, abbreviation: 'RUS', name: 'George Russell', team: 'Mercedes', teamColor: 'team-mercedes', interval: '+2.341', gapToLeader: '+2.341', tyreCompound: 'medium', tyreAge: 10, pitStops: 1, hasFastestLap: false, trackPosition: { x: 75, y: 25 } },
  { position: 3, abbreviation: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', teamColor: 'team-ferrari', interval: '+0.892', gapToLeader: '+3.233', tyreCompound: 'hard', tyreAge: 15, pitStops: 1, hasFastestLap: true, trackPosition: { x: 72, y: 30 } },
  { position: 4, abbreviation: 'PER', name: 'Sergio Perez', team: 'Red Bull', teamColor: 'team-redbull', interval: '+1.245', gapToLeader: '+4.478', tyreCompound: 'medium', tyreAge: 12, pitStops: 1, hasFastestLap: false, trackPosition: { x: 68, y: 35 } },
  { position: 5, abbreviation: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', teamColor: 'team-ferrari', interval: '+2.103', gapToLeader: '+6.581', tyreCompound: 'hard', tyreAge: 15, pitStops: 1, hasFastestLap: false, trackPosition: { x: 62, y: 40 } },
  { position: 6, abbreviation: 'NOR', name: 'Lando Norris', team: 'McLaren', teamColor: 'team-mclaren', interval: '+1.567', gapToLeader: '+8.148', tyreCompound: 'medium', tyreAge: 8, pitStops: 1, hasFastestLap: false, trackPosition: { x: 55, y: 48 } },
  { position: 7, abbreviation: 'PIA', name: 'Oscar Piastri', team: 'McLaren', teamColor: 'team-mclaren', interval: '+0.234', gapToLeader: '+8.382', tyreCompound: 'medium', tyreAge: 8, pitStops: 1, hasFastestLap: false, trackPosition: { x: 52, y: 50 } },
  { position: 8, abbreviation: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', teamColor: 'team-aston', interval: '+3.456', gapToLeader: '+11.838', tyreCompound: 'hard', tyreAge: 20, pitStops: 1, hasFastestLap: false, trackPosition: { x: 45, y: 55 } },
  { position: 9, abbreviation: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', teamColor: 'team-mercedes', interval: '+0.789', gapToLeader: '+12.627', tyreCompound: 'medium', tyreAge: 10, pitStops: 2, hasFastestLap: false, trackPosition: { x: 40, y: 58 } },
  { position: 10, abbreviation: 'TSU', name: 'Yuki Tsunoda', team: 'AlphaTauri', teamColor: 'team-alphatauri', interval: '+4.123', gapToLeader: '+16.750', tyreCompound: 'medium', tyreAge: 18, pitStops: 1, hasFastestLap: false, trackPosition: { x: 35, y: 62 } },
  { position: 11, abbreviation: 'ALB', name: 'Alex Albon', team: 'Williams', teamColor: 'team-williams', interval: '+1.234', gapToLeader: '+17.984', tyreCompound: 'hard', tyreAge: 22, pitStops: 1, hasFastestLap: false, trackPosition: { x: 32, y: 68 } },
  { position: 12, abbreviation: 'MAG', name: 'Kevin Magnussen', team: 'Haas', teamColor: 'team-haas', interval: '+2.567', gapToLeader: '+20.551', tyreCompound: 'medium', tyreAge: 16, pitStops: 1, hasFastestLap: false, trackPosition: { x: 28, y: 72 } },
  { position: 13, abbreviation: 'ZHO', name: 'Guanyu Zhou', team: 'Alfa Romeo', teamColor: 'team-alfa', interval: '+0.456', gapToLeader: '+21.007', tyreCompound: 'hard', tyreAge: 25, pitStops: 1, hasFastestLap: false, trackPosition: { x: 25, y: 75 } },
  { position: 14, abbreviation: 'SAR', name: 'Logan Sargeant', team: 'Williams', teamColor: 'team-williams', interval: '+3.789', gapToLeader: '+24.796', tyreCompound: 'medium', tyreAge: 14, pitStops: 2, hasFastestLap: false, trackPosition: { x: 22, y: 78 } },
  { position: 15, abbreviation: 'RIC', name: 'Daniel Ricciardo', team: 'AlphaTauri', teamColor: 'team-alphatauri', interval: '+1.012', gapToLeader: '+25.808', tyreCompound: 'soft', tyreAge: 5, pitStops: 2, hasFastestLap: false, trackPosition: { x: 18, y: 80 } },
  { position: 16, abbreviation: 'OCO', name: 'Esteban Ocon', team: 'Alpine', teamColor: 'team-alpine', interval: '+2.345', gapToLeader: '+28.153', tyreCompound: 'medium', tyreAge: 12, pitStops: 1, hasFastestLap: false, trackPosition: { x: 15, y: 82 } },
  { position: 17, abbreviation: 'GAS', name: 'Pierre Gasly', team: 'Alpine', teamColor: 'team-alpine', interval: '+0.678', gapToLeader: '+28.831', tyreCompound: 'medium', tyreAge: 12, pitStops: 1, hasFastestLap: false, trackPosition: { x: 12, y: 84 } },
  { position: 18, abbreviation: 'BOT', name: 'Valtteri Bottas', team: 'Alfa Romeo', teamColor: 'team-alfa', interval: '+4.901', gapToLeader: '+33.732', tyreCompound: 'hard', tyreAge: 28, pitStops: 1, hasFastestLap: false, trackPosition: { x: 10, y: 86 } },
  { position: 19, abbreviation: 'STR', name: 'Lance Stroll', team: 'Aston Martin', teamColor: 'team-aston', interval: '+2.234', gapToLeader: '+35.966', tyreCompound: 'medium', tyreAge: 10, pitStops: 2, hasFastestLap: false, trackPosition: { x: 8, y: 88 } },
  { position: 20, abbreviation: 'HUL', name: 'Nico Hulkenberg', team: 'Haas', teamColor: 'team-haas', interval: '+5.567', gapToLeader: '+41.533', tyreCompound: 'hard', tyreAge: 30, pitStops: 1, hasFastestLap: false, trackPosition: { x: 5, y: 90 } },
];

export const mockRaceSessions: RaceSession[] = [
  { year: 2024, round: 1, eventName: 'Bahrain Grand Prix', country: 'Bahrain', countryCode: 'BH', date: '2024-03-02', sessions: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'] },
  { year: 2024, round: 2, eventName: 'Saudi Arabian Grand Prix', country: 'Saudi Arabia', countryCode: 'SA', date: '2024-03-09', sessions: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'] },
  { year: 2024, round: 3, eventName: 'Australian Grand Prix', country: 'Australia', countryCode: 'AU', date: '2024-03-24', sessions: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'] },
  { year: 2024, round: 4, eventName: 'Japanese Grand Prix', country: 'Japan', countryCode: 'JP', date: '2024-04-07', sessions: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'] },
  { year: 2024, round: 5, eventName: 'Chinese Grand Prix', country: 'China', countryCode: 'CN', date: '2024-04-21', sessions: ['FP1', 'Sprint Qualifying', 'Sprint', 'Qualifying', 'Race'] },
  { year: 2024, round: 6, eventName: 'Miami Grand Prix', country: 'United States', countryCode: 'US', date: '2024-05-05', sessions: ['FP1', 'Sprint Qualifying', 'Sprint', 'Qualifying', 'Race'] },
  { year: 2024, round: 7, eventName: 'Emilia Romagna Grand Prix', country: 'Italy', countryCode: 'IT', date: '2024-05-19', sessions: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'] },
  { year: 2024, round: 8, eventName: 'Monaco Grand Prix', country: 'Monaco', countryCode: 'MC', date: '2024-05-26', sessions: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'] },
];

export const mockWeather: WeatherData = {
  trackTemp: 23.5,
  airTemp: 18.3,
  humidity: 50,
  windSpeed: 1.3,
  windDirection: 'SE',
  rain: 'DRY',
};

export const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
