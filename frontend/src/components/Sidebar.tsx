import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-1/4 bg-gray-200 h-full p-6">
      <ul>
        <li>
          <Link to="/dashboard" className="text-xl">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile" className="text-xl">
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}
