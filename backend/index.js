const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const VERIFY_TOKEN = "socialstream123";

const tokenStore = new Map();
app.use(cors());
app.use(express.json());

const cleanAccessToken = (token) => {
  if (!token || typeof token !== "string") return token;
  return token.replace(/#_=_$/, "");
};

// Instagram OAuth callback
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error("Authorization code is missing.");
    return res
      .status(400)
      .json({ message: "Authorization code is missing.", success: false });
  }
  console.log("Received authorization code:", code);

  try {
    const tokenResponse = await axios.post(
      "https://graph.facebook.com/v22.0/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          code,
          redirect_uri: encodeURI(`${process.env.BACKEND_URL}/auth/callback`),
        },
      }
    );

    let { access_token } = tokenResponse.data;
    access_token = cleanAccessToken(access_token);

    const userResponse = await axios.get(
      "https://graph.facebook.com/v22.0/me?fields=id,name,email,picture",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { id, name } = userResponse.data;
    console.log("User data:", { id, name });

    tokenStore.set(id, access_token);

    if (!process.env.FRONTEND_URL) {
      console.error("FRONTEND_URL is not set");
      return res.status(500).send("Server configuration error");
    }

    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?userId=${id}`;
    console.log("Redirecting to:", redirectUrl);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error(
      "Instagram Callback Error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      message: "Instagram callback failed",
      error: error.response?.data || error.message,
    });
  }
});

// Fetch Instagram user profile
app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  try {
    const userResponse = await axios.get(`https://graph.instagram.com/me`, {
      params: {
        fields: "id,username,account_type,media_count,profile_picture_url",
        access_token,
      },
    });
    return res.json({ user: userResponse.data });
  } catch (error) {
    console.error("User fetch error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Fetch Instagram user media (feed)
app.get("/api/feed/:userId", async (req, res) => {
  const { userId } = req.params;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  try {
    const feedResponse = await axios.get(
      `https://graph.instagram.com/me/media`,
      {
        params: {
          fields:
            "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
          access_token,
        },
      }
    );
    return res.json({ feed: feedResponse.data.data });
  } catch (error) {
    console.error(
      "Instagram Feed fetch error:",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Failed to fetch feed" });
  }
});

// Fetch Instagram reels (as videos in media)
app.get("/api/reels/:userId", async (req, res) => {
  const { userId } = req.params;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  try {
    const feedResponse = await axios.get(
      `https://graph.instagram.com/me/media`,
      {
        params: {
          fields: "id,media_type,media_url,caption,permalink,timestamp",
          access_token,
        },
      }
    );
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
    return res.status(500).json({ message: "Failed to fetch reels" });
  }
});

// Post a comment on a media
app.post("/api/comment/:mediaId", async (req, res) => {
  const { mediaId } = req.params;
  const { userId, message } = req.body;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  if (!message) {
    return res.status(400).json({ message: "Comment message is required" });
  }

  try {
    const commentResponse = await axios.post(
      `https://graph.instagram.com/${mediaId}/comments`,
      null,
      {
        params: {
          message,
          access_token,
        },
      }
    );
    return res.json({ comment: commentResponse.data });
  } catch (error) {
    console.error("Comment post error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to post comment" });
  }
});

// Reply to a comment
app.post("/api/comment/:commentId/reply", async (req, res) => {
  const { commentId } = req.params;
  const { userId, message } = req.body;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  if (!message) {
    return res.status(400).json({ message: "Reply message is required" });
  }

  try {
    const replyResponse = await axios.post(
      `https://graph.instagram.com/${commentId}/replies`,
      null,
      {
        params: {
          message,
          access_token,
        },
      }
    );
    return res.json({ reply: replyResponse.data });
  } catch (error) {
    console.error("Reply post error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to post reply" });
  }
});


// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Webhook event handler
app.post("/webhook", (req, res) => {
  console.log("Webhook event received:", req.body);
  return res.status(200).send("EVENT_RECEIVED");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
