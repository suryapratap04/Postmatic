export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
  account_type?: string;
  media_count?: number;
}

export interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

export interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoggedIn: boolean;
}