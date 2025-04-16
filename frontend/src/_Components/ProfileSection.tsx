// src/components/ProfileSection.tsx
import React from "react";

interface User {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  picture?: { data: { url: string } };
}

interface ProfileSectionProps {
  user: User | null;
  loading: boolean;
  fetchFeed: (userId: string) => void;
  fetchReels: (userId: string) => void;
  selectedUser: User | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  loading,
  fetchFeed,
  fetchReels,
  selectedUser,
}) => {
  return (
    <div className="md:col-span-1">
      {selectedUser && (
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="flex items-center space-x-4">
            {selectedUser.picture?.data?.url ? (
              <img
                src={selectedUser.picture?.data?.url}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span>No Image</span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium">{selectedUser.username}</h3>
              <p className="text-gray-600">
                {selectedUser.account_type || "No account type provided"}
              </p>
              <p className="text-gray-500">ID: {selectedUser.id}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button
              onClick={() => fetchFeed(selectedUser.id)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Loading Feed..." : "View Feed"}
            </button>
            <button
              onClick={() => fetchReels(selectedUser.id)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Loading Reels..." : "View Reels"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
