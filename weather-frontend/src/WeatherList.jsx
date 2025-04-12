import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners"; // Import a spinner component

const WeatherList = ({ token, weatherData, setWeatherData }) => {
    const [loading, setLoading] = React.useState(true); // State to manage loading status

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
            .then((data) => {
                setTimeout(() => { // Artificial delay for loading spinner
                    setWeatherData(data); // Update state with the fetched data
                    setLoading(false); // Set loading to false after data is fetched
                }, 1000); // 1-second delay
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, [token]); // Dependency array to re-fetch data when token changes

    return (
        <div>
            <h2>My Weather Data</h2>
            {loading ? (
                <ClipLoader color="#36d7b7" loading={loading} size={50} /> // Show spinner while loading
            ) : (
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
            )}
        </div>
    );
};

export default WeatherList;