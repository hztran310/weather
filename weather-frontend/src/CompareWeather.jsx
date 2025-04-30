import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CompareWeather.css';


const API_KEY = "b02beb5f6754f998a9d86759f9d5c3cf";

const CompareWeather = () => {
    const [cities, setCities] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [activeTab, setActiveTab] = useState('temperature'); // default tab

    const handleFetch = async () => {
        const cityList = cities.split(",").map(c => c.trim());
        const results = [];
    
        for (const city of cityList) {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
                const data = await res.json();
    
                if (data.main) {
                    const rain = data.rain?.["1h"] || 0;
                    const snow = data.snow?.["1h"] || 0;
                    const precipitation = rain + snow;
    
                    results.push({
                        city: data.name,
                        temperature: data.main.temp,
                        humidity: data.main.humidity,
                        wind: data.wind.speed,
                        precipitation: precipitation
                    });
                }
            } catch (err) {
                console.error("Error fetching weather for", city, err);
            }
        }
        setWeatherData(results);
    };
    

    const renderChart = () => {
        const units = {
            temperature: "°C",
            precipitation: "mm",
            wind: "km/h",
        };
    
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weatherData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis tickFormatter={(value) => `${value} ${units[activeTab]}`} />
                    <Tooltip formatter={(value) => `${value} ${units[activeTab]}`} />
                    <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                    <Bar dataKey={activeTab} fill="#4a6fa5" />
                </BarChart>
            </ResponsiveContainer>
        );
    };
    

    return (
        <div className="compare-weather-container">
            <h2 style={{ color: '#3D365C' }}>Compare Cities' Weather</h2>           
            <div className="input-container">
                <input
                    type="text"
                    className="input-field"
                    value={cities}
                    onChange={(e) => setCities(e.target.value)}
                    placeholder="e.g. London, Tokyo, Denver"
                />
                <button className="fetch-button" onClick={handleFetch}>Compare</button>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'temperature' ? 'active' : ''}`}
                        onClick={() => setActiveTab('temperature')}
                        >
                        🌡 Tempt
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'precipitation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('precipitation')}
                        >
                        🌧 Precipitation
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'wind' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wind')}
                        >
                        💨 Wind
                    </button>
                </div>
                </div>



            {weatherData.length > 0 && renderChart()}
        </div>
    );
};

export default CompareWeather;
