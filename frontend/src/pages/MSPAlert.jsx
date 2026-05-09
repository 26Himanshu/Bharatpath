import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMSPPrices, getBestMandi } from '../services/api';

const CROPS_WITH_MSP = [
  'Wheat', 'Rice', 'Maize', 'Soyabean', 'Cotton',
  'Mustard', 'Groundnut', 'Bajra', 'Jowar', 'Barley',
  'Moong', 'Urad', 'Arhar', 'Sunflower'
];

export default function MSPAlert() {
  const [mspData, setMspData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    getMSPPrices().then(res => setMspData(res.data)).catch(() => {});
  }, []);

  // Animated dots for loading
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleCheck = async () => {
    if (!selectedCrop || !quantity) {
      setError('Please select crop and enter quantity');
      return;
    }
    setLoading(true);
    setError(null);
    setCheckResult(null);
    try {
      const res = await getBestMandi(selectedCrop, parseFloat(quantity), '');
      if (res.data.error) {
        setError(`${res.data.error} — Government API may be slow. Please wait and try again.`);
      } else {
        setCheckResult(res.data);
      }
    } catch {
      setError('Government API is currently slow. Please try again in 30 seconds.');
    }
    setLoading(false);
  };

  const getAlertStyle = (alert) => {
    switch (alert) {
      case 'below': return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-700', icon: '🔴' };
      case 'good': return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100 text-green-700', icon: '🟢' };
      case 'excellent': return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', icon: '✅' };
      case 'fair': return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700', icon: '🟡' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600', icon: 'ℹ️' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-10 relative overflow-hidden">
        <motion.div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full opacity-10"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2">📢 MSP Price Alerts</h1>
            <p className="text-orange-100">Compare live mandi prices with Government Minimum Support Price</p>
            <div className="flex items-center space-x-3 mt-3 flex-wrap gap-2">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                🏛️ MSP 2025-26 — Ministry of Agriculture
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                📊 Live Mandi Data — data.gov.in
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* What is MSP */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-bold text-blue-800 mb-2">ℹ️ What is MSP?</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            <strong>Minimum Support Price (MSP)</strong> is the price at which the Government of India
            guarantees to buy your crop. If mandi prices fall below MSP, you can sell to government
            procurement centers (FCI, NAFED) at the guaranteed MSP price.
            <strong className="text-red-600"> Never sell below MSP!</strong>
          </p>
        </motion.div>

        {/* Check Form */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Check Your Crop Price vs MSP</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Select Crop</label>
              <select value={selectedCrop}
                onChange={(e) => { setSelectedCrop(e.target.value); setCheckResult(null); setError(null); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              >
                <option value="">Select Crop</option>
                {CROPS_WITH_MSP.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Quantity (kg)</label>
              <input type="number" value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              />
            </div>
            <div className="flex items-end">
              <motion.button
                onClick={handleCheck}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white transition shadow-md ${
                  loading
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                    <span>Fetching live data{loadingDots}</span>
                  </span>
                ) : '📢 Check MSP Alert'}
              </motion.button>
            </div>
          </div>

          {/* Loading info message */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i}
                        className="w-2 h-2 bg-orange-400 rounded-full"
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <p className="text-orange-700 text-sm">
                    Fetching live mandi prices from Government of India (data.gov.in)...
                    <span className="text-orange-500 text-xs block mt-0.5">
                      This may take up to 30 seconds — please wait ⏳
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <p className="text-red-500 text-sm">⚠️ {error}</p>
              <button
                onClick={handleCheck}
                className="mt-2 text-xs text-orange-600 font-bold underline hover:no-underline"
              >
                🔄 Try Again
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* MSP Check Results */}
        <AnimatePresence>
          {checkResult && (
            <motion.div className="mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                📊 MSP Analysis for {checkResult.crop}
              </h2>

              {/* Summary Cards */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-gray-500 text-xs mb-1">Government MSP</p>
                    <p className="text-2xl font-black text-orange-600">₹{checkResult.msp_price}</p>
                    <p className="text-gray-400 text-xs">per quintal</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-gray-500 text-xs mb-1">Best Mandi Price</p>
                    <p className="text-2xl font-black text-green-600">
                      ₹{checkResult.recommendations?.[0]?.price || 0}
                    </p>
                    <p className="text-gray-400 text-xs">per quintal</p>
                  </div>
                  <div className={`text-center p-3 rounded-xl border ${
                    (checkResult.recommendations?.[0]?.msp_diff || 0) >= 0
                      ? 'bg-green-50 border-green-100'
                      : 'bg-red-50 border-red-100'
                  }`}>
                    <p className="text-gray-500 text-xs mb-1">Difference</p>
                    <p className={`text-2xl font-black ${
                      (checkResult.recommendations?.[0]?.msp_diff || 0) >= 0
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(checkResult.recommendations?.[0]?.msp_diff || 0) >= 0 ? '+' : ''}
                      ₹{checkResult.recommendations?.[0]?.msp_diff || 0}
                    </p>
                    <p className="text-gray-400 text-xs">per quintal</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-gray-500 text-xs mb-1">Your Revenue</p>
                    <p className="text-2xl font-black text-blue-600">
                      ₹{checkResult.recommendations?.[0]?.estimated_revenue?.toLocaleString() || 0}
                    </p>
                    <p className="text-gray-400 text-xs">for {checkResult.quantity}kg</p>
                  </div>
                </div>
              </div>

              {/* Mandi Cards */}
              <div className="space-y-3">
                {checkResult.recommendations?.map((mandi, i) => {
                  const style = getAlertStyle(mandi.msp_alert);
                  return (
                    <motion.div key={i}
                      className={`${style.bg} border-2 ${style.border} rounded-2xl p-5`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                            <span className="text-2xl">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                            </span>
                            <h3 className="text-lg font-bold text-gray-800">{mandi.mandi}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                              {style.icon} {mandi.msp_alert?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">📍 {mandi.district}, {mandi.state}</p>
                          <p className="text-gray-400 text-xs mt-0.5">📅 {mandi.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-green-600">₹{mandi.price}</p>
                          <p className="text-gray-400 text-xs">per quintal</p>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl border ${style.border} ${style.bg} mb-3`}>
                        <p className={`font-bold text-sm ${style.text}`}>{mandi.msp_message}</p>
                        {mandi.msp_diff_percent !== 0 && (
                          <p className={`text-xs mt-1 ${style.text} opacity-75`}>
                            {mandi.msp_diff_percent > 0 ? '↑' : '↓'} {Math.abs(mandi.msp_diff_percent)}% compared to MSP
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-gray-500 text-sm">Revenue for {checkResult.quantity}kg</span>
                        <span className="font-bold text-blue-600 text-lg">
                          ₹{mandi.estimated_revenue?.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MSP Table */}
        {mspData && (
          <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-800">🏛️ Government MSP Rates 2025-26</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {mspData.source}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(mspData.msp_prices)
                .filter(([_, price]) => price > 0)
                .map(([crop, price], i) => (
                  <motion.div key={i}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                      selectedCrop === crop
                        ? 'bg-orange-50 border-orange-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                    }`}
                    onClick={() => { setSelectedCrop(crop); setCheckResult(null); }}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <p className="font-bold text-gray-800 text-sm">{crop}</p>
                    <p className="text-orange-600 font-black text-lg">₹{price.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">per quintal</p>
                  </motion.div>
                ))}
            </div>
            <p className="text-gray-400 text-xs mt-4 text-center">
              💡 Click any crop to auto-select it for MSP check above
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}