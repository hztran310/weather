import React, { useState, useEffect } from "react";
import WeatherList from "./WeatherList";
import WeatherChart from "./WeatherChart";
import LoginForm from "./LoginForm";
import WeatherForm from "./WeatherForm";

function App() {
    const [token, setToken] = useState("");
    const [weatherData, setWeatherData] = useState([]);

    const fetchData = () => {
        fetch("http://localhost:8000/weather/my_data", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setWeatherData(data))
            .catch((err) => console.error("Error fetching weather:", err));
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    return (
        <div>
            {!token ? (
                <LoginForm setToken={setToken} />
            ) : (
                <div>
                    <WeatherForm token={token} onSuccess={fetchData} />
                    <WeatherList token={token} weatherData={weatherData} setWeatherData={setWeatherData}/>
                    <WeatherChart weatherData={weatherData} />
                </div>
            )}
        </div>
    );
}

export default App;
