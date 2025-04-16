import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ProfileCard() {
  const { user } = useContext(AppContext)!;

  if (!user) return null;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">{user.username}</h2>
      <p>Account Type: {user.account_type || "N/A"}</p>
      <p>Media Count: {user.media_count}</p>
    </div>
  );
}
