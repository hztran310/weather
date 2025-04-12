import React from "react"; // Import React
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const WeatherChart = ({ weatherData }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                <Line type="monotone" dataKey="wind_speed" stroke="#ffc658" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default WeatherChart; // Export the component