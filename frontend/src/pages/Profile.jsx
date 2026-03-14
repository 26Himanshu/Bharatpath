import { useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(user?.photo || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: preview,
        });
      }
      const updatedUser = { ...user, name, photo: preview };
      setUser(updatedUser);
      if (user.provider === 'email') {
        localStorage.setItem('bharatpath_user', JSON.stringify(updatedUser));
      }
      setSuccess('Profile updated successfully! ✅');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">👤 My Profile</h1>
          <p className="text-green-100">Manage your account details</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-8">

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

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {preview ? (
                <img src={preview} alt="profile" className="w-24 h-24 rounded-full object-cover border-4 border-green-400 shadow-md" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-400 flex items-center justify-center text-4xl font-bold text-green-700 shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Edit Photo Button */}
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition"
              >
                📷
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">Click 📷 to change photo</p>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Login Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login Method</label>
              <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl border ${
                user?.provider === 'google.com' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {user?.provider === 'google.com' ? (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    <span className="text-blue-600 font-medium text-sm">Connected with Google</span>
                  </>
                ) : (
                  <>
                    <span>📧</span>
                    <span className="text-gray-600 font-medium text-sm">Email & Password</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md"
            >
              {saving ? '🔄 Saving...' : '✅ Save Changes'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 border-2 border-red-300 text-red-500 hover:bg-red-50 font-bold rounded-xl transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}