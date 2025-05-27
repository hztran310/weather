import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import Register from "./Register";
import WeatherSearch from "./WeatherSearch";
import StoredWeather from "./StoredWeather"; 
import Sidebar from "./Sidebar";

function App() {
    const [token, setToken] = useState("");
    const [activeTab, setActiveTab] = useState("login");
    const [birthday, setBirthday] = useState(null);
    const [zodiac, setZodiac] = useState(null);
    const [horoscope, setHoroscope] = useState(null);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8000/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((user) => {
                    setBirthday(user.birthday);
                })
                .catch((err) => console.error("Failed to get user info:", err));
        }
    }, [token]);

    useEffect(() => {
        const getZodiacFromBirthday = (birthday) => {
            if (!birthday) return null;
            const [year, month, day] = birthday.split("-");
            const target = `${month}-${day}`;
            const zodiacSigns = [
                { sign: "Aries 𖧧", start: '03-21', end: '04-19' },
                { sign: "Taurus ♉︎⋆˙⟡", start: '04-20', end: '05-20' },
                { sign: "Gemini 𐦍", start: '05-21', end: '06-20' },
                { sign: "Cancer ⁺˚⋆♋︎₊⊹", start: '06-21', end: '07-22' },
                { sign: "Leo ♌︎ ☪︎", start: '07-23', end: '08-22' },
                { sign: "Virgo ♍︎⋆｡°✩", start: '08-23', end: '09-22' },
                { sign: "Libra ⚖︎", start: '09-23', end: '10-22' },
                { sign: "Scorpio ఌ︎", start: '10-23', end: '11-21' },
                { sign: "Sagittarius ♐︎", start: '11-22', end: '12-21' },
                { sign: "Capricorn ♑︎", start: '12-22', end: '01-19' },
                { sign: "Aquarius ♒︎", start: '01-20', end: '02-18' },
                { sign: "Pisces ♓︎", start: '02-19', end: '03-20' },
            ];
            for (const z of zodiacSigns) {
                if (z.start <= target && target <= z.end) return z;
            }
            return zodiacSigns.find(z => z.sign.includes("Capricorn"));
        };

        const fetchHoroscope = async () => {
            if (!birthday) return;
            const zodiacData = getZodiacFromBirthday(birthday);
            const signName = zodiacData.sign.split(" ")[0].toLowerCase();
            try {
                const res = await fetch(`http://localhost:3001/horoscope?sign=${signName}&day=TODAY`);
                const data = await res.json();
                setZodiac(zodiacData);
                setHoroscope(data.data.horoscope_data);
            } catch (err) {
                console.error("Failed to fetch horoscope:", err);
            }
        };

        if (birthday) fetchHoroscope();
    }, [birthday]);

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
        <Router>
                {token && <Sidebar />}
                    <div style={{ padding: "20px" }}>

                    <Routes>
                        <Route
                            path="/"
                            element={
                                !token ? renderForm() : (
                                    <WeatherSearch
                                        token={token}
                                        birthday={birthday}
                                        zodiac={zodiac}
                                        horoscope={horoscope}
                                        onStoreSuccess={() => {}}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/stored"
                            element={
                                token ? (
                                    <StoredWeather token={token} />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />
                    </Routes>
                </div>
        </Router>
    );
}

export default App;