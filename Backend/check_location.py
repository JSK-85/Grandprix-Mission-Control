import fastf1
import collections

# Check if we can get location data
try:
    session = fastf1.get_session(2024, 1, 'R')
    session.load(telemetry=False, weather=False, messages=False)
    print(f"Event: {session.event.EventName}")
    print(f"Location: {getattr(session.event, 'Location', 'Not Found')}")
    # fastf1 3.x might use 'Location' string or separate lat/lon?
    # Actually, session.event is a pandas Series.
    print(session.event)
except Exception as e:
    print(e)
