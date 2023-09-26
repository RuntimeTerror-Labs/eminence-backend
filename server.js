const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// const ably = require('./utils/ably');
const ablyRoute = require("./routes/api/ably");

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use("/api/ably", ablyRoute);
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
