import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as THREE from 'three';

// 3D Animated Background
function ThreeBackground() {
  const mountRef = useRef(null);
  useEffect(() => {
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const geometry = new THREE.BufferGeometry();
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x4ade80, size: 0.08, transparent: true, opacity: 0.7
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating wheat-like lines
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.3 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5);
      mesh.rotation.z = Math.random() * Math.PI;
      scene.add(mesh);
    }

    camera.position.z = 8;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}

// Animated Counter
function Counter({ target, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const priceData = [
  { month: 'Oct', wheat: 1800, rice: 3100, onion: 1400 },
  { month: 'Nov', wheat: 1950, rice: 3200, onion: 1700 },
  { month: 'Dec', wheat: 2100, rice: 3350, onion: 1900 },
  { month: 'Jan', wheat: 1990, rice: 3250, onion: 1600 },
  { month: 'Feb', wheat: 2200, rice: 3400, onion: 1500 },
  { month: 'Mar', wheat: 2350, rice: 3500, onion: 1300 },
];

const quickLinks = [
  { path: '/health', label: 'Crop Health', icon: '🔬', desc: 'AI crop diagnosis', bg: 'bg-green-50', border: 'border-green-200', icon_bg: 'bg-green-100', text: 'text-green-700' },
  { path: '/mandi', label: 'Mandi Prices', icon: '📊', desc: 'Live govt prices', bg: 'bg-blue-50', border: 'border-blue-200', icon_bg: 'bg-blue-100', text: 'text-blue-700' },
  { path: '/mandi-map', label: 'Mandi Map', icon: '🗺️', desc: 'Find nearby mandis', bg: 'bg-purple-50', border: 'border-purple-200', icon_bg: 'bg-purple-100', text: 'text-purple-700' },
  { path: '/weather', label: 'Weather', icon: '🌤️', desc: 'Farm forecast', bg: 'bg-cyan-50', border: 'border-cyan-200', icon_bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { path: '/profit', label: 'My Profit', icon: '💰', desc: 'Your farm earnings', bg: 'bg-yellow-50', border: 'border-yellow-200', icon_bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { path: '/schemes', label: 'Gov. Schemes', icon: '🏛️', desc: 'Eligible schemes', bg: 'bg-orange-50', border: 'border-orange-200', icon_bg: 'bg-orange-100', text: 'text-orange-700' },
  { path: '/msp', label: 'MSP Alerts', icon: '📢', desc: 'Price vs MSP check', bg: 'bg-red-50', border: 'border-red-200', icon_bg: 'bg-red-100', text: 'text-red-700' },
];

const stats = [
  { label: 'Net Profit', value: 45200, prefix: '₹', icon: '💰', color: 'from-green-400 to-green-600', textColor: 'text-green-600' },
  { label: 'Crops Tracked', value: 12, icon: '🌿', color: 'from-blue-400 to-blue-600', textColor: 'text-blue-600' },
  { label: 'Crops Analysed', value: 3, icon: '🔬', color: 'from-red-400 to-red-600', textColor: 'text-red-600' },
  { label: 'Schemes Available', value: 8, icon: '🏛️', color: 'from-purple-400 to-purple-600', textColor: 'text-purple-600' },
];

export default function Dashboard() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950" onMouseMove={handleMouseMove}>

      {/* 3D Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 text-white"
        style={{ minHeight: '380px' }}>
        <ThreeBackground />

        {/* Glowing orbs */}
        <div className="absolute top-10 left-20 w-64 h-64 bg-green-500 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-yellow-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-black mb-3"
              style={{ transform: `perspective(1000px) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)` }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-300 to-green-400">
                नमस्ते, किसान भाई!
              </span>
              <span className="ml-3">🌾</span>
            </motion.h1>

            <motion.p
              className="text-green-300 text-xl mb-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
              Welcome to BharatPath — आपका स्मार्ट खेती सहायक
            </motion.p>

            <motion.div
              className="flex items-center space-x-4 mt-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 bg-green-900 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-700">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 text-sm">Live Data Active</span>
              </div>
              <div className="bg-yellow-900 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-700">
                <span className="text-yellow-300 text-sm">
                  📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* 3D Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-8 relative z-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-5 cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-3 shadow-lg`}>
                {stat.icon}
              </div>
              <p className={`text-3xl font-black ${stat.textColor}`}>
                <Counter target={stat.value} prefix={stat.prefix || ''} />
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 3D Quick Action Cards */}
        <motion.h2
          className="text-2xl font-bold text-white mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          🚀 Quick Actions
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.08, rotateY: 8, rotateX: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
            >
              <Link to={link.path}
                className={`block bg-gradient-to-br ${link.color} rounded-2xl p-4 text-white shadow-xl ${link.shadow} hover:shadow-2xl transition-all duration-300`}
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
              >
                <span className="text-3xl block mb-2">{link.icon}</span>
                <p className="font-bold text-sm">{link.label}</p>
                <p className="text-xs opacity-80 mt-0.5">{link.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Price Chart */}
        <motion.div
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        >
          <h2 className="text-xl font-bold text-white mb-1">📈 Crop Price Trends</h2>
          <p className="text-gray-400 text-sm mb-4">Price per quintal (₹) — Last 6 months</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                formatter={(value, name) => [`₹${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Line type="monotone" dataKey="wheat" stroke="#4ade80" strokeWidth={3} dot={{ fill: '#4ade80', r: 4 }} name="wheat" />
              <Line type="monotone" dataKey="rice" stroke="#60a5fa" strokeWidth={3} dot={{ fill: '#60a5fa', r: 4 }} name="rice" />
              <Line type="monotone" dataKey="onion" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} name="onion" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex space-x-4 mt-2 justify-center">
            {[{c:'#4ade80',l:'Wheat'},{c:'#60a5fa',l:'Rice'},{c:'#f59e0b',l:'Onion'}].map((item,i) => (
              <div key={i} className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ background: item.c }}></div>
                <span className="text-gray-400 text-xs">{item.l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Farming Tips */}
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">🌱 Farming Tips</h2>
            <ul className="space-y-3">
              {[
                { tip: 'Check soil moisture before irrigation', icon: '💧', color: 'text-blue-400' },
                { tip: 'Use organic fertilizers for better yield', icon: '🌿', color: 'text-green-400' },
                { tip: 'Early morning is best time for spraying', icon: '🌅', color: 'text-yellow-400' },
                { tip: 'Rotate crops every season for soil health', icon: '🔄', color: 'text-purple-400' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-800 transition"
                  whileHover={{ x: 5 }}
                >
                  <span className={`text-xl ${item.color}`}>{item.icon}</span>
                  <span className="text-gray-300 text-sm">{item.tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Season Info */}
          <motion.div
            className="bg-gradient-to-br from-yellow-900 to-orange-900 border border-yellow-700 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">🌾 Current Season</h2>
            <div className="space-y-3">
              {[
                { label: 'Season', value: 'Rabi (रबी)', color: 'text-orange-300' },
                { label: 'Key Crops', value: 'Wheat, Mustard', color: 'text-green-300' },
                { label: 'Harvest Time', value: 'March - April', color: 'text-yellow-300' },
                { label: 'MSP Wheat', value: '₹2,275/quintal', color: 'text-green-300' },
                { label: 'MSP Rice', value: '₹2,183/quintal', color: 'text-blue-300' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex justify-between items-center py-1 border-b border-yellow-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="text-yellow-200 text-sm">{item.label}</span>
                  <span className={`font-bold text-sm ${item.color}`}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}