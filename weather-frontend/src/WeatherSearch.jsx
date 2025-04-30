import React, { useState } from "react";
import "./WeatherSearch.css";
import tzLookup from 'tz-lookup';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MapWithPan from './MapWithPan';
import { getWeatherIcon } from "./iconMapper";
import CompareWeather from './CompareWeather.jsx';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});



const WeatherSearch = ({ token, onStoreSuccess }) => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [mapCenter, setMapCenter] = useState(null);

    const API_KEY = "b02beb5f6754f998a9d86759f9d5c3cf";

    const fetchSugesstion = async (query) => {
        if (!query) return setSuggestions([]);
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
        const data = await response.json();
        setSuggestions(data);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCity(value);
        fetchSugesstion(value);
    }

    const handleSuggestionClick = async (suggestions) => {
        const formatted = `${suggestions.name}, ${suggestions.country}`;
        setCity(formatted);
        setSuggestions([]);
        await checkWeather();
        setCity(""); // Clear the input after search
    }
    

    const checkWeather = async () => {
        setError("");
        try {
            const res = await fetch(`http://localhost:8000/weather?city=${city}`);
            const data = await res.json();

            if (data.error) {
                setError("City not found");
                setWeather(null);
                setMapCenter(null);
            } else {
                setWeather(data);
                setMapCenter([data.lat, data.lon]);
            }
        } catch (err) {
            setError("An error occurred while fetching weather data");
        }
    };

    const storeWeather = async () => {
        try {
            const res = await fetch("http://localhost:8000/weather/store", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ city }),
            });

            if (res.ok) {
                onStoreSuccess();
                alert("Weather data stored successfully");
            } else {
                alert("Failed to store weather data");
            }
        } catch (err) {
            alert("An error occurred while storing weather data");
        }
    };

    // Format date as "DD MON YY DAYNAME" (e.g., "04 MAR 24 MONDAY")
    const formatDate = (dateString) => {
        const date = new Date(dateString || new Date());
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);
        const dayName = days[date.getDay()];
        
        return `${day} ${month} ${year} ${dayName}`;
    };

    // Format time as "H:MM AM/PM" (e.g., "9:11 PM")
    const formatTime = (dateString) => {
        const date = new Date(dateString || new Date());
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${ampm}`;
    };

    const formatSunsetTime = (timestamp, lat, lon) => {
        const timezone = tzLookup(lat, lon);
        const date = new Date(timestamp * 1000);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timezone,
        };
        return date.toLocaleTimeString('en-US', options);
    };
    
    
    return (
        <div className={`weather-container ${weather ? "active" : ""}`}>
            <div className="search-box">
                <input
                    value={city}
                    onChange={handleInputChange}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            await checkWeather();
                            setCity("");  // Clear input after search
                            setSuggestions([]);
                        }
                    }}                    
                    placeholder="Enter city name"
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((s, idx) => (
                            <li key={idx} 
                            onClick={() => {
                                handleSuggestionClick(s);
                            }}>
                                {s.name}, {s.state ? `${s.state}, ` : ""}{s.country}
                                </li>
                        ))}
                    </ul>
                )}
            </div>
    
            {error && <p className="error-message">{error}</p>}
    
            <div className="weather-info">
                {weather && (
                    <>
                        <div className="weather-header">
                            <div className="weather-date">{formatDate(weather.timestamp)}</div>
                        </div>

                        <div className="weather-main">
                            <div className="weather-snippet">
                            <div className="weather-top">
                                <div className="weather-location-time">
                                        {weather.city
                                            .split(" ")
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")} {formatTime(weather.timestamp)}
                                </div>                        
                                <div className="icon-temp-wrapper">
                                    <div className="weather-forecast-icon">
                                    <img src={getWeatherIcon(weather.description)} alt="weather icon" />
                                    </div>
                                    <div className="temp-forecast-group">
                                    <div className="weather-temp">{weather.temperature}°</div>
                                    <div className="weather-forecast">
                                        {weather.description
                                        .split(" ")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}
                                    </div>
                                    </div>
                                </div>
                            </div>


                                <div className="weather-bottom">
                                    <div className="weather-description">
                                        {getWeatherQuote(weather.description)}
                                    </div>
                                    <div className="weather-highlow">
                                        H:{weather.temp_max || weather.temperature + 2}° L:{weather.temp_min || weather.temperature - 2}°
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="weather-details">
                            <div className="weather-detail-item">
                                <span className="detail-label">Forecast</span>
                                <span className="detail-value">{weather.description
                                            .split(" ")
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Precipitation</span>
                                <span className="detail-value">{weather.precipitation || "0"}%</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Feels like</span>
                                <span className="detail-value">{weather.feels_like || weather.temperature}°</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Wind</span>
                                <span className="detail-value">{weather.wind_speed} km/h</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Humidity</span>
                                <span className="detail-value">{weather.humidity}%</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Sunset</span>
                                {/* <span className="detail-value">{formatSunsetTime(weather.sunset, weather.timezone_offset)|| "6:45 PM"}</span> */}
                                <span className="detail-value">
                                    {weather.sunset && weather.lat && weather.lon
                                        ? formatSunsetTime(weather.sunset, weather.lat, weather.lon)
                                        : "N/A"}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={storeWeather}
                            style={{
                                marginTop: '20px',
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#4a6fa5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            Store Weather Data
                        </button>
                    </>
                )}
            </div>

            {weather && weather.lat && weather.lon && (
                <div className="map-container">
                    <MapContainer
                        center={[weather.lat, weather.lon]}
                        zoom={10}
                        style={{ width: "100%", height: "100%", borderRadius: "20px" }}
                        scrollWheelZoom={false}
                    >
                        <MapWithPan
                            lat={weather.lat}
                            lon={weather.lon}
                            city={weather.city}
                            description={weather.description}
                        />
                    </MapContainer>
                </div>
            )}


            {weather && (
                <div className="chart-container">
                    <CompareWeather />
                </div>
            )}

            <div className="weather-detail-container">
                <p>Weather Details</p>
            </div>
        </div>
    );    
};

const getWeatherQuote = (description) => {
    const quotes = {
        "clear sky": "Pure bliss.",
        "few clouds": "Clouds come and go, just like worries.",
        "scattered clouds": "Every cloud has a silver lining.",
        "broken clouds": "Through the clouds, the sun still shines.",
        "shower rain": "A little rain never hurt anyone.",
        "rain": "Let the rain wash away all your worries.",
        "thunderstorm": "Even the storm has its purpose.",
        "snow": "Let it snow, let it snow, let it snow!",
        "mist": "Mist makes everything look like a dream.",
        "fog": "The fog will lift, and you'll see the way.",
        "drizzle": "A little drizzle can make the day feel fresh.",
    };

    // Fallback to a default quote if description is not in the map
    return quotes[description.toLowerCase()] || "Embrace the weather, it’s your moment.";
};

export default WeatherSearch;