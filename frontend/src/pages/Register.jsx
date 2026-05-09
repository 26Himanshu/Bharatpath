import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerFarmer } from '../services/api';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const checkPasswordStrength = (password) => {
  let strength = 0;
  let tips = [];
  if (password.length >= 8) strength++; else tips.push('At least 8 characters');
  if (/[A-Z]/.test(password)) strength++; else tips.push('One uppercase letter');
  if (/[0-9]/.test(password)) strength++; else tips.push('One number');
  if (/[^A-Za-z0-9]/.test(password)) strength++; else tips.push('One special character (!@#$)');
  return { strength, tips };
};

const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { strength, tips } = checkPasswordStrength(form.password);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    if (strength < 2) {
      setError('Please use a stronger password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerFarmer({ name: form.name, email: form.email, password: form.password });
      setSuccess('Registration successful! Redirecting... 🎉');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccess(`Welcome, ${result.user.displayName}! Redirecting...`);
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-100 rounded-full opacity-40" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-100 rounded-full opacity-40" />
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
            🌾
          </div>
          <h1 className="text-2xl font-black text-green-700">BharatPath</h1>
          <p className="text-gray-400 text-sm">किसान का साथी</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Create Your Account 🌱</h2>
        <p className="text-gray-400 text-xs text-center mb-5">
          Complete your farm profile after registration for personalized recommendations
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Google Button */}
        <button onClick={handleGoogleRegister} disabled={googleLoading}
          className="w-full flex items-center justify-center space-x-3 py-3 border-2 border-gray-100 hover:border-green-300 rounded-2xl transition mb-4 bg-white hover:bg-green-50">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="font-semibold text-gray-600">
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-gray-400 text-xs">or register with email</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
            <input type="text" placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address *</label>
            <input type="email" placeholder="farmer@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password Strength Bar */}
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= strength ? strengthColors[strength] : 'bg-gray-200'
                      }`} />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${
                    strength <= 1 ? 'text-red-500' :
                    strength === 2 ? 'text-yellow-500' :
                    strength === 3 ? 'text-green-500' : 'text-green-600'
                  }`}>
                    {strengthLabels[strength]}
                  </span>
                  {tips.length > 0 && (
                    <span className="text-xs text-gray-400">
                      Add: {tips[0]}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Strong Password Suggestions */}
            {form.password.length > 0 && strength < 4 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">💡 Strong password tips:</p>
                <ul className="space-y-0.5">
                  {[
                    { check: form.password.length >= 8, label: '✓ At least 8 characters' },
                    { check: /[A-Z]/.test(form.password), label: '✓ One uppercase letter (A-Z)' },
                    { check: /[0-9]/.test(form.password), label: '✓ One number (0-9)' },
                    { check: /[^A-Za-z0-9]/.test(form.password), label: '✓ One special character (!@#$)' },
                  ].map((item, i) => (
                    <li key={i} className={`text-xs ${item.check ? 'text-green-600' : 'text-gray-400'}`}>
                      {item.check ? '✅' : '○'} {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition shadow-md">
            {loading ? '🔄 Registering...' : '🌾 Create Account'}
          </button>

          <p className="text-center text-gray-400 text-xs">
            After registration, complete your farm profile to get personalized scheme recommendations 🌾
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}