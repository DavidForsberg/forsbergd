import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader);
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, code: string) => {
      if (err) return res.sendStatus(403);
      res.locals.code = code; // same as req.code
      next();
      return;
    }
  );
  return;
}
