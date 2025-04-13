import React, { useState } from 'react';

const WeatherForm = ({ token, onSuccess }) => {
    const [city, setCity] = useState(''); // State to manage city input 
    const [loading, setLoading] = useState(false); // State to manage loading status 
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default from submission
        setLoading(true); // Set loading to true
        setError(null); // Reset error state

        try {
            const response = await fetch('http://localhost:8000/weather/store', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ city }), // Send city as form data
            });

            if (!response.ok) throw new Error('Failed to fetch weather data');

            const data = await response.json(); // Parse the response as JSON
            setCity(''); // Reset city input
            onSuccess(); // Call the onSuccess callback to refresh data
        }
        catch (err) {
            setError(err.message); // Set error message
        }
        finally {
            setLoading(false); // Set loading to false
        }
        
    };
    
    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Storing...' : 'Store Weather Data'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
};

export default WeatherForm; // Export the component
