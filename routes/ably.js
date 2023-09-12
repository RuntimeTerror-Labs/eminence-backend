const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('dotenv').config();

const apiKey = process.env.ABLY_API_KEY;
const [keyid, keySecret] = apiKey.split(':');

const expiresIn = 3600;
const capability = JSON.stringify({ '*': ['publish', 'subscribe'] });
const jwtOptions = { expiresIn, keyid };

router.get('/getJWT', (req, res) => {
  console.log('Sucessfully connected to the server auth endpoint');

  // Check user is authorized to access this endpoint

  const clientId = req.query.clientId;

  const jwtPayload = {
    'x-ably-capability': capability,
    'x-ably-clientId': clientId,
  };

  jwt.sign(jwtPayload, keySecret, jwtOptions, (err, tokenId) => {
    console.log('✓ JSON Web Token signed by auth server');

    if (err) return console.error();

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/json');

    console.log('Sending signed JWT token back to client');

    res.send(JSON.stringify(tokenId));
  });
});

router.get('/logout', (req, res) => {
  ably.close();
  console.log('Closed the connection to Ably.');
});

module.exports = router;
