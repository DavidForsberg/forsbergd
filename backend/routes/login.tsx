var express = require("express");
var router = express.Router();
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const pool = require("../db");
import argon2 from "argon2";

interface AccessToken {
  accessToken: string;
}

interface UserResponse {
  accessToken: AccessToken | null;
  message: string;
}

router.post("/login", async (req: Request, res: Response<UserResponse>) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const code = req.body.code;

    const { rows: users } = await pool.query(
      `SELECT "User".password, "User".username FROM "User" WHERE "User".username = $1;`,
      [username]
    );

    if (users.length === 0) {
      res.send({ message: "Incorrect login!", accessToken: null });
      return;
    }

    const user = users[0];

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      res.send({ message: "Incorrect login!", accessToken: null });
      return;
    }

    const accessToken = await jwt.sign(code, process.env.ACCESS_TOKEN_SECRET);

    res.json({ message: "Signed in!", accessToken });
  } catch (err) {
    console.log(err);
    res.send({ message: "Incorrect login!", accessToken: null });
  }
});

// router.post("/register", async (req: Request, res: Response<UserResponse>) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const code = req.body.code;

//   console.log(req.body);

//   const hashedPassword = await argon2.hash(password);

//   const { rows: users } = await pool.query(
//     `INSERT INTO "User" (username, password) VALUES ($1, $2) RETURNING *;`,
//     [username, hashedPassword]
//   );

//   if (users.length === 0) {
//     res.send({ message: "Incorrect register!", accessToken: null });
//     return;
//   }

//   const user = users[0];

//   console.log("JE");

//   const accessToken = jwt.sign(code, process.env.ACCESS_TOKEN_SECRET);

//   res.json({ message: "Signed in!", accessToken });
// });

module.exports = router;
