const express = require("express");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const Ably = require("ably");
const auth = require("../../middleware/auth");

require("dotenv").config();

const apiKey = process.env.ABLY_API_KEY;

router.get("/auth", (req, res) => {
  console.log("Sucessfully connected to the server auth endpoint");

  // Check user is authorized to access this endpoint

  const clientId = req.query.id;

  try {
    const client = new Ably.Rest({
      key: apiKey,
      prefixUrl: "https://rest.ably.io",
    });

    client.auth.createTokenRequest(
      {
        clientId,
      },
      (err, tokenRequest) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Error");
        }

        console.log("✓ Token request created");
        return res.send(tokenRequest);
      }
    );
  } catch (error) {
    return res.status(500).send("Internal Error");
  }
});

router.get("/logout", (req, res) => {
  Ably.close();
  console.log("Closed the connection to Ably.");
});

router.post("/message", async (req, res) => {
  const body = req.body;
  const client = new Ably.Realtime(apiKey);
  const { message, channelName } = body;

  console.log(message, channelName);

  const channel = client.channels.get(channelName);

  const response = channel.publish(channelName, message);

  return res.send(response);
});

module.exports = router;
