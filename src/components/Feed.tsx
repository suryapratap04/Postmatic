import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';

interface FeedProps {
  posts: Post[];
  onInteraction: () => void;
}

export const Feed: React.FC<FeedProps> = ({ posts, onInteraction }) => {
  const { user } = useAuth();

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      onInteraction();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 flex items-center">
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2 font-medium">{post.user.username}</span>
          </div>
          <img
            src={post.image}
            alt="Post"
            className="w-full object-cover"
            style={{ maxHeight: '600px' }}
            onClick={handleInteraction}
          />
          <div className="p-4">
            <div className="flex space-x-4 mb-2">
              <button
                onClick={handleInteraction}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart size={24} />
              </button>
              <button
                onClick={handleInteraction}
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle size={24} />
              </button>
            </div>
            <div className="font-medium">{post.likes} likes</div>
            <p>
              <span className="font-medium">{post.user.username}</span>{' '}
              {post.caption}
            </p>
            <button
              onClick={handleInteraction}
              className="text-gray-500 mt-1"
            >
              View all {post.comments} comments
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};