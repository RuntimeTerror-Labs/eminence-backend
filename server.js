const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const axios = require("axios");

// const ably = require('./utils/ably');
const ablyRoute = require("./routes/api/ably");

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/ably", ablyRoute);
app.use("/api/chat", require("./routes/api/chat"));
app.use("/api/message", require("./routes/api/message"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/voucher", require("./routes/api/voucher"));
app.use("/api/transaction", require("./routes/api/transaction"));

app.get("/coindetails", async (req, res) => {
  const { coinCode, fiatType, fiatAmount } = req.query;

  if (coinCode === undefined || fiatType === undefined) {
    return res
      .status(400)
      .json({ error: "Please provide a coinCode and fiatType" });
  }

  try {
    const response = await axios.get(
      `https://api.onramp.money/onramp/api/v3/buy/public/coinDetails?coinCode=${coinCode}&chainId=1&fiatAmount=${fiatAmount}&fiatType=${fiatType}`
    );
    res.json(response.data.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
