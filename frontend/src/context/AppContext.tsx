import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
}

export interface MediaItem {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
}

export interface PagingCursors {
  before: string;
  after: string;
}

export interface Paging {
  cursors: PagingCursors;
}

export interface MediaResponse {
  data: MediaItem[];
  paging: Paging;
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: (user: User | null) => void;
  onLogout: () => void;
  handleLogin: () => void;
  media: MediaResponse | null;
  setMedia: React.Dispatch<React.SetStateAction<MediaResponse | null>>;
}

export const AppContext = createContext<AppContextType | null>(null);

interface AppContextProviderProps {
  children: ReactNode;
}

export default function AppContextProvider({
  children,
}: AppContextProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [media, setMedia] = useState<MediaResponse | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserState(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    setIsLoggedIn(!!newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const onLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setShowLoginModal(false);
  };

  const handleLogin = () => {
    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=680962664344617&redirect_uri=https://postmatic.onrender.com/auth/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
    window.location.href = instagramAuthUrl;
  };

  const value: AppContextType = {
    isLoggedIn,
    setIsLoggedIn,
    showLoginModal,
    setShowLoginModal,
    user,
    setUser,
    onLogout,
    handleLogin,
    media,
    setMedia,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
