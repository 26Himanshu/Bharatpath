import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color) => L.divIcon({
  html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
  className: ''
});

const goldIcon = createIcon('#f59e0b');
const greenIcon = createIcon('#16a34a');
const blueIcon = createIcon('#2563eb');

const MANDIS = [
  { name: "Azadpur Mandi", city: "Delhi", state: "Delhi", lat: 28.7196, lng: 77.1836, crops: ["Wheat", "Rice", "Tomato", "Onion"], type: "major" },
  { name: "Narela Mandi", city: "Delhi", state: "Delhi", lat: 28.8528, lng: 77.0924, crops: ["Wheat", "Rice", "Potato"], type: "major" },
  { name: "Shahdara Mandi", city: "Delhi", state: "Delhi", lat: 28.6692, lng: 77.2907, crops: ["Vegetable", "Fruit"], type: "regular" },
  { name: "Ghazipur Mandi", city: "Delhi", state: "Delhi", lat: 28.6279, lng: 77.3178, crops: ["Flower", "Vegetable"], type: "regular" },
  { name: "Vashi APMC", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0660, lng: 73.0002, crops: ["Rice", "Tomato", "Onion", "Potato"], type: "major" },
  { name: "Gultekdi Mandi", city: "Pune", state: "Maharashtra", lat: 18.4862, lng: 73.8563, crops: ["Onion", "Tomato", "Wheat"], type: "major" },
  { name: "Lasalgaon Mandi", city: "Nashik", state: "Maharashtra", lat: 20.1167, lng: 74.1667, crops: ["Onion"], type: "major" },
  { name: "Nagpur Mandi", city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, crops: ["Orange", "Cotton", "Wheat"], type: "major" },
  { name: "Koyambedu APMC", city: "Chennai", state: "Tamil Nadu", lat: 13.0726, lng: 80.1925, crops: ["Rice", "Tomato", "Onion"], type: "major" },
  { name: "Bowenpally Mandi", city: "Hyderabad", state: "Telangana", lat: 17.4785, lng: 78.4980, crops: ["Rice", "Tomato", "Onion"], type: "major" },
  { name: "Yeshwanthpur APMC", city: "Bengaluru", state: "Karnataka", lat: 13.0275, lng: 77.5484, crops: ["Tomato", "Onion", "Potato"], type: "major" },
  { name: "Mhow APMC", city: "Indore", state: "Madhya Pradesh", lat: 22.5555, lng: 75.7639, crops: ["Wheat", "Soyabean", "Mustard"], type: "major" },
  { name: "Sailana APMC", city: "Ratlam", state: "Madhya Pradesh", lat: 23.3316, lng: 74.9330, crops: ["Wheat", "Mustard"], type: "regular" },
  { name: "Bhopal Mandi", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, crops: ["Wheat", "Soyabean"], type: "regular" },
  { name: "Patna Mandi", city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376, crops: ["Rice", "Wheat", "Maize"], type: "major" },
  { name: "Lucknow Mandi", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, crops: ["Wheat", "Rice", "Potato"], type: "major" },
  { name: "Kanpur Mandi", city: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, crops: ["Wheat", "Potato", "Onion"], type: "major" },
  { name: "Agra Mandi", city: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, crops: ["Potato", "Wheat"], type: "regular" },
  { name: "Jaipur Mandi", city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, crops: ["Mustard", "Wheat", "Onion"], type: "major" },
  { name: "Ahmedabad APMC", city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, crops: ["Cotton", "Wheat", "Onion"], type: "major" },
  { name: "Surat APMC", city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311, crops: ["Sugarcane", "Cotton"], type: "regular" },
  { name: "Kolkata Mandi", city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, crops: ["Rice", "Potato", "Onion"], type: "major" },
  { name: "Chandigarh Mandi", city: "Chandigarh", state: "Punjab", lat: 30.7333, lng: 76.7794, crops: ["Wheat", "Rice", "Potato"], type: "regular" },
  { name: "Amritsar Mandi", city: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723, crops: ["Wheat", "Rice"], type: "major" },
  { name: "Jobat APMC", city: "Alirajpur", state: "Madhya Pradesh", lat: 22.4167, lng: 74.5667, crops: ["Wheat", "Maize"], type: "regular" },
];

