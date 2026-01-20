# GrandPrix Mission Control 🏎️ 🏁

**GrandPrix Mission Control** is a high-fidelity Formula 1 race replay and telemetry dashboard. It provides a "Mission Control" style interface for visualizing race data, driver positions, and detailed telemetry in real-time.

## 🚀 Key Features

-   **Interactive Race Replay:** Watch races unfold with real-time driver positions on a geographically accurate track map.
-   **Mission Control Dashboard:** A comprehensive UI featuring a dedicated sidebar, top bar for session info, and a split-view data layout.
-   **Advanced Telemetry:** Detailed oscilloscope-style telemetry views (Speed, Throttle, Brake, Gear) and tyre degradation monitoring.
-   **Live Leaderboard:** Real-time driver positions, intervals, tyre compounds, and status indicators (OUT, PIT).
-   **Environmental Intelligence:** Weather radar with wind vectors and track condition overlays.
-   **Multi-Session Support:** Replay Races, Qualifying, and Sprint sessions with historical data support (2018-2025).

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React 18 (Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS, shadcn/ui
-   **State Management:** React Query, React Context
-   **Visualization:** Custom Canvas/SVG renderers for track maps

### Backend
-   **Runtime:** Python 3.11+
-   **Data Source:** FastF1 API
-   **Processing:** NumPy for high-performance data manipulation
-   **Server:** FastAPI / Custom Python Serve (as configured)

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python 3.11+

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/grandprix-mission-control.git
    cd grandprix-mission-control
    ```

2.  **Backend Setup**
    ```bash
    cd Backend
    python3 -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**
    ```bash
    cd ../Frontend
    npm install
    ```

### Usage

**Running the Backend & Replay Engine:**
From the `Backend` directory:
```bash
python main.py
```
*Follow the CLI prompts or use `--gui` for the graphical launcher.*

**Running the Frontend Dashboard:**
From the `Frontend` directory:
```bash
npm run dev
```

## 📂 Project Structure

```
grandprix-mission-control/
├── Backend/               # Python telemetry engine and API
│   ├── src/               # Core logic for data processing and replay
│   ├── main.py            # Entry point
│   └── requirements.txt   # Python dependencies
├── Frontend/              # React dashboard application
│   ├── src/               # Components, pages, and hooks
│   └── package.json       # Node dependencies
├── computed_data/         # Cached telemetry files
└── README.md              # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This project is not affiliated with Formula 1, FIA, or any related teams. All data is sourced for educational and non-commercial purposes.
