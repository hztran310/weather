import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import Register from "./Register";
import WeatherSearch from "./WeatherSearch";

function App() {
    const [token, setToken] = useState("");
    const [activeTab, setActiveTab] = useState("login");

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/weather/my_data", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => console.log(data)) // or setWeatherData(data)
                .catch((err) => console.error("Error fetching weather:", err));
        }
    }, [token]);

    const renderForm = () => {
        if (activeTab === "login") {
            return <LoginForm setToken={setToken} activeTab={activeTab} setActiveTab={setActiveTab} />;
        } else {
            return <Register onRegister={() => setActiveTab("login")} activeTab={activeTab} setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div>
            {!token ? renderForm() : <WeatherSearch token={token} onStoreSuccess={() => {}} />}
        </div>
    );
}

export default App;
