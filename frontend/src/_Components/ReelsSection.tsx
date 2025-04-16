// src/components/ReelsSection.tsx
import React from "react";

interface Reel {
  id: string;
  media_url: string;
  caption?: string;
}

interface User {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  picture?: { data: { url: string } };
}

interface ReelsSectionProps {
  reels: Reel[];
  loading: boolean;
  error: string | null;
  user: User | null;
  commentInput: { [key: string]: string };
  handleCommentChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    reelId: string
  ) => void;
  handleCommentSubmit: (reelId: string) => void;
}

const ReelsSection: React.FC<ReelsSectionProps> = ({
  reels,
  loading,
  error,
  user,
  commentInput,
  handleCommentChange,
  handleCommentSubmit,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reels</h2>
      {loading ? (
        <p className="text-gray-500">Loading reels...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : reels.length === 0 ? (
        <p className="text-gray-500">No reels available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reels.map((reel) => (
            <div key={reel.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-500 cursor-pointer font-semibold">
                  {user?.username}
                </span>
              </div>
              <p className="text-gray-600">{reel.caption || "No caption"}</p>
              <img
                src={reel.media_url}
                alt="Reel"
                className="mt-2 max-w-xs aspect-[9/16] rounded mx-auto"
              />
              <div className="mt-4">
                <input
                  type="text"
                  value={commentInput[reel.id] || ""}
                  onChange={(e) => handleCommentChange(e, reel.id)}
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
  );
};

export default ReelsSection;
