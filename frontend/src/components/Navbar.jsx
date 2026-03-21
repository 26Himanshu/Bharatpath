import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/disease', label: 'Crop Disease', icon: '🌿' },
  { path: '/mandi', label: 'Mandi Prices', icon: '📊' },
  { path: '/profit', label: 'Profit Tracker', icon: '💰' },
  { path: '/schemes', label: 'Gov. Schemes', icon: '🏛️' },
  { path: '/weather', label: 'Weather', icon: '🌤️' },
  { path: '/mandi-map', label: 'Mandi Map', icon: '🗺️' },
];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="text-white font-bold text-xl">Bharat</span>
              <span className="text-yellow-300 font-bold text-xl">Path</span>
              <p className="text-green-200 text-xs leading-none">किसान का साथी</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-yellow-400 text-green-900 shadow-md'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="relative">
                {/* Profile Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-xl transition"
                >
                  {user.photo ? (
                    <img src={user.photo} alt="profile" className="w-8 h-8 rounded-full border-2 border-yellow-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-green-900 font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-white text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <span className="text-green-200 text-xs">▼</span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition rounded-b-xl"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-green-100 hover:text-white text-sm font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 rounded-lg text-sm font-bold transition shadow-md">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive(link.path) ? 'bg-yellow-400 text-green-900' : 'text-green-100 hover:bg-green-600'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            {user ? (
              <div className="px-4 pt-2 space-y-2">
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  className="block text-center py-2 bg-green-600 text-white rounded-lg text-sm">
                  👤 My Profile
                </Link>
                <button onClick={handleLogout}
                  className="w-full py-2 bg-red-500 text-white rounded-lg text-sm font-bold">
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 px-4 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 border border-green-300 text-green-100 rounded-lg text-sm">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-yellow-400 text-green-900 rounded-lg text-sm font-bold">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}