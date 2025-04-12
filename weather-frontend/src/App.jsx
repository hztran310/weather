import React, { useState, useEffect } from "react";
import WeatherList from "./WeatherList";
import WeatherChart from "./WeatherChart";
import LoginForm from "./LoginForm";


function App() {
    const [token, setToken] = useState(""); // Store JWT token
    const [weatherData, setWeatherData] = useState([]); // Store weather data


    return (
        <div>
            <h1>Weather App</h1>
            {!token ? (
                <LoginForm setToken={setToken} />
            ) : (
                <div>
                    <WeatherList 
                        token={token} 
                        weatherData={weatherData}
                        setWeatherData={setWeatherData} />
                    <WeatherChart weatherData={weatherData} />
                </div>
            )}
        </div>
    );


};

export default App;