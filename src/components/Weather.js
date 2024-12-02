import React, { useState, useEffect } from "react";
import './weather.css'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {

    const API_KEY = process.env.REACT_APP_VISUAL_CROSSING_API_KEY;
    const API_URL = process.env.REACT_APP_API_URL;
    const url = `${API_URL}${latitude},${longitude}?unitGroup=metric&include=current&key=${API_KEY}&contentType=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }
      const data = await response.json();

      const { temp, feelslike, conditions, humidity } = data.currentConditions;
      setWeatherData({ temp, feelslike, conditions, humidity });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="weather-div">
      <h2>Weather near you </h2>
      {weatherData && (
        <div className='info'>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Feels Like: {weatherData.feelslike}°C</p>
          <p>Conditions: {weatherData.conditions}</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
