import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

export default function Media() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { user, media, setMedia } = context;
  // if (!media) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <h1 className="text-2xl font-bold">Media not found</h1>
  //       <p className="mt-4">Please login to view your Media.</p>
  //     </div>
  //   );
  // }
  const getUserProfile = async () => {
    try {
      const response = await fetch(
        `https://postmatic.onrender.com/api/feed/${user?.id}`
      );
      const data = await response.json();
      console.log(data);
      setMedia(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    if (!media && user) {
      getUserProfile();
    }
  }, [media]);
  return (
    <div>
      <h1>media </h1>
      <button
        onClick={() => {
          if (!media && user) {
            getUserProfile();
          } else {
            console.log("Media already fetched");
            console.log(media);
            console.log(user);
          }
        }}
      >
        Fetch Media
      </button>
    </div>
  );
}
