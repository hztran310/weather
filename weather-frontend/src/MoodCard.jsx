import React, { useEffect, useState } from 'react';
import './MoodCard.css';

const sampleZodiacs = [
  { sign: "Aries 𖧧" },
  { sign: "Taurus ♉︎⋆˙⟡" },
  { sign: "Gemini 𐦍" },
  { sign: "Cancer ⁺˚⋆♋︎₊⊹" },
  { sign: "Leo ♌︎ ☪︎ " },
  { sign: "Virgo ♍︎⋆｡°✩" },
  { sign: "Libra ⚖︎" },
  { sign: "Scorpio ఌ︎"},
  { sign: "Sagittarus ♐︎"},
  { sign: "Capricorn ♑︎"},
  { sign: "Aquarius ♒︎"},
  { sign: "Pisces ♓︎"}
];

const LuckyCard = () => {
  const [horoscope, setHoroscope] = useState(null);
  const [zodiac, setZodiac] = useState(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        const randomZodiac = sampleZodiacs[Math.floor(Math.random() * sampleZodiacs.length)];
        const signName = randomZodiac.sign.split(" ")[0].toLowerCase();
  
  
        const res = await fetch(`http://localhost:3001/horoscope?sign=${signName}&day=TODAY`);
        const data = await res.json();
  
        setZodiac(randomZodiac); 
        setHoroscope(data.data.horoscope_data);
      } catch (err) {
        console.error("Failed to fetch horoscope:", err);
      }
    };
  
    fetchHoroscope();
  }, []);
  
  return (
    <div className="lucky-card">
      <h3>✨ Daily Vibe</h3>

      {zodiac && (
        <div className="lucky-card-details">
          <p><strong>🌟 Zodiac:</strong> {zodiac.sign}</p>
        </div>
      )}

      {horoscope && (
        <p className="fortune">{horoscope}</p>
      )}
    </div>
  );
};

export default LuckyCard;