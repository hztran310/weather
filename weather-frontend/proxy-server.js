// import express from 'express';
// import cors from 'cors';

// const app = express();
// app.use(cors());

// app.get('/horoscope', async (req, res) => {
//   const { sign, day } = req.query;
//   const url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=${day}`;
  
//   try {
//     const response = await fetch(url); // Use built-in fetch
//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

// app.listen(3001, () => {
//   console.log('Proxy running on http://localhost:3001');
// });

// proxy-server.js (in root)
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/horoscope", async (req, res) => {
  const { sign, day } = req.query;
  const url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=${day}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Proxy running on http://localhost:${PORT}`);
});
