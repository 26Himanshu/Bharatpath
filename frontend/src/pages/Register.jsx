import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerFarmer } from '../services/api';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane', 'Other'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', location: '', farm_size: '', crop_type: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleRegister = async () => {
  setGoogleLoading(true);
  setError(null);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    setSuccess(`Welcome, ${user.displayName}! Account created. Redirecting...`);
    setTimeout(() => navigate('/'), 1500);
  } catch (err) {
    setError('Google sign-in failed. Please try again.');
  }
  setGoogleLoading(false);
};

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerFarmer({
        ...form,
        farm_size: form.farm_size ? parseFloat(form.farm_size) : null,
      });
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold text-green-700 mt-2">BharatPath</h1>
          <p className="text-gray-500 text-sm">किसान का साथी</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Google Register Button */}
      <button
       onClick={handleGoogleRegister}
       disabled={googleLoading}
       className="w-full flex items-center justify-center space-x-3 py-3 border-2 border-gray-200 hover:border-green-400 rounded-xl transition mb-4 bg-white hover:bg-green-50"
  >
      <img
       src="https://www.google.com/favicon.ico"
       alt="Google"
       className="w-5 h-5"
      />
     <span className="font-medium text-gray-700">
      {googleLoading ? 'Signing in...' : 'Continue with Google'}
     </span>
     </button>

    {/* Divider */}
     <div className="flex items-center space-x-3 mb-4">
     <div className="flex-1 h-px bg-gray-200"></div>
     <span className="text-gray-400 text-sm">or register with email</span>
     <div className="flex-1 h-px bg-gray-200"></div>
    </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="farmer@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Lucknow, UP"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (hectares)</label>
              <input
                type="number"
                placeholder="e.g. 2.5"
                value={form.farm_size}
                onChange={(e) => setForm({ ...form, farm_size: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Crop</label>
            <select
              value={form.crop_type}
              onChange={(e) => setForm({ ...form, crop_type: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select your main crop</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md"
          >
            {loading ? '🔄 Registering...' : '🌾 Create Account'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}