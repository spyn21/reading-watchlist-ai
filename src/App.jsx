import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // ✅
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Navbar /> {/* ✅ Navbar should appear on every page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;