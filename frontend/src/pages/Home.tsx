import { Heart, MessageCircle } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { mockUser, mockPosts, mockReels, mockUsers } from "../data/mock";

export default function Home() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }

  const { isLoggedIn, setShowLoginModal, user } = context;
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
  const [commentInput, setCommentInput] = useState<{
    [key: string]: string;
  }>({});
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isLoggedIn && user) {
      navigate(`/dashboard?userId=${user.id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleCommentClick = (postId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      console.log(`Comment on post ${postId}: ${commentInput[postId]}`);
      setCommentInput({ ...commentInput, [postId]: "" });
    }
  };
  console.log("Priting the use");
  return (
      <main className="pt-20 pb-6 max-w-3xl mx-auto px-4">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={mockUser?.profilePicture}
              alt={"Profile"}
              className={`rounded-full border-2 border-white bg-gray-100 object-cover `}
              style={{
                width: 80,
                height: 80,
                minWidth: 80,
                minHeight: 80,
              }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h2
                  className="text-xl font-semibold  text-black cursor-pointer hover:underline"
                  onClick={handleProfileClick}
                >
                  {mockUser.fullName}
                </h2>
              </div>
              <div className="flex space-x-6 text-sm text-gray-600 mb-2">
                <span>
                  <strong>{mockUser.posts}</strong> posts
                </span>
                <span>
                  <strong>{mockUser.followers}</strong> followers
                </span>
                <span>
                  <strong>{mockUser.following}</strong> following
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{mockUser.fullName}</p>
                <p className="text-sm text-gray-600">{mockUser.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex justify-center space-x-8 text-sm font-medium text-gray-500">
            <button
              className={`py-3 px-4 border-t-2 ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={`py-3 px-4 border-t-2 ${
                activeTab === "reels"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reels")}
            >
              Reels
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "posts" ? (
          <div className="space-y-6 mt-4">
            {mockPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className="cursor-pointer"
                      onClick={handleProfileClick}
                    >
                      <img
                        src={mockUsers?.user123?.profilePicture}
                        alt={"Profile"}
                        className={`rounded-full border-2 border-white bg-gray-100 object-cover `}
                        style={{
                          width: 50,
                          height: 50,
                          minWidth: 50,
                          minHeight: 50,
                        }}
                      />
                    </div>
                    <p
                      className="text-xl font-semibold text-black cursor-pointer hover:underline"
                      onClick={handleProfileClick}
                    >
                      {mockUsers?.user123?.fullName}
                    </p>
                  </div>
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full max-w-md aspect-square object-cover rounded mx-auto"
                    onLoad={() =>
                      console.log("Post image loaded:", post.imageUrl)
                    }
                  />
                  <div className="mt-3">
                    <div className="flex items-center space-x-4 text-gray-600">
                      <Heart className="h-6 w-6 cursor-pointer" />
                      <MessageCircle className="h-6 w-6 cursor-pointer" />
                    </div>
                    <p className="text-sm font-semibold mt-2">
                      {post.likes} likes
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">
                        {mockUsers[post.userId]?.username}
                      </span>{" "}
                      {post.caption}
                    </p>
                    {post.comments.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="space-y-1">
                            <div className="flex space-x-2">
                              <span className="font-semibold">
                                {comment.username}
                              </span>
                              <span>{comment.text}</span>
                            </div>
                            {comment.replies?.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex space-x-2 ml-4"
                              >
                                <span className="font-semibold">
                                  {reply.username}
                                </span>
                                <span>{reply.text}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <input
                        type="text"
                        value={commentInput[post.id] || ""}
                        onChange={(e) =>
                          setCommentInput({
                            ...commentInput,
                            [post.id]: e.target.value,
                          })
                        }
                        onClick={() => handleCommentClick(post.id)}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleCommentClick(post.id)}
                        className="text-blue-500 text-sm font-semibold"
                      >
                        Post
                      </button>
                    </div>
                    {!isLoggedIn && (
                      <p
                        className="text-sm text-blue-500 cursor-pointer mt-1 hover:underline"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Login to comment
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {mockReels.map((reel) => (
              <div key={reel.id} className="bg-white rounded-lg shadow-md">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className="cursor-pointer"
                      onClick={handleProfileClick}
                    >
                      <img
                        src={mockUsers?.user123?.profilePicture}
                        alt={mockUsers?.user123?.fullName}
                        className={`rounded-full border-2 border-white bg-gray-100 object-cover `}
                        style={{
                          width: 50,
                          height: 50,
                          minWidth: 50,
                          minHeight: 50,
                        }}
                      />
                    </div>
                    <p
                      className="text-xl font-semibold text-black cursor-pointer hover:underline"
                      onClick={handleProfileClick}
                    >
                      {mockUsers?.user123?.fullName}
                    </p>
                  </div>
                  <img
                    src={reel.thumbnail}
                    alt="Reel thumbnail"
                    className="w-full max-w-xs aspect-[9/16] object-cover rounded mx-auto"
                    onLoad={() =>
                      console.log("Reel thumbnail loaded:", reel.thumbnail)
                    }
                  />
                  <div className="mt-3">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {mockUsers[reel.userId]?.username}
                      </span>{" "}
                      {reel.caption}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {reel.views} views
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <input
                        type="text"
                        value={commentInput[reel.id] || ""}
                        onChange={(e) =>
                          setCommentInput({
                            ...commentInput,
                            [reel.id]: e.target.value,
                          })
                        }
                        onClick={() => handleCommentClick(reel.id)}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleCommentClick(reel.id)}
                        className="text-blue-500 text-sm font-semibold"
                      >
                        Post
                      </button>
                    </div>
                    {!isLoggedIn && (
                      <p
                        className="text-sm text-blue-500 cursor-pointer mt-1 hover:underline"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Login to comment
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
  );
}
