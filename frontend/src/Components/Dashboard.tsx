import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./ProfileSection";
import FeedSection from "./FeedSection";
import ReelsSection from "./ReelsSection";

interface Post {
  id: string;
  caption?: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO";
  timestamp: string;
}

interface Reel {
  id: string;
  media_url: string;
  caption?: string;
}

interface User {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  picture?: { data: { url: string } };
}

interface Comment {
  id: string;
  text: string;
  user: User;
  replies?: Comment[];
}

const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  const { user, isLoggedIn } = context;
  const [feed, setFeed] = useState<Post[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isLoggedIn) {
    //   navigate("/login");
    //   return;
    // }

    if (user && user.id) {
      fetchFeed(user.id);
      fetchReels(user.id);
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch feed
  const fetchFeed = async (userId: string) => {
    setLoadingFeed(true);
    setError(null);

    try {
      const feedResponse = await fetch(`/api/feed/${userId}`);
      if (!feedResponse.ok) {
        throw new Error(`Feed fetch failed: ${feedResponse.statusText}`);
      }
      const { feed } = await feedResponse.json();
      console.log("Fetched feed:", feed);
      setFeed(feed);

      feed.forEach((post: Post) => {
        fetchComments(post.id);
      });
    } catch (err: any) {
      console.error("Feed fetch error:", err);
      setError("Failed to load feed.");
    } finally {
      setLoadingFeed(false);
    }
  };

  // Fetch reels
  const fetchReels = async (userId: string) => {
    setLoadingReels(true);
    setError(null);

    try {
      const reelsResponse = await fetch(`/api/reels/${userId}`);
      if (!reelsResponse.ok) {
        throw new Error(`Reels fetch failed: ${reelsResponse.statusText}`);
      }
      const { reels } = await reelsResponse.json();
      console.log("Fetched reels:", reels);
      setReels(reels);
    } catch (err: any) {
      console.error("Reels fetch error:", err);
      setError("Failed to load reels.");
    } finally {
      setLoadingReels(false);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const commentsResponse = await fetch(`/api/comments/${postId}`); // Assuming you have an endpoint to fetch comments
      if (!commentsResponse.ok) {
        throw new Error(
          `Comments fetch failed: ${commentsResponse.statusText}`
        );
      }
      const { comments: fetchedComments } = await commentsResponse.json();
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: fetchedComments,
      }));
    } catch (err: any) {
      console.error("Comments fetch error:", err);
      setError("Failed to load comments.");
    }
  };

  useEffect(() => {
    // Clean up the URL after authentication
    if (window.location.hash === "#_=_") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const handleCommentSubmit = async (postId: string) => {
    if (!user || !commentInput[postId]) return;

    try {
      const response = await fetch(`/api/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          message: commentInput[postId],
        }),
      });
      if (!response.ok) {
        throw new Error(`Comment failed: ${response.statusText}`);
      }
      console.log("Comment posted for post:", postId);
      setCommentInput({ ...commentInput, [postId]: "" });
      // Refresh comments after posting
      fetchComments(postId);
    } catch (err: any) {
      setError("Failed to post comment");
      console.error("Comment error:", err);
    }
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    postId: string
  ) => {
    setCommentInput({ ...commentInput, [postId]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <ProfileSection
          user={user}
          loading={loadingFeed || loadingReels}
          fetchFeed={fetchFeed}
          fetchReels={fetchReels}
          selectedUser={user}
        />

        {/* Feed and Reels Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Feed Section */}
          <FeedSection
            feed={feed}
            loading={loadingFeed}
            error={error}
            user={user}
            commentInput={commentInput}
            handleCommentChange={handleCommentChange}
            handleCommentSubmit={handleCommentSubmit}
            comments={comments}
          />

          {/* Reels Section */}
          <ReelsSection
            reels={reels}
            loading={loadingReels}
            error={error}
            user={user}
            commentInput={commentInput}
            handleCommentChange={handleCommentChange}
            handleCommentSubmit={handleCommentSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
