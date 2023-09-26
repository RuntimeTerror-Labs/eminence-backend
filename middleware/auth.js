const jwt = require("jsonwebtoken");
require("dotenv").config();
const nacl = require("tweetnacl");
const bs58 = require("bs58");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const pubkey = req.header("x-auth-pubkey");

  // Check for pubkey
  if (!pubkey) {
    return res.status(401).json({ error: "No pubkey, authorization denied" });
  }

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    const signature = decodedPayload.signature;
    const message = process.env.MESSAGE;

    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(pubkey)
    );

    if (!verified) {
      return res
        .status(401)
        .json({ error: "Invalid signature, authorization denied" });
    }

    req.pubkey = pubkey;

    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
