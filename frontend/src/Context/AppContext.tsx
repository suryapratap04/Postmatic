import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
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
  fetchUserProfile: () => Promise<void>;
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
  const INSTAGRAM_APP_ID = 1384533765881235;
  const redirectUri = "https://postmatic.onrender.com/auth/callback";

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
    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=instagram_business_basic,instagram_business_content_publish,instagram_business_manage_comments&response_type=code`;
    window.location.href = instagramAuthUrl;
  };

  const fetchUserProfile = async () => {
    const userId = new URLSearchParams(window.location.search).get("user_id");
    if (userId) {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const value: AppContextType = {
    isLoggedIn,
    setIsLoggedIn,
    showLoginModal,
    setShowLoginModal,
    user,
    setUser,
    onLogout,
    handleLogin,
    fetchUserProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
