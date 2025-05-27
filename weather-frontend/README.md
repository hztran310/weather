# 🌤️ WeatherVerse

**WeatherVerse** is a full-stack weather application that allows users to:
- 🔍 Search for real-time weather by city
- 📦 Store favorite cities
- 📋 View stored cities with current weather updates
- 🌙 Get personalized horoscope & mood insights based on birthday
- 🧭 Navigate using a smart auto-hiding sidebar

---

## ✨ Features

- 🔐 **JWT Auth**: Login and register securely
- 🌍 **City Search**: Get live weather data via OpenWeather API
- 💾 **Store Cities**: Save favorite locations
- 🧠 **Horoscope & Zodiac**: Personalized based on user's birthday
- 📊 **Data Visualization**: Compare temperature, wind, and rain
- 🗺️ **Map Integration**: View city on map
- 📚 **Auto-Hiding Sidebar**: Minimalist navigation drawer

---

## 🛠️ Built With

### Frontend
- **React** (Vite)
- **React Router DOM**
- **React Icons**
- **Leaflet.js** (for maps)
- **tz-lookup** (for timezone handling)

### Backend
- **FastAPI**
- **SQLAlchemy** (with PostgreSQL or SQLite)
- **JWT Auth** (OAuth2 + Bearer Token)
- **CORS** (enabled for frontend communication)

---

## 🚀 Setup Instructions

### 🔧 Backend (FastAPI)

1. **Clone the repo**:
   ```bash
   git clone https://github.com/yourusername/weatherverse.git
   cd weatherverse/backend
