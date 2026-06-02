import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🔬', title: 'AI Crop Health Analysis', desc: 'Upload a leaf photo — our AI instantly diagnoses crop health and suggests treatment', color: 'bg-green-50 border-green-200', iconBg: 'bg-green-100' },
  { icon: '📊', title: 'Smart Mandi Optimizer', desc: 'Get live government mandi prices and find the best market to sell your crop', color: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100' },
  { icon: '🗺️', title: 'Mandi Map', desc: 'Find agricultural markets near you on an interactive map of India', color: 'bg-purple-50 border-purple-200', iconBg: 'bg-purple-100' },
  { icon: '🌤️', title: 'Farm Weather', desc: 'Real-time weather with farming advice and seasonal crop suggestions', color: 'bg-cyan-50 border-cyan-200', iconBg: 'bg-cyan-100' },
  { icon: '🏛️', title: 'Government Schemes', desc: 'Discover PM-KISAN, Fasal Bima and other schemes you are eligible for', color: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100' },
  { icon: '💰', title: 'Personal Profit Tracker', desc: 'Track your farm income and expenses — available after signing in', color: 'bg-yellow-50 border-yellow-200', iconBg: 'bg-yellow-100' },
];

const stats = [
  { value: '3,000+', label: 'Mandis Covered', icon: '🏪' },
  { value: '38', label: 'Crop Health Detected', icon: '🌿' },
  { value: '8+', label: 'Govt Schemes Listed', icon: '🏛️' },
  { value: '700+', label: 'Indian Cities Weather', icon: '🌤️' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white">
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-10"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [-10, 10, -10], opacity: [0.05, 0.2, 0.05] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            <motion.div
              className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm mb-6 border border-white border-opacity-30"
              animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              <span>Live Government Data — data.gov.in</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight flex items-center justify-center space-x-4">
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🌾</span>
            <span>BharatPath</span>
            <span>🌾</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-green-100 mb-2">
              किसान का स्मार्ट साथी
            </p>
            <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
              AI-powered decision support system for Indian farmers —
              crop health detection, live mandi prices, weather forecasts and government schemes
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register"
                  className="block px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black rounded-2xl text-lg shadow-xl transition"
                >
                  🚀 Get Started Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login"
                  className="block px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-2xl text-lg border border-white border-opacity-40 transition"
                >
                  Login to Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div key={i}
              className="text-center bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04, y: -3 }}
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-2xl font-black text-green-700">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Everything a Farmer Needs</h2>
          <p className="text-gray-500">Powered by AI and real government data</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {features.map((f, i) => (
            <motion.div key={i}
              className={`${f.color} border rounded-2xl p-5`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Data Sources */}
        <motion.div
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 mb-16 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-gray-800 text-lg mb-4">🏛️ Powered by Official Government Data</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'data.gov.in', desc: 'Mandi Prices', icon: '📊' },
              { name: 'OpenWeatherMap', desc: 'Weather Data', icon: '🌤️' },
              { name: 'Firebase', desc: 'Secure Auth', icon: '🔐' },
              { name: 'Bhashini', desc: 'Hindi Translation', icon: '🇮🇳' },
            ].map((source, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 border border-green-100 flex items-center space-x-2 shadow-sm">
                <span>{source.icon}</span>
                <div className="text-left">
                  <p className="font-bold text-gray-700 text-sm">{source.name}</p>
                  <p className="text-gray-400 text-xs">{source.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-10 text-center text-white"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ boxShadow: '0 20px 40px rgba(22, 163, 74, 0.2)' }}
        >
          <h2 className="text-3xl font-black mb-2">Ready to Transform Your Farm? 🌾</h2>
          <p className="text-green-100 mb-6">Join thousands of farmers using BharatPath</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/register"
                className="block px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black rounded-2xl shadow-lg transition"
              >
                🚀 Create Free Account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/mandi"
                className="block px-8 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-2xl border border-white border-opacity-40 transition"
              >
                📊 Check Mandi Prices
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 py-8 text-center">
        <p className="text-gray-400 text-sm">
          🌾 BharatPath — किसान का साथी | Built for Indian Farmers | MSc Informatics Project
        </p>
        <p className="text-gray-300 text-xs mt-1">
          Data sourced from data.gov.in — Ministry of Agriculture, Government of India
        </p>
      </div>
    </div>
  );
}