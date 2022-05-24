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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
const pool = require("../db");
const auth_1 = require("../middleware/auth");
router.delete("/tags/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rows: deletedTags } = yield pool.query('DELETE FROM "Tag" WHERE id = $1', [id]);
    if (deletedTags.length === 0) {
        res.json({ message: "Error deleting tag" });
        return;
    }
    res.json(deletedTags[0]);
}));
router.get("/tags", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: allTags } = yield pool.query('SELECT * FROM "Tag"');
        var tagsWithRefs = [];
        for (tag in allTags.rows) {
            const connectedPosts = yield pool.query('SELECT * FROM "PostTag" WHERE tag_id = $1', [allTags.rows[tag]["id"]]);
            tagsWithRefs.push({
                tag: {
                    id: allTags.rows[tag]["id"],
                    title: allTags.rows[tag]["title"],
                    references: connectedPosts.rows,
                },
            });
        }
        res.json(tagsWithRefs);
    }
    catch (err) {
        console.error(err.message);
    }
}));
module.exports = router;
//# sourceMappingURL=tags.js.map