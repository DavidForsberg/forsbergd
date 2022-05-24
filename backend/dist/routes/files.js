"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.post("/download", function (req, res) {
    try {
        const folder = req.body.folder;
        const filename = req.body.filename;
        console.log(folder, filename);
        const file = "./public/" + folder + "/" + filename;
        if (file.includes("..")) {
            res.send("Bad request, try again!");
        }
        res.download(file);
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = router;
//# sourceMappingURL=files.js.map