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

interface Comment {
  id: string;
  text: string;
  user: User;
  replies?: Comment[];
}

const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  const { user, setUser, isLoggedIn } = context;
  const [feed, setFeed] = useState<Post[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [fetchedUserId, setFetchedUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});

  // Fetch user profile
  const fetchUser = async (userId: string) => {
    if (fetchedUserId === userId) return;

    setLoadingUser(true);
    setError(null);

    try {
      const userResponse = await fetch(
        `https://postmatic.onrender.com/api/user/${userId}`
      );
      if (!userResponse.ok) {
        throw new Error(`User fetch failed: ${userResponse.statusText}`);
      }
      const { user: fetchedUser } = await userResponse.json();
      console.log("Fetched user:", fetchedUser);

      setUser(fetchedUser);
      setSelectedUser(fetchedUser);
      setFetchedUserId(userId);
    } catch (err: any) {
      console.error("User fetch error:", err);
      setError("Failed to load user data.");
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch feed
  const fetchFeed = async (userId: string) => {
    setLoadingFeed(true);
    setError(null);

    try {
      const feedResponse = await fetch(
        `https://postmatic.onrender.com/api/feed/${userId}`
      );
      if (!feedResponse.ok) {
        throw new Error(`Feed fetch failed: ${feedResponse.statusText}`);
      }
      const { feed } = await feedResponse.json();
      console.log("Fetched feed:", feed);
      setFeed(feed);
      // Fetch comments for each post
      feed.forEach((post: Post) => {
        fetchComments(post.id);
      });
    } catch (err: any) {
      console.error("Feed fetch error:", err);
      setError("Failed to load feed.");
    } finally {
      setLoadingFeed(false);
    }
  };

  // Fetch reels
  const fetchReels = async (userId: string) => {
    setLoadingReels(true);
    setError(null);

    try {
      const reelsResponse = await fetch(
        `https://postmatic.onrender.com/api/reels/${userId}`
      );
      if (!reelsResponse.ok) {
        throw new Error(`Reels fetch failed: ${reelsResponse.statusText}`);
      }
      const { reels } = await reelsResponse.json();
      console.log("Fetched reels:", reels);
      setReels(reels);
    } catch (err: any) {
      console.error("Reels fetch error:", err);
      setError("Failed to load reels.");
    } finally {
      setLoadingReels(false);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const commentsResponse = await fetch(
        `https://postmatic.onrender.com/api/comments/${postId}` // Assuming you have an endpoint to fetch comments
      );
      if (!commentsResponse.ok) {
        throw new Error(
          `Comments fetch failed: ${commentsResponse.statusText}`
        );
      }
      const { comments: fetchedComments } = await commentsResponse.json();
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: fetchedComments,
      }));
    } catch (err: any) {
      console.error("Comments fetch error:", err);
      setError("Failed to load comments.");
    }
  };

  useEffect(() => {
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
      fetchUser(userId);
    } else if (user && isLoggedIn) {
      fetchUser(user.id);
    } else {
      setError("Please log in");
      navigate("/");
    }
  }, []);

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
      if (!response.ok) {
        throw new Error(`Comment failed: ${response.statusText}`);
      }
      console.log("Comment posted for post:", postId);
      setCommentInput({ ...commentInput, [postId]: "" });
      // Refresh comments after posting
      fetchComments(postId);
    } catch (err: any) {
      setError("Failed to post comment");
      console.error("Comment error:", err);
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!user || !replyInput[commentId]) return;

    try {
      const response = await fetch(
        `https://postmatic.onrender.com/api/comment/${commentId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            message: replyInput[commentId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Reply failed: ${response.statusText}`);
      }
      console.log("Reply posted for comment:", commentId);
      setReplyInput({ ...replyInput, [commentId]: "" });
      // Refresh comments after posting a reply
      const postId = Object.keys(comments).find((key) =>
        comments[key]?.find((comment) => comment.id === commentId)
      );
      if (postId) {
        fetchComments(postId);
      }
    } catch (err: any) {
      setError("Failed to post reply");
      console.error("Reply error:", err);
    }
  };

  const handleProfileClick = (userData: User) => {
    setSelectedUser(userData);
  };

  if (loadingUser) {
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
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-1">
          {selectedUser && (
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-2xl font-semibold mb-4">Profile</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUser.picture?.data.url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-medium">{selectedUser.name}</h3>
                  <p className="text-gray-600">
                    {selectedUser.email || "No email provided"}
                  </p>
                  <p className="text-gray-500">ID: {selectedUser.id}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => fetchFeed(selectedUser.id)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loadingFeed}
                >
                  {loadingFeed ? "View Feed" : "Loading Feed..."}
                </button>
                <button
                  onClick={() => fetchReels(selectedUser.id)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loadingReels}
                >
                  {loadingReels ? "View Reels" : "Loading Reels..."}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feed and Reels Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Feed Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Feed</h2>
            {loadingFeed ? (
              <p className="text-gray-500">Loading feed...</p>
            ) : feed.length === 0 ? (
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
                      className="mt-2 max-w-md rounded mx-auto"
                    />
                  ) : (
                    <video
                      src={post.media_url}
                      controls
                      className="mt-2 max-w-md rounded mx-auto"
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

                  {/* Display Comments and Replies */}
                  <div className="mt-4">
                    {comments[post.id] &&
                      comments[post.id].map((comment) => (
                        <div
                          key={comment.id}
                          className="mt-2 p-2 bg-gray-100 rounded"
                        >
                          <p>
                            {comment.text}
                            <span className="text-sm text-gray-500">
                              {" "}
                              — {comment.user.name}
                            </span>
                          </p>
                          {comment.replies &&
                            comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="mt-1 ml-4 p-2 bg-gray-50 rounded"
                              >
                                <p>
                                  {reply.text}
                                  <span className="text-sm text-gray-500">
                                    {" "}
                                    — {reply.user.name}
                                  </span>
                                </p>
                              </div>
                            ))}

                          {/* Reply Input */}
                          <div className="mt-2">
                            <input
                              type="text"
                              value={replyInput[comment.id] || ""}
                              onChange={(e) =>
                                setReplyInput({
                                  ...replyInput,
                                  [comment.id]: e.target.value,
                                })
                              }
                              placeholder="Write a reply..."
                              className="w-full p-2 border rounded"
                            />
                            <button
                              onClick={() => handleReplySubmit(comment.id)}
                              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reels Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reels</h2>
            {loadingReels ? (
              <p className="text-gray-500">Loading reels...</p>
            ) : reels.length === 0 ? (
              <p className="text-gray-500">No reels available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleProfileClick(user!)}
                    >
                      {user?.name}
                    </p>
                    <p className="text-gray-600">
                      {reel.caption || "No caption"}
                    </p>
                    <img
                      src={reel.media_url}
                      alt="Reel"
                      className="mt-2 max-w-xs aspect-[9/16] rounded mx-auto"
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
      </div>
    </div>
  );
};

export default Dashboard;
