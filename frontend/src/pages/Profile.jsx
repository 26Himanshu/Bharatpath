import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane', 'Maize', 'Soyabean', 'Other'];
const STATES = ['Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Other'];
const LAND_TYPES = ['Own Land', 'Leased Land', 'Both Own and Leased', 'Sharecropping'];
const IRRIGATION = ['Rainfed', 'Canal Irrigation', 'Borewell/Tubewell', 'Drip Irrigation', 'Sprinkler', 'Multiple Sources'];
const FERTILIZER_TYPES = ['Organic Only', 'Chemical/Synthetic', 'Mixed (Organic + Chemical)', 'Natural Farming (Zero Budget)'];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(user?.photo || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate();

  const [farmDetails, setFarmDetails] = useState({
    state: '', district: '', village: '',
    landSize: '', landType: '',
    primaryCrop: '', secondaryCrops: '',
    irrigationType: '', fertilizerType: '',
    annualIncome: '', farmingExperience: '',
    hasLoan: false, loanAmount: '', loanPurpose: '',
    organicCertified: false, soilHealthCard: false,
    farmingCapacity: '',
  });
  const [customCrop, setCustomCrop] = useState('');
  const [showCropPopup, setShowCropPopup] = useState(false);  

  const profileComplete = () => {
    const required = ['state', 'district', 'landSize', 'primaryCrop', 'irrigationType', 'fertilizerType'];
    return required.every(field => farmDetails[field]);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonal = async () => {
    setSaving(true); setError(null);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const updatedUser = { ...user, name, photo: preview };
      setUser(updatedUser);
      if (user.provider === 'email') {
        localStorage.setItem('bharatpath_user', JSON.stringify(updatedUser));
      }
      setSuccess('Personal details saved! ✅');
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError('Failed to update. Please try again.'); }
    setSaving(false);
  };

  const handleSaveFarm = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('bharatpath_farm', JSON.stringify(farmDetails));
      setSuccess('Farm details saved! ✅');
      setTimeout(() => setSuccess(null), 3000);
      setSaving(false);
    }, 800);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'farm', label: 'Farm Details', icon: '🌾' },
    { id: 'financial', label: 'Financial Info', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-center space-x-4">
          <div className="relative">
            {preview ? (
              <img src={preview} alt="profile" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-2xl font-black text-green-900 shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
              📷
            </button>
            <input type="file" accept="image/*" ref={fileRef} onChange={handlePhotoChange} className="hidden" />
          </div>
          <div>
            <h1 className="text-2xl font-black">{user?.name}</h1>
            <p className="text-green-200 text-sm">{user?.email}</p>
            <div className={`mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${profileComplete() ? 'bg-green-800 text-green-200' : 'bg-yellow-500 text-yellow-900'}`}>
              <span>{profileComplete() ? '✅ Profile Complete' : '⚠️ Complete your profile to see eligible schemes'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {success && (
          <motion.div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            ⚠️ {error}
          </motion.div>
        )}

        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <motion.div className="bg-white rounded-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-gray-800 text-lg mb-4">👤 Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input type="email" value={user?.email || ''} disabled
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Login Method</label>
                <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl border ${user?.provider === 'google.com' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  {user?.provider === 'google.com' ? (
                    <><img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    <span className="text-blue-600 text-sm font-medium">Connected with Google</span></>
                  ) : (
                    <><span>📧</span><span className="text-gray-600 text-sm font-medium">Email & Password</span></>
                  )}
                </div>
              </div>
              <motion.button onClick={handleSavePersonal} disabled={saving}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {saving ? '🔄 Saving...' : '✅ Save Personal Info'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Farm Details Tab */}
        {activeTab === 'farm' && (
          <motion.div className="bg-white rounded-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-gray-800 text-lg mb-1">🌾 Farm Details</h2>
            <p className="text-gray-400 text-sm mb-4">Complete this to get personalized scheme recommendations</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">State *</label>
                  <select value={farmDetails.state}
                    onChange={(e) => setFarmDetails({ ...farmDetails, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50">
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">District *</label>
                  <input type="text" placeholder="e.g. Lucknow"
                    value={farmDetails.district}
                    onChange={(e) => setFarmDetails({ ...farmDetails, district: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Village/Town</label>
                  <input type="text" placeholder="e.g. Rampur"
                    value={farmDetails.village}
                    onChange={(e) => setFarmDetails({ ...farmDetails, village: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Land Size (Hectares) *</label>
                  <input type="number" placeholder="e.g. 2.5"
                    value={farmDetails.landSize}
                    onChange={(e) => setFarmDetails({ ...farmDetails, landSize: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Land Ownership Type *</label>
                <select value={farmDetails.landType}
                  onChange={(e) => setFarmDetails({ ...farmDetails, landType: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50">
                  <option value="">Select Land Type</option>
                  {LAND_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
  <label className="block text-sm font-medium text-gray-600 mb-1">Primary Crop *</label>
  <select
    value={farmDetails.primaryCrop === customCrop && customCrop ? 'Other' : farmDetails.primaryCrop}
    onChange={(e) => {
      if (e.target.value === 'Other') {
        setShowCropPopup(true);
      } else {
        setFarmDetails({ ...farmDetails, primaryCrop: e.target.value });
        setCustomCrop('');
      }
    }}
    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
  >
    <option value="">Select Primary Crop</option>
    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
  </select>

  {/* Show custom crop name if entered */}
  {customCrop && (
    <div className="mt-2 flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-xl">
      <span className="text-green-600 text-sm">🌾 Custom crop: <strong>{customCrop}</strong></span>
      <button onClick={() => { setCustomCrop(''); setFarmDetails({ ...farmDetails, primaryCrop: '' }); }}
        className="text-red-400 text-xs ml-auto">✕ Clear</button>
    </div>
  )}

  {/* Crop Popup */}
  {showCropPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-2xl p-6 w-80 shadow-2xl mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="font-bold text-gray-800 text-lg mb-1">🌾 Enter Your Crop</h3>
        <p className="text-gray-400 text-sm mb-4">Type the name of your primary crop</p>
        <input
          type="text"
          placeholder="e.g. Jowar, Bajra, Ragi..."
          value={customCrop}
          autoFocus
          onChange={(e) => setCustomCrop(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && customCrop.trim()) {
              setFarmDetails({ ...farmDetails, primaryCrop: customCrop.trim() });
              setShowCropPopup(false);
            }
          }}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowCropPopup(false);
              setCustomCrop('');
              setFarmDetails({ ...farmDetails, primaryCrop: '' });
            }}
            className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-500 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (customCrop.trim()) {
                setFarmDetails({ ...farmDetails, primaryCrop: customCrop.trim() });
                setShowCropPopup(false);
              }
            }}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold"
          >
            ✅ Confirm
          </button>
        </div>
      </motion.div>
    </div>
  )}
</div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Secondary Crops</label>
                  <input type="text" placeholder="e.g. Tomato, Onion"
                    value={farmDetails.secondaryCrops}
                    onChange={(e) => setFarmDetails({ ...farmDetails, secondaryCrops: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Irrigation Type *</label>
                <select value={farmDetails.irrigationType}
                  onChange={(e) => setFarmDetails({ ...farmDetails, irrigationType: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50">
                  <option value="">Select Irrigation Type</option>
                  {IRRIGATION.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fertilizer Usage *</label>
                <select value={farmDetails.fertilizerType}
                  onChange={(e) => setFarmDetails({ ...farmDetails, fertilizerType: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50">
                  <option value="">Select Fertilizer Type</option>
                  {FERTILIZER_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Fertilizer Safety Note */}
              {farmDetails.fertilizerType && (
                <motion.div
                  className={`p-3 rounded-xl text-sm ${
                    farmDetails.fertilizerType.includes('Organic') || farmDetails.fertilizerType.includes('Natural')
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : farmDetails.fertilizerType.includes('Chemical')
                      ? 'bg-red-50 border border-red-200 text-red-600'
                      : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                  }`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  {farmDetails.fertilizerType.includes('Organic') || farmDetails.fertilizerType.includes('Natural')
                    ? '✅ Organic farming — safe for soil and eligible for organic certification schemes'
                    : farmDetails.fertilizerType.includes('Chemical')
                    ? '⚠️ Chemical fertilizers — consider reducing usage for soil health. Check PM-KISAN soil health card scheme'
                    : '💡 Mixed approach — balanced farming. Good for transitioning to organic'}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Farming Experience (Years)</label>
                <input type="number" placeholder="e.g. 10"
                  value={farmDetails.farmingExperience}
                  onChange={(e) => setFarmDetails({ ...farmDetails, farmingExperience: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition">
                  <input type="checkbox"
                    checked={farmDetails.organicCertified}
                    onChange={(e) => setFarmDetails({ ...farmDetails, organicCertified: e.target.checked })}
                    className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">🌿 Organic Certified Farm</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition">
                  <input type="checkbox"
                    checked={farmDetails.soilHealthCard}
                    onChange={(e) => setFarmDetails({ ...farmDetails, soilHealthCard: e.target.checked })}
                    className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">🪪 Have Soil Health Card</span>
                </label>
              </div>

              <motion.button onClick={handleSaveFarm} disabled={saving}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {saving ? '🔄 Saving...' : '✅ Save Farm Details'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <motion.div className="bg-white rounded-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-gray-800 text-lg mb-1">💰 Financial Information</h2>
            <p className="text-gray-400 text-sm mb-4">Used to recommend relevant loan and insurance schemes</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Annual Farm Income (₹)</label>
                  <input type="number" placeholder="e.g. 150000"
                    value={farmDetails.annualIncome}
                    onChange={(e) => setFarmDetails({ ...farmDetails, annualIncome: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Farming Capacity (Quintal/Year)</label>
                  <input type="number" placeholder="e.g. 50"
                    value={farmDetails.farmingCapacity}
                    onChange={(e) => setFarmDetails({ ...farmDetails, farmingCapacity: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-yellow-50 transition mb-3">
                  <input type="checkbox"
                    checked={farmDetails.hasLoan}
                    onChange={(e) => setFarmDetails({ ...farmDetails, hasLoan: e.target.checked })}
                    className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700 font-medium">💳 Currently have an agricultural loan</span>
                </label>

                {farmDetails.hasLoan && (
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Loan Amount (₹)</label>
                      <input type="number" placeholder="e.g. 200000"
                        value={farmDetails.loanAmount}
                        onChange={(e) => setFarmDetails({ ...farmDetails, loanAmount: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Loan Purpose</label>
                      <input type="text" placeholder="e.g. Seeds, Equipment"
                        value={farmDetails.loanPurpose}
                        onChange={(e) => setFarmDetails({ ...farmDetails, loanPurpose: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Scheme Eligibility Preview */}
              {(farmDetails.annualIncome || farmDetails.hasLoan) && (
                <motion.div className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-bold text-blue-800 mb-2">🏛️ Likely Eligible Schemes</h3>
                  <ul className="space-y-1">
                    {parseFloat(farmDetails.annualIncome) < 200000 && (
                      <li className="text-blue-700 text-sm">✅ PM-KISAN — ₹6,000/year income support</li>
                    )}
                    {farmDetails.hasLoan && (
                      <li className="text-blue-700 text-sm">✅ Kisan Credit Card — subsidized credit</li>
                    )}
                    {parseFloat(farmDetails.landSize) <= 2 && (
                      <li className="text-blue-700 text-sm">✅ PM Fasal Bima Yojana — crop insurance</li>
                    )}
                    {farmDetails.fertilizerType?.includes('Organic') && (
                      <li className="text-blue-700 text-sm">✅ Paramparagat Krishi Vikas Yojana — organic farming support</li>
                    )}
                  </ul>
                  <p className="text-blue-500 text-xs mt-2">
                    Complete all details to see full scheme recommendations
                  </p>
                </motion.div>
              )}

              <motion.button onClick={handleSaveFarm} disabled={saving}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {saving ? '🔄 Saving...' : '✅ Save Financial Info'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <motion.button onClick={handleLogout}
          className="w-full mt-4 py-3 border-2 border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-xl transition"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          🚪 Logout
        </motion.button>
      </div>
    </div>
  );
}