const axios = require("axios");
const { tokenStore } = require("../index");

// Fetch Instagram user profile
exports.UserProfile = async (req, res) => {
  const { userId } = req.params;
  const storedTokenData = tokenStore.get(userId);

  if (!storedTokenData || !storedTokenData.token) {
    console.log(`No access token found for userId: ${userId}`);
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  const { token, expires } = storedTokenData;
  if (Date.now() > expires) {
    console.log(`Token expired for userId: ${userId}`);
    return res
      .status(401)
      .json({ message: "Token expired, please re-authenticate" });
  }
  console.log(`Access token found for userId ${userId}: ${token}`);
  try {
    console.log("Fetching user data for userId:", userId);
    const userResponse = await axios.get(
      `https://graph.instagram.com/v22.0/${userId}?fields=id,username,account_type,media_count`,
      {
        params: {
          access_token: token,
        },
      }
    );
    console.log("User data response:", userResponse.data);

    if (userResponse.data.error) {
      console.error("Instagram API error:", userResponse.data.error);
      return res.status(500).json({
        message: "Failed to fetch user data",
        error: userResponse.data.error,
      });
    }

    return res.json({ user: userResponse.data });
  } catch (error) {
    console.error("User fetch error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

// Fetch Instagram user media (feed)
exports.UserMedia = async (req, res) => {
  const { userId } = req.params;
  const storedTokenData = tokenStore.get(userId);

  if (!storedTokenData || !storedTokenData.token) {
    console.log(`No access token found for userId: ${userId}`);
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  const { token, expires } = storedTokenData;
  if (Date.now() > expires) {
    console.log(`Token expired for userId: ${userId}`);
    return res
      .status(401)
      .json({ message: "Token expired, please re-authenticate" });
  }

  try {
    const feedResponse = await axios.get(
      `https://graph.instagram.com/v22.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp`,
      {
        params: {
          access_token: token,
        },
      }
    );

    if (feedResponse.data.error) {
      console.error("Instagram API error:", feedResponse.data.error);
      return res.status(500).json({
        message: "Failed to fetch feed",
        error: feedResponse.data.error,
      });
    }
    return res.json({ feed: feedResponse.data.data });
  } catch (error) {
    console.error(
      "Instagram Feed fetch error:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch feed", error: error.message });
  }
};

// Fetch Instagram reels (as videos in media)
exports.UserReels = async (req, res) => {
  const { userId } = req.params;
  const storedTokenData = tokenStore.get(userId);

  if (!storedTokenData || !storedTokenData.token) {
    console.log(`No access token found for userId: ${userId}`);
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  const { token, expires } = storedTokenData;
  if (Date.now() > expires) {
    console.log(`Token expired for userId: ${userId}`);
    return res
      .status(401)
      .json({ message: "Token expired, please re-authenticate" });
  }

  try {
    // Use the same endpoint as feed but filter on the server side
    const feedResponse = await axios.get(
      `https://graph.instagram.com/v22.0/${userId}/media?fields=id,media_type,media_url,caption,permalink,timestamp`,
      {
        params: {
          access_token: token,
        },
      }
    );

    if (feedResponse.data.error) {
      console.error("Instagram API error:", feedResponse.data.error);
      return res.status(500).json({
        message: "Failed to fetch reels",
        error: feedResponse.data.error,
      });
    }
    // Filter for videos (reels)
    const reels = (feedResponse.data.data || []).filter(
      (item) => item.media_type === "VIDEO"
    );
    return res.json({ reels });
  } catch (error) {
    console.error(
      "Instagram Reels fetch error:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch reels", error: error.message });
  }
};

// Post a comment on a media
exports.PostComment = async (req, res) => {
  const { mediaId } = req.params;
  const { userId, message } = req.body;
  const storedTokenData = tokenStore.get(userId);

  if (!storedTokenData || !storedTokenData.token) {
    console.log(`No access token found for userId: ${userId}`);
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  const { token, expires } = storedTokenData;
  if (Date.now() > expires) {
    console.log(`Token expired for userId: ${userId}`);
    return res
      .status(401)
      .json({ message: "Token expired, please re-authenticate" });
  }

  if (!message) {
    return res.status(400).json({ message: "Comment message is required" });
  }

  try {
    const commentResponse = await axios.post(
      `https://graph.instagram.com/v22.0/${mediaId}/comments`,
      null,
      {
        params: {
          message,
          access_token: token,
        },
      }
    );

    if (commentResponse.data.error) {
      console.error("Instagram API error:", commentResponse.data.error);
      return res.status(500).json({
        message: "Failed to post comment",
        error: commentResponse.data.error,
      });
    }
    return res.json({ comment: commentResponse.data });
  } catch (error) {
    console.error("Comment post error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ message: "Failed to post comment", error: error.message });
  }
};

// Reply to a comment
exports.ReplyComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, message } = req.body;
  const storedTokenData = tokenStore.get(userId);

  if (!storedTokenData || !storedTokenData.token) {
    console.log(`No access token found for userId: ${userId}`);
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  const { token, expires } = storedTokenData;
  if (Date.now() > expires) {
    console.log(`Token expired for userId: ${userId}`);
    return res
      .status(401)
      .json({ message: "Token expired, please re-authenticate" });
  }

  if (!message) {
    return res.status(400).json({ message: "Reply message is required" });
  }

  try {
    const replyResponse = await axios.post(
      `https://graph.instagram.com/v22.0/${commentId}/replies`,
      null,
      {
        params: {
          message,
          access_token: token,
        },
      }
    );

    if (replyResponse.data.error) {
      console.error("Instagram API error:", replyResponse.data.error);
      return res.status(500).json({
        message: "Failed to post reply",
        error: replyResponse.data.error,
      });
    }
    return res.json({ reply: replyResponse.data });
  } catch (error) {
    console.error("Reply post error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ message: "Failed to post reply", error: error.message });
  }
};
