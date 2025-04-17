import Media from "../components/Media";
import Profile from "../components/Profile";

export default function Dashboard() {
  return (
    <div>
      <h1>DashBoard</h1>
      <div>
        <Profile />
      </div>
      <div>
        <Media />
      </div>
    </div>
  );
}
