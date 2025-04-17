import { apiConnector } from "./apiConnector";
import { userEndpoints } from "./api";

export async function getUserProfile(userId: string) {
  try {
    const response = await apiConnector({
      method: "GET",
      url: userEndpoints.UserProfile(userId),
    });
    console.log("User Profile Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
