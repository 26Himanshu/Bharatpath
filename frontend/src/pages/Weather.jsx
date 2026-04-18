import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CITIES = [
  'Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Jaipur',
  'Bhopal', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Chandigarh', 'Nagpur', 'Indore', 'Bhubaneswar', 'Raipur',
  'Amritsar', 'Varanasi', 'Agra', 'Surat', 'Ahmedabad'
];

const getWeatherTheme = (desc) => {
  if (!desc) return {
    bg: 'from-blue-500 to-indigo-600',
    card: 'bg-blue-50 border-blue-100',
    text: 'text-blue-700',
    light: 'bg-blue-100',
    emoji: '🌤️'
  };
  desc = desc.toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle')) return {
    bg: 'from-slate-600 to-blue-700',
    card: 'bg-slate-50 border-slate-200',
    text: 'text-slate-700',
    light: 'bg-slate-100',
    emoji: '🌧️'
  };
  if (desc.includes('cloud')) return {
    bg: 'from-gray-500 to-slate-600',
    card: 'bg-gray-50 border-gray-200',
    text: 'text-gray-700',
    light: 'bg-gray-100',
    emoji: '⛅'
  };
  if (desc.includes('clear') || desc.includes('sunny')) return {
    bg: 'from-orange-400 to-yellow-500',
    card: 'bg-orange-50 border-orange-100',
    text: 'text-orange-700',
    light: 'bg-orange-100',
    emoji: '☀️'
  };
  if (desc.includes('storm') || desc.includes('thunder')) return {
    bg: 'from-gray-700 to-purple-800',
    card: 'bg-gray-50 border-gray-200',
    text: 'text-gray-700',
    light: 'bg-gray-100',
    emoji: '⛈️'
  };
  if (desc.includes('snow') || desc.includes('hail')) return {
    bg: 'from-blue-300 to-cyan-400',
    card: 'bg-cyan-50 border-cyan-100',
    text: 'text-cyan-700',
    light: 'bg-cyan-100',
    emoji: '❄️'
  };
  if (desc.includes('haze') || desc.includes('mist') || desc.includes('fog')) return {
    bg: 'from-amber-400 to-orange-500',
    card: 'bg-amber-50 border-amber-100',
    text: 'text-amber-700',
    light: 'bg-amber-100',
    emoji: '🌫️'
  };
  return {
    bg: 'from-blue-500 to-indigo-600',
    card: 'bg-blue-50 border-blue-100',
    text: 'text-blue-700',
    light: 'bg-blue-100',
    emoji: '🌤️'
  };
};

export default function Weather() {
  const [city, setCity] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchWeather('Delhi'); }, []);

  const fetchWeather = async (selectedCity) => {
    setLoading(true); setError(null);
    try {
      const [w, f] = await Promise.all([
        axios.get(`http://localhost:8000/weather/current?city=${selectedCity}`),
        axios.get(`http://localhost:8000/weather/forecast?city=${selectedCity}`)
      ]);
      w.data.error ? setError(w.data.error) : setWeather(w.data);
      if (!f.data.error) setForecast(f.data);
    } catch { setError('Could not fetch weather.'); }
    setLoading(false);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    fetchWeather(e.target.value);
  };

  const theme = getWeatherTheme(weather?.description);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Dynamic Weather Header */}
      <motion.div
        className={`relative overflow-hidden bg-gradient-to-br ${theme.bg} text-white px-6 py-12`}
        animate={{ background: theme.bg }}
        transition={{ duration: 1 }}
      >
        {/* Animated background circles */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full opacity-5"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-48 h-48 bg-white rounded-full opacity-5"
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white text-opacity-70 text-sm mb-1 uppercase tracking-widest">Farm Weather</p>
            <h1 className="text-5xl font-black mb-1">
              {loading ? '...' : weather ? `${weather.temperature}°C` : '--°C'}
            </h1>
            <p className="text-white text-opacity-80 text-xl">
              {weather ? weather.description : 'Loading...'}
              {weather && <span className="ml-2">{theme.emoji}</span>}
            </p>
            <p className="text-white text-opacity-60 text-sm mt-1">
              {weather ? `${weather.city} • Feels like ${weather.feels_like}°C` : ''}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* City Selector */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 -mt-6 relative z-10"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        >
          <label className="block text-sm font-medium text-gray-500 mb-2">📍 Select Your City</label>
          <select value={city} onChange={handleCityChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 font-medium"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </motion.div>

        {error && (
          <motion.div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-red-500">⚠️ {error}</p>
            <p className="text-red-400 text-sm mt-1">Weather API may still be activating. Try again shortly.</p>
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-12">
            <motion.div
              className="text-6xl mb-4 inline-block"
              animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >🌀</motion.div>
            <p className="text-gray-400">Fetching weather data...</p>
          </div>
        )}

        <AnimatePresence>
          {weather && !loading && (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            >
              {/* Weather Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Humidity', value: `${weather.humidity}%`, icon: '💧', color: 'bg-blue-50 border-blue-100 text-blue-600' },
                  { label: 'Wind Speed', value: `${weather.wind_speed} m/s`, icon: '💨', color: 'bg-cyan-50 border-cyan-100 text-cyan-600' },
                  { label: 'Visibility', value: `${weather.visibility} km`, icon: '👁️', color: 'bg-purple-50 border-purple-100 text-purple-600' },
                  { label: 'Feels Like', value: `${weather.feels_like}°C`, icon: '🌡️', color: 'bg-orange-50 border-orange-100 text-orange-600' },
                ].map((stat, i) => (
                  <motion.div key={i}
                    className={`bg-white border rounded-2xl p-4 text-center`}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.04, y: -3 }}
                    style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
                  >
                    <span className="text-2xl block mb-1">{stat.icon}</span>
                    <p className={`text-xl font-black ${stat.color.split(' ')[2]}`}>{stat.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Farming Advice */}
              <motion.div
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 mb-6"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    🌾
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 mb-1">Farming Advice</h3>
                    <p className="text-green-700 text-sm leading-relaxed">{weather.farming_advice}</p>
                  </div>
                </div>
              </motion.div>

              {/* Seasonal Crop Suggestions */}
            <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-5 mb-6"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
          >
          <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-lg">🌾 Seasonal Crop Suggestions</h3>
         <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
        {weather.season}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-3">{weather.seasonal_advice}</p>
      <div className="flex flex-wrap gap-2">
      {weather.recommended_crops?.map((crop, i) => (
      <motion.span key={i}
        className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.08 }}
        whileHover={{ scale: 1.05 }}
      >
        {crop}
      </motion.span>
      ))}
      </div>
      <p className="text-gray-400 text-xs mt-3">
      📅 Based on current month: {weather.current_month} | Season: {weather.season}
    </p>
      </motion.div>

              {/* Forecast */}
              {forecast && (
                <motion.div
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <h3 className="font-bold text-gray-800 text-lg mb-4">📅 Short-term Forecast</h3>
                  <div className="space-y-3">
                    {forecast.forecasts.map((f, i) => (
                      <motion.div key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={`https://openweathermap.org/img/wn/${f.icon}.png`}
                            alt="weather" className="w-10 h-10"
                          />
                          <div>
                            <p className="font-medium text-gray-700 text-sm">{f.description}</p>
                            <p className="text-gray-400 text-xs">
                              {new Date(f.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-800">{f.temp}°C</p>
                          <p className="text-gray-400 text-xs">{f.humidity}% humidity</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}