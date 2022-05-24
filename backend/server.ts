require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Cors settings
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Parses incoming requests with JSON payloads
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// Api routes
app.use(require("./routes/projects"));
app.use(require("./routes/login"));
app.use(require("./routes/files"));
app.use(require("./routes/posts"));

// Start Server
app.listen(process.env.PORT || 3012, () => {
  console.log("server has started on port 3012");
});
