# Frontend Requirements for F1 Race Replay

## 1. Project Overview
The goal is to provide a comprehensive user interface for visualizing Formula 1 race data. The interface should allow users to select specific race sessions and view a replay of the race with telemetry and timing data.

## 2. Functional Requirements

### 2.1 Session Selection
- **Year Selection**: Dropdown or slider to select the championship year (e.g., 2018-2025).
- **Round Selection**: Interactive list or grid displaying all rounds (Grand Prix) for the selected year.
    - Must show: Round Number, Event Name, Country/Flag, Date.
- **Session Type Selection**: Ability to choose between different session types for a selected round:
    - Practice (FP1, FP2, FP3)
    - Qualifying
    - Sprint Qualifying (if applicable)
    - Sprint (if applicable)
    - Race
- **Search/Filter**: (Optional) Ability to search for a specific Grand Prix by name or country.

### 2.2 Data Loading & Management
- **Asynchronous Loading**: Data fetching (via FastF1) must happen in the background to keep the UI responsive.
- **Progress Indication**: Clear visual feedback (spinner, progress bar) during data download and processing.
- **Caching Indicators**: Visual indication if data is already cached locally versus needing a download.

### 2.3 Race Replay Visualization
- **Track Map**:
    - 2D representation of the circuit geometry.
    - Dynamic rotation (track should fit screen or rotate to heading).
    - Highlights for sectors or DRS zones.
- **Driver Representation**:
    - Markers (dots/arrows) for each driver.
    - Color-coded by team livery.
    - Smooth interpolation of positions between data points (if data frequency < 60Hz).
- **Heads-Up Display (HUD)**:
    - Toggleable visibility.
    - **Telemetry Overlay** (for focused driver):
        - Speed (km/h or mph).
        - Gear.
        - RPM.
        - Throttle/Brake traces.
        - DRS status (Active/Inactive).

### 2.4 Timing and Scoring (Leaderboard)
- **Live Leaderboard**:
    - Current Position.
    - Driver Name/Abbreviation.
    - Interval (Gap to car ahead).
    - Gap to Leader.
    - Tyre Compound (Soft, Medium, Hard, Inter, Wet).
    - Tyre Age (Laps).
    - Pit Stop Count/Status.
- **Fastest Lap Indicator**: Highlight the driver with the current fastest lap.
- **Status Flags**: Visual indicators for Track Status (Green Flag, Yellow Flag, VSC, Safety Car, Red Flag).

### 2.5 Playback Controls
- **Transport Controls**: Play, Pause, Stop buttons.
- **Timeline/Scrubber**: Interactive slider to jump to any point in the session.
- **Playback Speed**: Adjustable speed multipliers (e.g., 1x, 2x, 5x, 10x, 20x, Real-time).
- **Lap Navigation**: "Previous Lap" and "Next Lap" buttons for quick navigation.

## 3. User Interface (UI) & Experience (UX)

### 3.1 Design Aesthetics
- **Theme**: Dark mode is preferred for data-heavy and media applications to reduce eye strain and make colors pop.
- **Responsiveness**: Layout should adapt to different screen sizes (if web-based) or window resizing (desktop).
- **Typography**: Clean, legible, monospaced fonts for numerical data (timing).

### 3.2 Layout Strategy
- **Dashboard Layout**:
    - **Sidebar/Panel**: Leaderboard and Timing data.
    - **Main Area**: Track Map visualization.
    - **Bottom Bar**: Playback controls and Timeline.
    - **Overlay**: Telemetry data (optional: can be floating or fixed).

## 4. Technical Requirements
- **Performance**:
    - Visualization must maintain 60 FPS for smooth motion.
    - Efficient handling of large telemetry datasets (potentially filtering/downsampling for display).
- **Data Integration**:
    - Direct integration with the Python backend (`src.f1_data`, `fastf1`).
    - Error handling for failed data downloads or API rate limits.
