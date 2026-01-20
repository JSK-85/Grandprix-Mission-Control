from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
import os

# Add Backend directory to sys.path to import from src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from src.f1_data import load_session, get_race_telemetry, enable_cache, list_rounds

app = FastAPI()

# Enable Gzip compression for large JSON payloads
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

enable_cache()

@app.get("/")
def read_root():
    return {"message": "F1 Race Replay API is running. Go to /docs for API documentation."}

@app.get("/api/sessions/{year}")
def get_rounds(year: int):
    # This is a placeholder. list_rounds prints to stdout. 
    # We might need to implement a function that returns the list or scrape fastf1 directly here.
    # For now, let's use fastf1 directly to get the schedule
    import fastf1
    schedule = fastf1.get_event_schedule(year)
    rounds = []
    for _, row in schedule.iterrows():
        # Build available sessions list
        available_sessions = []
        for i in range(1, 6):
            sess_name = row.get(f"Session{i}")
            if sess_name:
                available_sessions.append(sess_name)
        
        # FastF1 returns 0 for testing rounds usually, filter strict rounds if needed.
        # But keeping pre-season is fine if we handle it.
        # Frontend expects 'round' as number.

        rounds.append({
            "year": year,
            "round": int(row["RoundNumber"]),
            "eventName": row["EventName"],
            "country": row["Country"],
            "countryCode": "XX", # TODO: Map country name to ISO code for flags
            "date": row["EventDate"].strftime("%Y-%m-%d") if hasattr(row["EventDate"], 'strftime') else str(row["EventDate"]),
            "sessions": available_sessions
        })
    return rounds

@app.get("/api/race/{year}/{round_num}/{session_type}")
def get_race_data(year: int, round_num: int, session_type: str = 'R'):
    try:
        session = load_session(year, round_num, session_type)
        telemetry_data = get_race_telemetry(session, session_type)
        
        # We need to serialize this data for JSON response. 
        # The telemetry_data contains numpy arrays which need to be converted to lists.
        
        # Get example lap for track layout (logic from main.py)
        example_lap_data = None
        try:
            # Try to get qualifying lap first for better DRS zones
            quasi_session = load_session(year, round_num, 'Q')
            if quasi_session is not None and len(quasi_session.laps) > 0:
                fastest_quali = quasi_session.laps.pick_fastest()
                if fastest_quali is not None:
                     example_lap_data = fastest_quali.get_telemetry()
        except:
            pass
            
        if example_lap_data is None:
             # Fallback to fastest race lap
             fastest_lap = session.laps.pick_fastest()
             if fastest_lap is not None:
                 example_lap_data = fastest_lap.get_telemetry()
        
        track_layout = []
        if example_lap_data is not None and not example_lap_data.empty:
            # Extract X, Y, and maybe DRS status for the track map
            # resample or just take points. For map we can probably just take every Nth point to save bandwidth
            # but let's send all for now or a simplified version
            columns = ['X', 'Y']
            if 'DRS' in example_lap_data.columns:
                columns.append('DRS')
            track_layout = example_lap_data[columns].to_dict('records')

        # Helper to convert numpy types
        def convert_numpy(obj):
            import numpy as np
            if isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, (np.bool_, np.bool)):
                return bool(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, dict):
                return {k: convert_numpy(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                 return [convert_numpy(i) for i in obj]
            return obj

        response_data = telemetry_data
        
        # DOWN-SAMPLE frames for web performance
        # Original is 25 FPS.
        # [::25] = 1 FPS (Too choppy, cars go off track)
        # [::1] = 25 FPS (~650MB payload, crashes browser)
        # [::5] = 5 FPS (~130MB payload, manageable and 5x smoother)
        if 'frames' in response_data:
            # Downsample to 5 FPS to reduce payload size (was causing crashes at 25 FPS)
            response_data['frames'] = response_data['frames'][::5]


        response_data['track_layout'] = track_layout

        return convert_numpy(response_data)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use string import string for reload support
    uvicorn.run("src.api.api_server:app", host="0.0.0.0", port=8000, reload=True)
