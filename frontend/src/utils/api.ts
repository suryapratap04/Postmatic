const BASE_URL = process.env.REACT_APP_BASE_URL;

export const userEndpoints = {
  UserProfile: (userId: string) => `${BASE_URL}/api/user/${userId}`,
  UserMedia: (userId: string) => `${BASE_URL}/api/feed/${userId}`,
};
