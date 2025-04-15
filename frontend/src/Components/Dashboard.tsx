// dashboard.jsx (React example)
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("No user exists");
    }
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Dashboard</h1>
      {token ? (
        <div>
          <h3>Welcome!</h3>
          <p>Token: {token}</p>
        </div>
      ) : (
        <div>
          <h3>{error || "Loading..."}</h3>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
