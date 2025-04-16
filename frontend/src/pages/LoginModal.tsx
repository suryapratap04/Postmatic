import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function LoginModal() {
  const { setShowLoginModal, handleLogin } = useContext(AppContext) || {};

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        <p className="text-center mb-6 text-gray-600">
          Please log in to continue.
        </p>
        <div className="flex justify-center mb-4">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 w-full"
          >
            Login with Instagram
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setShowLoginModal?.(false)}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
