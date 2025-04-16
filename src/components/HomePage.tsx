import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feed } from './Feed';

const dummyPosts = [
  {
    id: '1',
    user: {
      username: 'photography_lover',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    },
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=600&fit=crop',
    caption: 'Beautiful sunset at the beach',
    likes: 1234,
    comments: 56,
  },
  {
    id: '2',
    user: {
      username: 'foodie_adventures',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    caption: 'Perfect brunch spot discovered!',
    likes: 892,
    comments: 43,
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleInteraction = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Welcome to Instagram Clone
      </h1>
      <Feed posts={dummyPosts} onInteraction={handleInteraction} />
    </div>
  );
};