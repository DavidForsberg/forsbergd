require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(express.static("public"));
app.use(require("./routes/projects"));
app.use(require("./routes/login"));
app.use(require("./routes/files"));
app.use(require("./routes/posts"));
app.listen(process.env.PORT || 3012, () => {
    console.log("server has started on port 3012");
});
//# sourceMappingURL=server.js.map