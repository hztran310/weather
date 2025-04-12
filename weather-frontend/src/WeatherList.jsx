import React, { useEffect, useState } from 'react'; // Import React and hooks

const WeatherList = ({ token }) => 
{
    const [weatherData, weatherDataSet] = useState([]); // State to hold weather data\

    useEffect(() => 
    {
        // Fetch weather data from the API
        fetch("http://localhost:8000/weather/my_data", 
        {
            method: "GET", // HTTP method
            // Add headers for authorization and content type
            headers: 
            {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response=> response.json()) // Parse the response as JSON
        .then(data=> weatherDataSet(data)) // Update state with the fetched data
        .catch(error=> console.error("Error fetching data:", error));
    }, [token]); // Dependency array to re-fetch data when token changes

    return (
        <div>
            <h2> My Weather Data </h2>
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
                    {weatherData.map((data, index) => (
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

export default WeatherList; // Export the component

