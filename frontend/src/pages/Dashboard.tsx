import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const { isLoggedIn, user, fetchUserProfile } = useContext(AppContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      if (fetchUserProfile) {
        fetchUserProfile();
      }
    }
  }, [isLoggedIn, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Username: {user.username}</p>
      <p>User ID: {user.id}</p>
      {/* Render dashboard content */}
    </div>
  );
}
