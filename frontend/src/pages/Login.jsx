import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginFarmer } from '../services/api';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resetSent, setResetSent] = useState(false);
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
    } catch {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccess(`Welcome, ${result.user.displayName}! 🌾 Redirecting...`);
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError('Please enter your email address first');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetSent(true);
      setError(null);
      setSuccess(`Password reset email sent to ${form.email} ✅ Check your inbox!`);
    } catch {
      setError('Could not send reset email. Please check your email address.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-100 rounded-full opacity-40" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-100 rounded-full opacity-40" />
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
            🌾
          </div>
          <h1 className="text-2xl font-black text-green-700">BharatPath</h1>
          <p className="text-gray-400 text-sm">किसान का साथी</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Welcome Back 👋</h2>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Google Button */}
        <button onClick={handleGoogleLogin} disabled={googleLoading}
          className="w-full flex items-center justify-center space-x-3 py-3 border-2 border-gray-100 hover:border-green-300 rounded-2xl transition mb-4 bg-white hover:bg-green-50">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="font-semibold text-gray-600">
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-gray-400 text-xs">or login with email</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="farmer@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-green-600 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
          </div>

          {resetSent && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
              📧 Check your email inbox for password reset link!
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition shadow-md">
            {loading ? '🔄 Logging in...' : '🌾 Login'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}