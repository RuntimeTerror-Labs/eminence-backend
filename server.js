const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const axios = require("axios");
const Ably = require("ably");

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

const realtime = new Ably.Realtime(process.env.ABLY_API_KEY);

const ablyGraph = () => {
  const channel1Min = realtime.channels.get("1m");
  const channel15Min = realtime.channels.get("15m");
  const channel1Hour = realtime.channels.get("1h");
  const channel1Day = realtime.channels.get("1d");
  const channel1Week = realtime.channels.get("1w");

  channel1Min.subscribe(function (message) {});

  channel15Min.subscribe(function (message) {});

  channel1Hour.subscribe(function (message) {});

  channel1Day.subscribe(function (message) {});

  channel1Week.subscribe(function (message) {});

  setTimeout(async () => {
    channel1Min.publish(
      "1m",
      await axios
        .get(
          "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1m&limit=25"
        )
        .then((res) => {
          return res.data;
        })
    );
    channel15Min.publish(
      "15m",
      await axios
        .get(
          "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=15m&limit=25"
        )
        .then((res) => {
          return res.data;
        })
    );
    channel1Hour.publish(
      "1h",
      await axios
        .get(
          "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1h&limit=25"
        )
        .then((res) => {
          return res.data;
        })
    );
    channel1Day.publish(
      "1d",
      await axios
        .get(
          "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1d&limit=25"
        )
        .then((res) => {
          return res.data;
        })
    );
    channel1Week.publish(
      "1w",
      await axios
        .get(
          "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1w&limit=25"
        )
        .then((res) => {
          return res.data;
        })
    );

    ablyGraph();
  }, 60000);
};

ablyGraph();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
