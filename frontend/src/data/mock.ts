export interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string;
    replies?: {
      id: string;
      userId: string;
      username: string;
      text: string;
      timestamp: string;
    }[];
  }[];
  timestamp: string;
}

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnail: string;
  caption?: string;
  likes: number;
  views: number;
  comments: any[];
}

export const mockUser: User = {
  id: "123",
  username: "johndoe",
  fullName: "John Doe",
  profilePicture:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  bio: "Photography enthusiast | Travel lover | Coffee addict",
  followers: 1234,
  following: 567,
  posts: 42,
};

export const mockUsers: { [key: string]: User } = {
  user123: {
    id: "456",
    username: "user123",
    fullName: "Sarah Wilson",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    bio: "Digital artist | Coffee lover 🎨 ☕",
    followers: 892,
    following: 435,
    posts: 28,
  },
  johndoe: mockUser,
};

export const mockReels: Reel[] = [
  {
    id: "r1",
    userId: "123",
    videoUrl: "https://player.vimeo.com/video/824804225",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    caption: "Amazing sunset timelapse 🌅 #nature",
    likes: 1234,
    views: 5678,
    comments: [],
  },
  {
    id: "r2",
    userId: "123",
    videoUrl: "https://player.vimeo.com/video/824804225",
    thumbnail:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500",
    caption: "Coffee art in action ☕ #coffee #art",
    likes: 892,
    views: 3421,
    comments: [],
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    userId: "123",
    imageUrl:
      "https://images.unsplash.com/photo-1612441804231-77a36b284856?w=600",
    caption: "Beautiful sunset at the beach! 🌅 #nature #photography",
    likes: 245,
    comments: [
      {
        id: "c1",
        userId: "456",
        username: "user123",
        text: "Amazing shot! 📸",
        timestamp: "2024-03-10T15:30:00Z",
        replies: [
          {
            id: "r1",
            userId: "123",
            username: "johndoe",
            text: "Thanks! Glad you like it!",
            timestamp: "2024-03-10T15:35:00Z",
          },
        ],
      },
    ],
    timestamp: "2024-03-10T14:30:00Z",
  },
  {
    id: "2",
    userId: "123",
    imageUrl:
      "https://images.unsplash.com/photo-1519338381761-c7523edc1f46?w=600",
    caption: "Morning coffee and work setup ☕️ #worklife",
    likes: 189,
    comments: [],
    timestamp: "2024-03-09T09:15:00Z",
  },
];
