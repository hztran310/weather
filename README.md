# ☀️ WeatherVerse

WeatherVerse is a full-stack weather forecasting app that allows users to search for live weather data, store their favorite cities, and receive personalized horoscope insights based on their zodiac sign.


## ⚙️ Prerequisites

- Python 3.8+
- Node.js + npm
- A terminal with bash support (e.g., macOS/Linux/WSL)
- FastAPI and required packages (`requirements.txt` or virtualenv)
- OpenWeather API key (already included in the backend)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hztran310/weatherverse.git
cd weatherverse
```

🧠 Backend Setup (FastAPI)
📍Navigate to backend directory and run:
```bash 
chmod +x run.sh
./run.sh
```
This will start your FastAPI backend on http://localhost:8000.

💻 Frontend Setup (React)
📍Navigate to frontend folder:
```bash
cd weather-frontend
npm install
npm run dev
```
This will run your frontend on http://localhost:5173.

📦 Features
🌦 Live weather search with OpenWeather API

❤️ Save favorite cities and see real-time data

🔮 Daily horoscope based on user's birthday

🗺 Map and chart visualizations

🔐 JWT Authentication (Login & Register)

🛠 Built With
Frontend: React, Vite, Recharts, Leaflet, React Router

Backend: FastAPI, SQLAlchemy, JWT Auth

API: OpenWeatherMap, Horoscope Proxy
