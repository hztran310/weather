import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import Register from "./Register";
import WeatherSearch from "./WeatherSearch";

function App() {
    const [token, setToken] = useState("");
    const [activeTab, setActiveTab] = useState("login");
    const [birthday, setBirthday] = useState(null);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                setBirthday(data.birthday);
            })
            .catch((err) => console.error("Error fetching user info:", err));
        }
    }, [token]);


    const renderForm = () => {
        return activeTab === "login" ? (
            <LoginForm
                setToken={setToken}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        ) : (
            <Register
                onRegisterSuccess={() => setActiveTab("login")}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        );
    };

    return (
        <div>
            {!token ? renderForm() : (
                <WeatherSearch token={token} onStoreSuccess={() => {}} birthday={birthday} />
            )}
        </div>
    );
}

export default App;