const CROPS = ['All', 'Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane', 'Maize', 'Soyabean'];
const STATES = ['All', 'Delhi', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal', 'Tamil Nadu', 'Telangana', 'Karnataka', 'Bihar', 'Punjab'];

export default function MandiMap() {
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedMandi, setSelectedMandi] = useState(null);

  const filtered = MANDIS.filter(m => {
    const cropMatch = selectedCrop === 'All' || m.crops.includes(selectedCrop);
    const stateMatch = selectedState === 'All' || m.state === selectedState;
    return cropMatch && stateMatch;
  });

  const getIcon = (mandi) => {
    if (selectedMandi?.name === mandi.name) return goldIcon;
    return mandi.type === 'major' ? greenIcon : blueIcon;
  };

  const mapCenter = selectedState !== 'All' && filtered.length > 0
    ? [filtered[0].lat, filtered[0].lng]
    : [22.9734, 78.6569];

  const mapZoom = selectedState !== 'All' ? 7 : 5;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-1">🗺️ Nearby Mandis Map</h1>
            <p className="text-green-100">Find agricultural markets near your location</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="flex items-center space-x-1 text-sm text-green-200">
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                <span>Major Mandi</span>
              </span>
              <span className="flex items-center space-x-1 text-sm text-green-200">
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
                <span>Regular Mandi</span>
              </span>
              <span className="flex items-center space-x-1 text-sm text-green-200">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                <span>Selected</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Filters */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3">🔍 Find Mandis Near You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                📍 Select Your State
              </label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedMandi(null); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                🌾 Filter by Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => { setSelectedCrop(e.target.value); setSelectedMandi(null); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 w-full text-center">
                <p className="text-green-700 font-bold text-2xl">{filtered.length}</p>
                <p className="text-green-600 text-sm">Mandis Found</p>
                {selectedState !== 'All' && (
                  <p className="text-green-500 text-xs mt-1">in {selectedState}</p>
                )}
              </div>
            </div>
          </div>

          {selectedState === 'All' && (
            <motion.div
              className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-yellow-700 text-sm">
                💡 <strong>Tip:</strong> Select your state above to find mandis near you!
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '500px' }}>
              <MapContainer
                key={`${selectedState}-${selectedCrop}`}
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map((mandi, i) => (
                  <Marker
                    key={i}
                    position={[mandi.lat, mandi.lng]}
                    icon={getIcon(mandi)}
                    eventHandlers={{ click: () => setSelectedMandi(mandi) }}
                  >
                    <Popup>
                      <div className="p-1">
                        <h3 className="font-bold text-green-700">{mandi.name}</h3>
                        <p className="text-gray-600 text-sm">📍 {mandi.city}, {mandi.state}</p>
                        <p className="text-gray-500 text-xs mt-1">🌾 {mandi.crops.join(', ')}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          mandi.type === 'major' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {mandi.type === 'major' ? '⭐ Major Mandi' : 'Regular Mandi'}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Mandi List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-green-50">
              <h3 className="font-bold text-gray-800">📋 Mandi List</h3>
              <p className="text-gray-500 text-xs">Click to highlight on map</p>
            </div>
            <div className="overflow-y-auto" style={{ height: '450px' }}>
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <span className="text-4xl block mb-2">🗺️</span>
                  <p className="text-sm">No mandis found for selected filters</p>
                </div>
              ) : (
                filtered.map((mandi, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedMandi(mandi)}
                    className={`p-3 border-b border-gray-100 cursor-pointer transition hover:bg-green-50 ${
                      selectedMandi?.name === mandi.name ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                    }`}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{mandi.name}</p>
                        <p className="text-gray-500 text-xs">📍 {mandi.city}, {mandi.state}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          🌾 {mandi.crops.slice(0, 2).join(', ')}{mandi.crops.length > 2 ? '...' : ''}
                        </p>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                        mandi.type === 'major' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {mandi.type === 'major' ? '⭐' : '•'}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Mandi Details */}
        {selectedMandi && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-yellow-200 p-5 mt-4 border-l-4 border-l-yellow-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-gray-800 text-lg mb-3">📍 {selectedMandi.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-xs">City</p>
                <p className="font-medium text-gray-800">{selectedMandi.city}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">State</p>
                <p className="font-medium text-gray-800">{selectedMandi.state}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Type</p>
                <p className="font-medium text-gray-800 capitalize">{selectedMandi.type} Mandi</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Crops Available</p>
                <p className="font-medium text-gray-800">{selectedMandi.crops.join(', ')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}