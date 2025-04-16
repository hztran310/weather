import React, { useState } from "react";
import "./WeatherSearch.css";

const WeatherSearch = ({ token, onStoreSuccess }) => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    const checkWeather = async () => {
        setError("");
        try {
            const res = await fetch(`http://localhost:8000/weather?city=${city}`);
            const data = await res.json();

            if (data.error) {
                setError("City not found");
                setWeather(null);
            } else {
                setWeather(data);
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

    // Mock hourly data - in a real app, this would come from your API
    const hourlyForecast = [
        { time: "01:00", temp: 29 },
        { time: "02:00", temp: 26 },
        { time: "03:00", temp: 34 },
        { time: "04:00", temp: 36 },
        { time: "05:00", temp: 24 },
    ];

    return (
        <div className={`weather-container ${weather ? "active" : ""}`}>
            <div className="search-box">
                <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button onClick={checkWeather}>Check Weather</button>
            </div>
    
            {error && <p className="error-message">{error}</p>}
    
            <div className="weather-info">
                {weather && (
                    <>
                        <div className="weather-header">
                            <div className="weather-date">{formatDate()}</div>
                        </div>

                        <div className="weather-main">
                        <div className="weather-snippet">
                            <div className="weather-top">
                                <div className="weather-location-time">London 10:35 AM</div>
                                <div className="weather-temp">13.61°</div>
                            </div>

                            <div className="weather-bottom">
                                <div className="weather-description">
                                    fxdcgvhbjknmlsadfgnjugjhn  qweegrhtyju
                                </div>
                                <div className="weather-highlow">
                                    H:16.61°  L:8.61°
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="weather-details">
                            <div className="weather-detail-item">
                                <span className="detail-label">Forecast</span>
                                <span className="detail-value">Partly cloudy</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Precipitation</span>
                                <span className="detail-value">21%</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Feels like</span>
                                <span className="detail-value">{weather.temperature + 13}°</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Wind</span>
                                <span className="detail-value">{weather.wind_speed} km/h WSW</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Humidity</span>
                                <span className="detail-value">{weather.humidity}%</span>
                            </div>
                            <div className="weather-detail-item">
                                <span className="detail-label">Sunset</span>
                                <span className="detail-value">6:45 PM</span>
                            </div>
                        </div>

                        <div className="weather-hourly">
                            {hourlyForecast.map((hour, index) => (
                                <div key={index} className="hourly-item">
                                    <span className="hourly-time">{hour.time}</span>
                                    <span className="hourly-temp">{hour.temp}°</span>
                                </div>
                            ))}
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
        </div>
    );    
};

export default WeatherSearch;