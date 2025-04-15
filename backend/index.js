const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const VERIFY_TOKEN = "socialstream123";

app.use(cors());

const cleanAccessToken = (token) => {
  if (!token || typeof token !== "string") {
    return token;
  }
  return token.replace(/#_=_$/, "");
};

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error("Authorization code is missing.");
    return res.status(400).json({
      message: "Authorization code is missing.",
      success: false,
    });
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
          code: code,
          redirect_uri: encodeURI(`${BACKEND_URL}/auth/facebook/callback`),
        },
      }
    );

    console.log("Token response:", tokenResponse.data);

    let { access_token } = tokenResponse.data;
    access_token = cleanAccessToken(access_token);
    const userResponse = await axios.get(
      "https://graph.facebook.com/v16.0/me?fields=id,name,email",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log("User response:", userResponse.data);

    const { id, name, email } = userResponse.data;
    console.log("User data:", { id, name, email });
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  } catch (error) {
    console.error(
      "Facebook Callback Error:",
      error.response?.data || error.message
    );

    if (error.response?.data) {
      return res.status(500).json({
        message: "Facebook callback failed",
        error: error.response.data,
      });
    }

    return res.status(500).send("Facebook callback failed");
  }
});
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  console.log("Webhook event received:", req.body);
  return res.status(200).send("EVENT_RECEIVED");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
