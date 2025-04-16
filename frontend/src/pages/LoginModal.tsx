import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, handleLogin } =
    useContext(AppContext) || {};

  if (!showLoginModal)
    return (
      <div className="modal">
        <div className="modal-content">
          <h1>NOt having content</h1>
        </div>
      </div>
    );
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Login</h2>
        <button onClick={handleLogin}>Login with Instagram</button>
        <button onClick={() => setShowLoginModal?.(false)}>Close</button>
      </div>
    </div>
  );
}
