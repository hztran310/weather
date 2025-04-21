import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";

const WeatherChart = ({ weatherData }) => {
    const [visibleMetrics, setVisibleMetrics] = useState({
        temperature: true,
        humidity: true,
        wind_speed: true,
    });

    const toggleMetric = (metric) => {
        setVisibleMetrics((prev) => ({
            ...prev,
            [metric]: !prev[metric],
        }));
    };

    return (
        <div>
            <h2>📊 Weather Data Overview</h2>
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={visibleMetrics.temperature}
                        onChange={() => toggleMetric("temperature")}
                    />
                    Temperature
                </label>{" "}
                <label>
                    <input
                        type="checkbox"
                        checked={visibleMetrics.humidity}
                        onChange={() => toggleMetric("humidity")}
                    />
                    Humidity
                </label>{" "}
                <label>
                    <input
                        type="checkbox"
                        checked={visibleMetrics.wind_speed}
                        onChange={() => toggleMetric("wind_speed")}
                    />
                    Wind Speed
                </label>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city">
                        <Label value="City" position="insideBottom" offset={-5} />
                    </XAxis>
                    <YAxis>
                        <Label
                            value="Value"
                            angle={-90}
                            position="insideLeft"
                            offset={-5}
                        />
                    </YAxis>
                    <Tooltip formatter={(value, name) => [`${value}`, name.replace('_', ' ')]} />
                    <Legend verticalAlign="top" height={36} />
                    {visibleMetrics.temperature && (
                        <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#8884d8"
                            activeDot={{ r: 6 }}
                        />
                    )}
                    {visibleMetrics.humidity && (
                        <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#82ca9d"
                            activeDot={{ r: 6 }}
                        />
                    )}
                    {visibleMetrics.wind_speed && (
                        <Line
                            type="monotone"
                            dataKey="wind_speed"
                            stroke="#ffc658"
                            activeDot={{ r: 6 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeatherChart;
