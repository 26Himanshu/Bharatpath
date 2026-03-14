import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginFarmer } from '../services/api';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { loginWithEmail } = useAuth();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await loginFarmer(form);
      loginWithEmail({
      name: res.data.name,
      email: form.email,
      photo: null,
      provider: 'email',
      });
    setSuccess(`Welcome back, ${res.data.name}! 🌾 Redirecting...`);
    setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setSuccess(`Welcome, ${user.displayName}! 🌾 Redirecting...`);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold text-green-700 mt-2">BharatPath</h1>
          <p className="text-gray-500 text-sm">किसान का साथी</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Welcome Back 👋</h2>

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

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
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
          <span className="text-gray-400 text-sm">or login with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Email/Password Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="farmer@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md"
          >
            {loading ? '🔄 Logging in...' : '🌾 Login'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}