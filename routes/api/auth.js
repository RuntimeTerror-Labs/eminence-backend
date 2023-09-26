const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { address, signature } = req.body;

  // Check for address
  if (!address) {
    return res.status(400).json({ error: "Please provide an address" });
  }

  // Check for signature
  if (!signature) {
    return res.status(400).json({ error: "Please provide a signature" });
  }

  try {
    const payload = {
      signature,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    res.json({ msg: "Logged In" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
