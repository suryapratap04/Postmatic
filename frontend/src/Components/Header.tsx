import { Instagram, LogOut } from "lucide-react";
import LoginModal from "./LoginModal";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export default function Header() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }

  const {
    isLoggedIn,
    setShowLoginModal,
    showLoginModal,
    handleLogin,
    onLogout,
    currentUser,
  } = context;

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Instagram className="h-8 w-8" />
          <span className="text-xl font-semibold hidden sm:inline">
            Empathy Assignment
          </span>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Logged in as{" "}
              <span className="font-semibold">{currentUser?.username}</span>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 rounded-lg transition bg-blue-500 hover:bg-blue-600 text-white"
          >
            Login
          </button>
        )}
        {showLoginModal && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    </header>
  );
}
