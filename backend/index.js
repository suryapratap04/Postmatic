const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const VERIFY_TOKEN = "socialstream123";

const tokenStore = new Map();
app.use(
  cors({ origin: "https://postmatic.suryapratap.me", credentials: true })
);
app.use(express.json());

const cleanAccessToken = (token) => {
  if (!token || typeof token !== "string") return token;
  return token.replace(/#_=_$/, "");
};

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
      "https://graph.facebook.com/v16.0/oauth/access_token",
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
      "https://graph.facebook.com/v16.0/me?fields=id,name,email,picture",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { id, name, email, picture } = userResponse.data;
    console.log("User data:", { id, name, email });

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
      "Facebook Callback Error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      message: "Facebook callback failed",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  try {
    const userResponse = await axios.get(
      `https://graph.facebook.com/v16.0/${userId}?fields=id,name,email,picture`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return res.json({ user: userResponse.data });
  } catch (error) {
    console.error("User fetch error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
});

app.get("/api/feed/:userId", async (req, res) => {
  const { userId } = req.params;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  try {
    const feedResponse = await axios.get(
      `https://graph.facebook.com/v16.0/${userId}/feed?fields=id,message,created_time,attachments`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return res.json({ feed: feedResponse.data.data });
  } catch (error) {
    console.error("Feed fetch error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to fetch feed" });
  }
});

app.get("/api/reels/:userId", async (req, res) => {
  const { userId } = req.params;
  const access_token = tokenStore.get(userId);

  if (!access_token) {
    return res.status(401).json({ message: "Invalid or expired user" });
  }

  try {
    const reelsResponse = await axios.get(
      `https://graph.facebook.com/v16.0/${userId}/videos?fields=id,title,description,source`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return res.json({ reels: reelsResponse.data.data });
  } catch (error) {
    console.error("Reels fetch error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to fetch reels" });
  }
});

app.post("/api/comment/:postId", async (req, res) => {
  const { postId } = req.params;
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
      `https://graph.facebook.com/v16.0/${postId}/comments`,
      { message },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    return res.json({ comment: commentResponse.data });
  } catch (error) {
    console.error("Comment post error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to post comment" });
  }
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("Webhook event received:", req.body);
  return res.status(200).send("EVENT_RECEIVED");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
