import React, { useEffect, useState } from 'react';
import './MoodCard.css';

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

const getZodiacFromBirthday = (birthday) => {
  const [year, month, day] = birthday.split("-");
  const target = `${month}-${day}`;
  for (const z of zodiacSigns) {
    if (z.start <= target && target <= z.end) {
      return z;
    }
  }
  // Capricorn wraparound
  return zodiacSigns.find(z => z.sign.includes("Capricorn"));
};

const LuckyCard = ({ birthday }) => {
  const [horoscope, setHoroscope] = useState(null);
  const [zodiac, setZodiac] = useState(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      console.log("Birthday passed to LuckyCard:", birthday);

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

    fetchHoroscope();
  }, [birthday]);

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
