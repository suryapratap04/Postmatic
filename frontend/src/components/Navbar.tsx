import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { isLoggedIn, onLogout } = useContext(AppContext)!;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="text-xl">
            Home
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={onLogout} className="text-xl">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-xl">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
