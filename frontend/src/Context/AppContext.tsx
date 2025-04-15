import { createContext, useState, ReactNode } from "react";

interface CurrentUser {
  username: string;
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: CurrentUser;
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
  const currentUser = {
    username: "suryapratap04",
  };

  const onLogout = () => {
    setIsLoggedIn(false);
  };
  const handleLogin = async () => {
    // setIsLoggedIn(true);
    // setShowLoginModal(false);
    const redirectUri = `${process.env.REACT_APP_BACKEND_URL}/auth/callback`;
    const instagramAuthUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${
      process.env.REACT_APP_FACEBOOK_APP_ID
    }&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=instagram_basic,instagram_content_publish,instagram_manage_comments&response_type=code`;
    window.location.href = instagramAuthUrl;
  };

  const value: AppContextType = {
    isLoggedIn,
    setIsLoggedIn,
    showLoginModal,
    setShowLoginModal,
    currentUser,
    onLogout,
    handleLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
