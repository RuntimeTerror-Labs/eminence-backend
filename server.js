const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// const ably = require('./utils/ably');
const ablyRoute = require('./routes/ably');

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;

const app = express();
// const ablyClient = ably();

app.use(cors());

app.use('/api/ably', ablyRoute);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log('✓ Server connected on port:', 5000);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
