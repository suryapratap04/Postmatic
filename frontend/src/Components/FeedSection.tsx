// src/components/FeedSection.tsx
import React from "react";

interface Post {
  id: string;
  caption?: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO";
  timestamp: string;
}

interface User {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  picture?: { data: { url: string } };
}

interface FeedSectionProps {
  feed: Post[];
  loading: boolean;
  error: string | null;
  user: User | null;
  commentInput: { [key: string]: string };
  handleCommentChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    postId: string
  ) => void;
  handleCommentSubmit: (postId: string) => void;
  comments: { [key: string]: any[] };
}

const FeedSection: React.FC<FeedSectionProps> = ({
  feed,
  loading,
  error,
  user,
  commentInput,
  handleCommentChange,
  handleCommentSubmit,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Feed</h2>
      {loading ? (
        <p className="text-gray-500">Loading feed...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : feed.length === 0 ? (
        <p className="text-gray-500">No posts available.</p>
      ) : (
        feed.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500 cursor-pointer font-semibold">
                {user?.username}
              </span>
              <span className="text-gray-600">
                {new Date(post.timestamp).toLocaleString()}
              </span>
            </div>
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
                onChange={(e) => handleCommentChange(e, post.id)}
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
  );
};

export default FeedSection;
