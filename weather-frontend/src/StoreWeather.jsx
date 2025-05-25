import React, { useEffect, useState } from "react";
import { getWeatherIcon } from "./iconMapper"; 
import "./StoredWeather.css"; 

const StoredWeather = ({ token }) => {
  const [storedData, setStoredData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/weather/my_data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stored weather data");
        return res.json();
      })
      .then((data) => {
        console.log("Stored Weather Data:", data);
        setStoredData(data);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="stored-weather">
      <h2>📦 Stored Cities</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="stored-weather-list">
        {storedData.length === 0 ? (
          <p>No cities stored yet.</p>
        ) : (
          storedData.map((entry, index) => (
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
              <div className="weather-info">
                <div className="city-name">{entry.city || "Unknown City"}</div>
                <div className="temp">
                  {entry.temperature !== null && entry.temperature !== undefined
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
        )}
      </div>
    </div>
  );
};

export default StoredWeather;
