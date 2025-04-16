import Sidebar from "../components/Sidebar";
import MediaFeed from "../components/MediaFeed";
import ProfileCard from "../components/ProfileCard";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const { user } = useContext(AppContext)!;

  if (!user) return <p>Please login first.</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-3/4 p-6">
        <ProfileCard />
        <MediaFeed />
      </div>
    </div>
  );
}
