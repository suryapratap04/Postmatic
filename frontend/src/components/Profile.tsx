import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

export default function Profile() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { user, setUser } = context;
  // if (!user) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <h1 className="text-2xl font-bold">User not found</h1>
  //       <p className="mt-4">Please login to view your profile.</p>
  //     </div>
  //   );
  // }
  const getUserProfile = async () => {
    try {
      const response = await fetch(
        `https://postmatic.onrender.com/api/user/${user.id}`
      );
      const data = await response.json();
      console.log(data);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    if (!user) {
      getUserProfile();
    }
  }, [user]);

  return (
    <div className="w-[100%] h-[100px] ">HII there user is {user.username}</div>
  );
}
