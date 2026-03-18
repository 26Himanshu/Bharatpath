import { useState } from 'react';
import { getBestMandi, getPricePrediction } from '../services/api';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane', 'Maize', 'Soyabean'];

export default function MandiOptimizer() {
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [district, setDistrict] = useState('');
  const [results, setResults] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predLoading, setPredLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!crop || !quantity) {
      setError('Please select crop and enter quantity');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await getBestMandi(crop, parseFloat(quantity), district);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResults(res.data);
      }
    } catch (err) {
      setError('Could not fetch mandi data. Please try again.');
    }
    setLoading(false);
  };

  const handlePrediction = async () => {
    if (!crop) {
      setError('Please select a crop first');
      return;
    }
    setPredLoading(true);
    setError(null);
    try {
      const res = await getPricePrediction(crop);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setPrediction(res.data);
      }
    } catch (err) {
      setError('Could not fetch price prediction.');
    }
    setPredLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">📊 Smart Mandi Optimizer</h1>
          <p className="text-blue-100">Live prices from Government of India — data.gov.in</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-800 rounded-full text-xs text-blue-200">
            🏛️ Official Source: Ministry of Agriculture
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌾 Enter Your Crop Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => { setCrop(e.target.value); setResults(null); setPrediction(null); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Crop</option>
                {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your District (optional)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Delhi"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">⚠️ {error}</p>}

          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md"
            >
              {loading ? '🔄 Finding Best Mandi...' : '🔍 Find Best Mandi'}
            </button>
            <button
              onClick={handlePrediction}
              disabled={predLoading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md"
            >
              {predLoading ? '🔄 Predicting...' : '📈 Predict Price'}
            </button>
          </div>
        </div>

        {/* Mandi Results */}
        {results && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-800">🏆 Best Mandis for {results.crop}</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                🏛️ {results.source}
              </span>
            </div>
            <div className="space-y-3">
              {results.recommendations.map((mandi, i) => (
                <div key={i} className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                  i === 0 ? 'border-yellow-400' : i === 1 ? 'border-gray-400' : 'border-orange-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                        <h3 className="text-lg font-bold text-gray-800">{mandi.mandi}</h3>
                      </div>
                      <p className="text-gray-500 text-sm">📍 {mandi.district}, {mandi.state}</p>
                      <p className="text-gray-400 text-xs mt-1">📅 Data as of: {mandi.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{mandi.price}</p>
                      <p className="text-gray-400 text-xs">per quintal</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Revenue for {results.quantity}kg</span>
                    <span className="font-bold text-blue-600">₹{mandi.estimated_revenue?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Prediction */}
        {prediction && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">📈 Price Prediction — {prediction.crop}</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                🏛️ {prediction.source}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Predicted Next Price</p>
                <p className="text-3xl font-bold text-green-600">₹{prediction.predicted_price}</p>
                <p className="text-gray-400 text-xs">per quintal</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Price Trend</p>
                <p className="text-2xl font-bold text-blue-600">{prediction.trend}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Average Price</p>
                <p className="text-3xl font-bold text-yellow-600">₹{prediction.average_price}</p>
                <p className="text-gray-400 text-xs">per quintal</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🏛️', title: 'Official Government Data', desc: 'Live prices from data.gov.in — Ministry of Agriculture' },
            { icon: '📅', title: 'Updated Daily', desc: 'Fresh mandi prices every day from across India' },
            { icon: '🤖', title: 'AI Price Prediction', desc: 'Machine learning forecasts future crop prices' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-start space-x-3 border border-gray-100">
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}