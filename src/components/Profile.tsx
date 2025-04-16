import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Camera, Video } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/user/${user.id}`);
        const data = await response.json();
        setStats({
          posts: data.user.media_count || 0,
          followers: Math.floor(Math.random() * 1000), // Dummy data
          following: Math.floor(Math.random() * 500), // Dummy data
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center space-x-8">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="w-32 h-32 rounded-full border-2 border-purple-500 p-1"
        />
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-gray-600">{user?.account_type}</p>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="font-bold text-xl">{stats.posts}</div>
              <div className="text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">{stats.followers}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">{stats.following}</div>
              <div className="text-gray-600">Following</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};