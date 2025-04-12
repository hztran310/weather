import React, { useEffect } from "react";

const WeatherList = ({ token, weatherData, setWeatherData }) => {
    useEffect(() => {
        // Fetch weather data from the API
        fetch("http://localhost:8000/weather/my_data", {
            method: "GET", // HTTP method
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json()) // Parse the response as JSON
            .then((data) => setWeatherData(data)) // Update state with the fetched data
            .catch((error) => console.error("Error fetching data:", error));
    }, [token]); // Dependency array to re-fetch data when token changes

    return (
        <div>
            <h2>My Weather Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Wind Speed</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(weatherData) &&
                        weatherData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.city}</td>
                                <td>{data.temperature}</td>
                                <td>{data.humidity}</td>
                                <td>{data.wind_speed}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeatherList;