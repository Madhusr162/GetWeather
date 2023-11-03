const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

const apiKey = 'bd459961b989b37c29b4960828f9431b';
const weatherApiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Define a function to convert Kelvin to Celsius
function kelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

app.post('/getWeather', async (req, res) => {
  let { cities } = req.body;

  // Ensure that cities is always an array, even if it's provided as a single value
  if (!Array.isArray(cities)) {
    cities = [cities];
  }

  if (!cities || cities.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const weatherData = {};

  for (const cityName of cities) {
    try {
      const response = await axios.get(`${weatherApiBaseUrl}?q=${cityName}&appid=${apiKey}`);

      const temp = kelvinToCelsius(response.data.main.temp)+'C';

      weatherData[cityName] = temp;
    } catch (error) {

      weatherData[cityName] = { error: 'Weather data not found' };
      
    }
  }

  res.status(200).json({ weather: weatherData });
});

app.listen(3000, () => {
  console.log("server is running");
});
