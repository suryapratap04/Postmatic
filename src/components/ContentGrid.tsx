import React from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Play } from 'lucide-react';

interface ContentGridProps {
  content: Post[];
  type: 'feed' | 'reels';
}

export const ContentGrid: React.FC<ContentGridProps> = ({ content, type }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {content.map((item) => (
        <div
          key={item.id}
          className="relative group overflow-hidden rounded-lg aspect-square"
        >
          <img
            src={item.media_url || item.image}
            alt={item.caption}
            className="w-full h-full object-cover"
          />
          {type === 'reels' && (
            <div className="absolute top-4 right-4">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white flex space-x-6">
              <div className="flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                <span>{item.likes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                <span>{item.comments}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};