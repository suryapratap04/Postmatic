import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Insta Dashboard</h1>
      <p className="mb-6 text-gray-600">
        View your Instagram profile, reels, and feed in one place.
      </p>
      <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded">
        Login with Instagram
      </Link>
    </div>
  );
}
