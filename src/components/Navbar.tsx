import React from 'react';
import { Instagram, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onLoginClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <Instagram className="h-8 w-8 text-pink-600" />
            <span className="ml-2 text-xl font-semibold">Instagram Clone</span>
          </Link>
          <div>
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700">
                  {user.username}
                </Link>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-8 w-8 rounded-full border border-gray-200"
                />
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <LogIn size={20} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};