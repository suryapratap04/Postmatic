import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function LoginModal() {
  const context = useContext(AppContext);
  if (!context) return null;
  const { handleLogin, setShowLoginModal } = context;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Login to Instagram</h2>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login with Instagram
        </button>
        <button
          onClick={() => setShowLoginModal(false)}
          className="mt-2 text-sm text-gray-500 block"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
