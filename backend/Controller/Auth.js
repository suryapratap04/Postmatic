const axios = require("axios");
const { tokenStore } = require("../index");
const dotenv = require("dotenv");
dotenv.config();

exports.AuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "missing_code",
      message: "Authorization code is required",
    });
  }
  console.log("Received code:", code);

  try {
    console.log("ID",process.env.INSTAGRAM_APP_ID);
    console.log("Secret",process.env.INSTAGRAM_APP_SECRET);
    console.log("Redirect URI",process.env.INSTAGRAM_REDIRECT_URI);
    const payload = new URLSearchParams();
    payload.append("client_id", process.env.INSTAGRAM_APP_ID);
    payload.append("client_secret", process.env.INSTAGRAM_APP_SECRET);
    payload.append("grant_type", "authorization_code");
    payload.append("code", code);
    payload.append(
      "redirect_uri",
      `${process.env.INSTAGRAM_REDIRECT_URI}/auth/callback`
    );

    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      payload
    );
    console.log("Token response:", tokenResponse.data);

    let { access_token, user_id } = tokenResponse.data;
    access_token = (access_token) => {
      if (!access_token || typeof access_token !== "string")
        return access_token;
      return access_token.replace(/#_=_$/, "");
    };

    console.log("Access token:", access_token);
    console.log("User ID:", user_id);

    // Get long-lived token (60 days)
    const longLivedToken = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          access_token,
        },
      }
    );
    console.log("Long-lived access token:", longLivedToken.data.access_token);

    const longLivedAccessToken = longLivedToken.data.access_token;

    // Get user profile data
    const profileResponse = await axios.get(
      `https://graph.instagram.com/v22.0/${user_id}`,
      {
        params: {
          fields: "id,username,account_type,media_count",
          access_token: longLivedAccessToken,
        },
      }
    );
    console.log("User profile response:", profileResponse.data);

    // Store token securely (consider encryption)
    tokenStore.set(user_id, {
      token: longLivedAccessToken,
      expires: Date.now() + longLivedToken.data.expires_in * 1000,
    });

    // Redirect with user data
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/dashboard`);
    redirectUrl.searchParams.set("user_id", user_id);
    redirectUrl.searchParams.set("username", profileResponse.data.username);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error(
      "Instagram auth error:",
      error.response?.data || error.message
    );
    const errorCode = error.response?.data?.error_code || "server_error";
    res.redirect(`${process.env.FRONTEND_URL}/error?code=${errorCode}`);
  }
};
