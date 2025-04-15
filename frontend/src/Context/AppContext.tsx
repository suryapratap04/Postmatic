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
    // console.log(process.env.VITE_FACEBOOK_APP_ID);
    const redirectUri = `https://postmatic.onrender.com/auth/callback`;
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
    currentUser,
    onLogout,
    handleLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
