import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email?: string;
  picture?: { data: { url: string } };
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
    const redirectUri = "https://your-backend.onrender.com/auth/callback";
    const instagramAuthUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${1384533765881235}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=instagram_basic,instagram_content_publish,instagram_manage_comments&response_type=code`;
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
