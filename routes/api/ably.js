const express = require('express');
// const jwt = require('jsonwebtoken');
const router = express.Router();
const Ably = require('ably');

require('dotenv').config();

const apiKey = process.env.ABLY_API_KEY;
console.log(apiKey);
// const [keyid, keySecret] = apiKey.split(':');

// const expiresIn = 3600;
// const capability = JSON.stringify({ '*': ['publish', 'subscribe'] });
// const jwtOptions = { expiresIn, keyid };
// console.log(jwtOptions)

router.get('/auth', (req, res) => {
  console.log('Sucessfully connected to the server auth endpoint');

  // Check user is authorized to access this endpoint

  const clientId = req.query.id;

  // const jwtPayload = {
  //   'x-ably-capability': capability,
  //   'x-ably-clientId': clientId,
  // };

  // jwt.sign(jwtPayload, keySecret, jwtOptions, (err, tokenId) => {
  //   console.log('✓ JSON Web Token signed by auth server');

  //   if (err) return console.error();

  //   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  //   res.setHeader('Content-Type', 'application/json');

  //   res.send(JSON.stringify(tokenId));
  // });

  try {
    const client = new Ably.Rest({
      key: apiKey,
      prefixUrl: 'https://rest.ably.io',
    });

    client.auth.createTokenRequest(
      {
        clientId,
      },
      (err, tokenRequest) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Internal Error');
        }

        console.log('✓ Token request created');
        console.log(tokenRequest);
        return res.send(tokenRequest);
      }
    );
  } catch (error) {
    return res.status(500).send('Internal Error');
  }
});

router.get('/logout', (req, res) => {
  Ably.close();
  console.log('Closed the connection to Ably.');
});

router.post('/message', async (req, res) => {
  const body = req.body;
  const client = new Ably.Rest(apiKey);
  const { message, channelName } = body;

  const channel = client.channels.get(channelName);

  const disallowedWords = ['nigga', 'nude', 'sex'];

  const containsDisallowedWord = disallowedWords.some((word) => {
    return message.text.match(new RegExp(`\\b${word}\\b`));
  });

  if (containsDisallowedWord) {
    return res.status(403).send('Bad word');
  }

  const response = await channel.publish('update-from-server', message);

  return res.send(response);
});

module.exports = router;
