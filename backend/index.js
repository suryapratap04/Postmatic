const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const VERIFY_TOKEN = "socialstream123";

exports.tokenStore = new Map();
app.use(cors());
app.use(express.json());

const { AuthRoutes } = require("./Routes/AuthRoutes");
const { UserRoutes } = require("./Routes/UserRoutes");

app.use("/auth", AuthRoutes);
app.use("/api", UserRoutes);

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    return res.status(200).send(challenge);
  } else {
    console.status(403).json({ error: "Verification failed" });
  }
});

// Webhook event handler
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "instagram") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = entry.sender.id;
      console.log("Sender PSID: " + sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    return res.status(200).send("EVENT_RECEIVED");
  } else {
    return res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
