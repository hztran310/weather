import React, { useEffect, useState } from "react";
import { getWeatherIcon } from "./iconMapper"; 
import "./StoredWeather.css"; 

const StoredWeather = ({ token }) => {
  const [storedCities, setStoredCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");

  // 1. Fetch list of stored cities
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/weather/my_data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stored cities");
        return res.json();
      })
      .then((data) => {
        setStoredCities(data);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  // 2. Fetch live weather data for each stored city
  useEffect(() => {
      const fetchWeatherForCities = async () => {
        const results = await Promise.all(
            storedCities.map(async ({ city }) => {
            try {
                const res = await fetch(`http://localhost:8000/weather?city=${encodeURIComponent(city)}`);
                const data = await res.json();
                return { ...data, city};
            } catch (err) {
                console.error("Error fetching for", city);
                return { city, error: "Failed to fetch weather data" };
            }
            })
        );
        setWeatherData(results);
        };


    if (storedCities.length > 0) {
      fetchWeatherForCities();
    }
  }, [storedCities]);

  return (
    <div className="stored-weather">
      <h2>📦 Stored Cities</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="stored-weather-list">
        {weatherData.length === 0 ? (
          <p>No cities stored or data loading...</p>
        ) : (
          weatherData.map((entry, index) => (
            !entry.city ? null : (
            <div className="stored-weather-card" key={index}>
              {entry.description ? (
                <img
                  src={getWeatherIcon(entry.description)}
                  alt={entry.description}
                  className="weather-icon"
                />
              ) : (
                <div className="weather-icon">❓</div>
              )}
              <div className="weather-info-summary">
                <div className="city-name">{formatCityName(entry.city)}</div>
                <div className="temp">
                  {entry.temperature !== undefined
                    ? `${entry.temperature}°C`
                    : "N/A"}
                </div>
                <div className="description">
                  {entry.description
                    ? entry.description
                        .split(" ")
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join(" ")
                    : "No description"}
                </div>
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

// Capitalizes each word in a city name string
const formatCityName = (name) =>
  name
    ? name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

export default StoredWeather;
