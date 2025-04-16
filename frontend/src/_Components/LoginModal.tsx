import React, { useContext } from "react";
import { Instagram, X } from "lucide-react";
import { AppContext } from "../context/AppContext";

const LoginModal: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { handleLogin, setShowLoginModal } = context;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Login Required</h2>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="text-center mb-8">
          <Instagram className="h-16 w-16 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Login with Instagram to like, comment, and interact with posts
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Login with Instagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
