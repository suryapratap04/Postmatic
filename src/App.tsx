import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { Dashboard } from './components/Dashboard';
import { HomePage } from './components/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginModal isOpen={true} onClose={() => {}} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;