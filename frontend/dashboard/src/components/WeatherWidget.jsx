import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            if (!res.ok) throw new Error("Failed to fetch weather data");
            const data = await res.json();
            setWeather(data.current_weather);
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        },
        (err) => {
          setError("Location access denied. Unable to fetch local weather.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={24} className="weather-icon sun" />;
    if (code >= 1 && code <= 3) return <Cloud size={24} className="weather-icon cloud" />;
    if (code >= 45 && code <= 48) return <Cloud size={24} className="weather-icon fog" />;
    if (code >= 51 && code <= 67) return <CloudRain size={24} className="weather-icon rain" />;
    if (code >= 71 && code <= 82) return <CloudSnow size={24} className="weather-icon snow" />;
    if (code >= 95) return <CloudLightning size={24} className="weather-icon storm" />;
    return <Sun size={24} className="weather-icon sun" />;
  };

  const getSuitabilityMessage = (temp) => {
    if (temp >= 15 && temp <= 30) {
      return { text: "Optimal weather for most plants. Great time for photosynthesis!", color: "var(--moss-green)" };
    } else if (temp > 30) {
      return { text: "High temperature alert: Ensure plants are well-watered and shaded if necessary.", color: "#eab308" }; // yellow/orange
    } else {
      return { text: "Cool weather: Protect sensitive plants from cold drafts.", color: "#3b82f6" }; // blue
    }
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
        <span style={{marginLeft: '10px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Fetching local weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <MapPin size={16} />
        <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{error}</span>
      </div>
    );
  }

  if (!weather) return null;

  const suitability = getSuitabilityMessage(weather.temperature);

  return (
    <div className="weather-widget">
      <div className="weather-main">
        {getWeatherIcon(weather.weathercode)}
        <div className="weather-temp">
          <h3>{weather.temperature}°C</h3>
          <span className="weather-wind"><Wind size={12} /> {weather.windspeed} km/h</span>
        </div>
      </div>
      <div className="weather-suitability" style={{ borderLeftColor: suitability.color }}>
        <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500 }}>
          {suitability.text}
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;
