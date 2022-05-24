"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(authHeader);
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, code) => {
        if (err)
            return res.sendStatus(403);
        res.locals.code = code;
        next();
        return;
    });
    return;
}
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map