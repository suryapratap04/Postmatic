import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { Loader2, Grid, Film } from 'lucide-react';
import { Profile } from './Profile';

interface DashboardProps {
  userId?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'reels'>('feed');
  const [content, setContent] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab, userId]);

  const fetchContent = async (type: 'feed' | 'reels') => {
    setLoading(true);
    try {
      const endpoint = type === 'feed' ? 'feed' : 'reels';
      const response = await fetch(`/api/${endpoint}/${userId || user?.id}`);
      const data = await response.json();
      setContent(type === 'feed' ? data.feed : data.reels);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Profile />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center px-6 py-3 rounded-full transition-colors ${
            activeTab === 'feed'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Grid className="w-5 h-5 mr-2" />
          Feed
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center px-6 py-3 rounded-full transition-colors ${
            activeTab === 'reels'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Film className="w-5 h-5 mr-2" />
          Reels
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <ContentGrid content={content} type={activeTab} />
      )}
    </div>
  );
};