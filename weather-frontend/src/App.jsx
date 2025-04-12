import React, { useState, useEffect } from "react";
import WeatherList from "./WeatherList";
import WeatherChart from "./WeatherChart";


function App() {
    const [token, setToken] = useState(""); // Store JWT token
    const [weatherData, setWeatherData] = useState([]); // Store weather data


    useEffect(() => {
        if (token) {
            // Fetch weather data from the backend
            fetch("http://127.0.0.1:8000/weather/my_data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch weather data");
                    }
                    return response.json();
                })
                .then((data) => setWeatherData(data))
                .catch((error) => console.error(error));
        }
    }, [token]);

    return (
        <div>
            <h1>Weather Dashboard</h1>
            <input
                type="text"
                placeholder="Enter your token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            {token && (
                <>
                    <WeatherList token={token} />
                    <WeatherChart weatherData={weatherData} />
                </>
            )}
        </div>
    );
}

export default App;