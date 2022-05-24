"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");
const argon2_1 = __importDefault(require("argon2"));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const code = req.body.code;
        const { rows: users } = yield pool.query(`SELECT "User".password, "User".username FROM "User" WHERE "User".username = $1;`, [username]);
        if (users.length === 0) {
            res.send({ message: "Incorrect login!", accessToken: null });
            return;
        }
        const user = users[0];
        const valid = yield argon2_1.default.verify(user.password, password);
        if (!valid) {
            res.send({ message: "Incorrect login!", accessToken: null });
            return;
        }
        const accessToken = yield jwt.sign(code, process.env.ACCESS_TOKEN_SECRET);
        res.json({ message: "Signed in!", accessToken });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Incorrect login!", accessToken: null });
    }
}));
module.exports = router;
//# sourceMappingURL=login.js.map