// src/Components/Dashboard.tsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  caption?: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO";
  timestamp: string;
}

interface Reel {
  id: string;
  media_url: string;
  caption?: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  picture?: { data: { url: string } };
}

const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  const { user, setUser, isLoggedIn } = context;
  const [feed, setFeed] = useState<Post[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (userId: string) => {
      setLoading(true);
      try {
        // Fetch user profile
        const userResponse = await fetch(
          `https://postmatic.onrender.com/api/user/${userId}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user");
        const { user: fetchedUser } = await userResponse.json();
        setUser(fetchedUser);
        setSelectedUser(fetchedUser);

        // Fetch feed (Instagram media)
        const feedResponse = await fetch(
          `https://postmatic.onrender.com/api/feed/${userId}`
        );
        if (!feedResponse.ok) throw new Error("Failed to fetch feed");
        const { feed } = await feedResponse.json();
        setFeed(feed);

        // Fetch reels
        const reelsResponse = await fetch(
          `https://postmatic.onrender.com/api/reels/${userId}`
        );
        if (!reelsResponse.ok) throw new Error("Failed to fetch reels");
        const { reels } = await reelsResponse.json();
        setReels(reels);

        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (window.location.hash === "#_=_") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    if (userId) {
      fetchData(userId);
    } else if (user && isLoggedIn) {
      fetchData(user.id);
    } else {
      setError("Please log in");
      setLoading(false);
      navigate("/");
    }
  }, [setUser, navigate, user, isLoggedIn]);

  const handleCommentSubmit = async (postId: string) => {
    if (!user || !commentInput[postId]) return;

    try {
      const response = await fetch(
        `https://postmatic.onrender.com/api/comment/${postId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            message: commentInput[postId],
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to post comment");
      setCommentInput({ ...commentInput, [postId]: "" });
    } catch (err) {
      setError("Failed to post comment");
      console.error(err);
    }
  };

  const handleProfileClick = (userData: User) => {
    setSelectedUser(userData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h3 className="text-red-500">{error}</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Profile Section */}
      {selectedUser && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="flex items-center space-x-4">
            {selectedUser.picture && (
              <img
                src={selectedUser.picture.data.url}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-xl font-medium">{selectedUser.name}</h3>
              <p className="text-gray-600">
                {selectedUser.email || "No email provided"}
              </p>
              <p className="text-gray-500">ID: {selectedUser.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feed Section */}
      <div className="max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl font-semibold mb-4">Feed</h2>
        {feed.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          feed.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <p
                className="text-blue-500 cursor-pointer"
                onClick={() => handleProfileClick(user!)}
              >
                {user?.name}
              </p>
              <p className="text-gray-600">
                {new Date(post.timestamp).toLocaleString()}
              </p>
              <p className="mt-2">{post.caption || "No caption"}</p>
              {post.media_type === "IMAGE" ? (
                <img
                  src={post.media_url}
                  alt="Post"
                  className="mt-2 max-w-full rounded"
                />
              ) : (
                <video
                  src={post.media_url}
                  controls
                  className="mt-2 w-full rounded"
                />
              )}
              <div className="mt-4">
                <input
                  type="text"
                  value={commentInput[post.id] || ""}
                  onChange={(e) =>
                    setCommentInput({
                      ...commentInput,
                      [post.id]: e.target.value,
                    })
                  }
                  placeholder="Write a comment..."
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Comment
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reels Section */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Reels</h2>
        {reels.length === 0 ? (
          <p className="text-gray-500">No reels available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reels.map((reel) => (
              <div key={reel.id} className="bg-white p-4 rounded-lg shadow-md">
                <p
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleProfileClick(user!)}
                >
                  {user?.name}
                </p>
                <p className="text-gray-600">{reel.caption || "No caption"}</p>
                <video
                  src={reel.media_url}
                  controls
                  className="mt-2 w-full rounded"
                />
                <div className="mt-4">
                  <input
                    type="text"
                    value={commentInput[reel.id] || ""}
                    onChange={(e) =>
                      setCommentInput({
                        ...commentInput,
                        [reel.id]: e.target.value,
                      })
                    }
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => handleCommentSubmit(reel.id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
