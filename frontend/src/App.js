import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import MandiOptimizer from './pages/MandiOptimizer';
import ProfitTracker from './pages/ProfitTracker';
import Schemes from './pages/Schemes';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/mandi" element={<MandiOptimizer />} />
          <Route path="/profit" element={<ProfitTracker />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;