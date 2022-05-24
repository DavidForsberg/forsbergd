var express = require("express");
var router = express.Router();
import { Request, Response } from "express";

// Download some file
router.post("/download", function (req: Request, res: Response) {
  try {
    const folder = req.body.folder;
    const filename = req.body.filename;
    console.log(folder, filename);
    const file = "./public/" + folder + "/" + filename;

    if (file.includes("..")) {
      res.send("Bad request, try again!");
    }

    res.download(file);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
