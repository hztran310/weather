import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Change if your backend URL is different

export const fetchWeatherData = async (city, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/weather?city=${city}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};
