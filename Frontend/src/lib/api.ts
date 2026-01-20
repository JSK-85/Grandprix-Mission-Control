export interface TelemetryFrame {
    t: number;
    lap: number;
    telemetry: {
        x: number;
        y: number;
        dist: number;
        rel_dist: number;
        speed: number;
        gear: number;
        throttle: number;
        brake: number;
        drs: number;
    };
}

export interface WeatherFrame {
    track_temp: number;
    air_temp: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number; // or string if your backend returns string, but f1_data seems to return number/interp
    rain_state: string;
}

export interface FrameData {
    t: number;
    lap: number;
    drivers: Record<string, DriverFrameData>; // driver code -> data
    weather?: WeatherFrame;
}

export interface DriverFrameData {
    x: number;
    y: number;
    dist: number;
    lap: number;
    rel_dist: number;
    tyre: number; // compound int
    position: number;
    speed: number;
    gear: number;
    drs: number;
    throttle: number;
    brake: number;
    on_track?: boolean;
}

export interface RaceDataResponse {
    frames: FrameData[];
    driver_colors: Record<string, [number, number, number]>; // RGB tuples
    track_statuses: any[];
    total_laps: number;
    drs_zones: any[];
    max_speed: number;
    min_speed: number;
    track_layout: { X: number; Y: number; DRS?: number }[];
}

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchRaceData = async (year: number, round: number, sessionType: string): Promise<RaceDataResponse> => {
    const response = await fetch(`${API_BASE_URL}/race/${year}/${round}/${sessionType}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch race data: ${response.statusText}`);
    }
    return response.json();
};

export const fetchRounds = async (year: number) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${year}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch rounds: ${response.statusText}`);
    }
    return response.json();
}
