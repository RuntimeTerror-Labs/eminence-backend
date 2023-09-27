const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// const ably = require('./utils/ably');
const ablyRoute = require("./routes/api/ably");

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

connectDB();

app.use("/api/ably", ablyRoute);
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/voucher", require("./routes/api/voucher"));
app.use("/api/transaction", require("./routes/api/transaction"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
