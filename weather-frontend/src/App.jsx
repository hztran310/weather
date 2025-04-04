import { useState } from "react";
import { fetchWeatherData } from "./api";

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [token, setToken] = useState(""); // Store the token here

    const handleFetchWeather = async () => {
        if (!token) {
            alert("Please enter your token!");
            return;
        }
        const data = await fetchWeatherData(city, token);
        setWeather(data);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Weather App</h1>
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={handleFetchWeather}>Get Weather</button>

            {weather && (
                <div style={{ marginTop: "20px" }}>
                    <h2>{weather.city}</h2>
                    <p>Temperature: {weather.temperature}°C</p>
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Wind Speed: {weather.wind_speed} m/s</p>
                </div>
            )}
        </div>
    );
}

export default App;
