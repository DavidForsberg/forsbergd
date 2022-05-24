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
const pool = require("../db");
const uploadfiles_1 = require("../middleware/uploadfiles");
const auth_1 = require("../middleware/auth");
const path_1 = __importDefault(require("path"));
const fs = require("fs");
const format = require("pg-format");
const upload = (0, uploadfiles_1.initFilesystem)();
router.post("/posts", auth_1.authenticateToken, upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postDataJson = JSON.parse(req.body.postData);
        const serverFilepath = req.body.filepath;
        const { slug, title, date, description, full_html, tags, read_time, imageData, } = postDataJson;
        var tagIds = [];
        for (const tag of tags) {
            try {
                const newTags = yield pool.query('INSERT INTO "Tag" (title) VALUES ($1) RETURNING *;', [tag]);
                tagIds.push(newTags.rows[0].id);
            }
            catch (_a) {
                const existingTag = yield pool.query('SELECT * FROM "Tag" WHERE title = $1 RETURNING *;', [tag]);
                tagIds.push(existingTag.rows[0].id);
            }
        }
        const thumbnailExists = imageData.filter((file) => file.type === "thumbnail");
        const thumbnail = thumbnailExists.length > 0 ? thumbnailExists[0].filename : null;
        const additionalFileExists = imageData.filter((file) => file.type === "file");
        const additionalFile = additionalFileExists.length > 0
            ? additionalFileExists[0].filename
            : null;
        const newPost = yield pool.query(`INSERT INTO "Post" 
        (slug, title, created, description, full_html, read_time, thumbnail, filename, server_filepath) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;`, [
            slug,
            title,
            date,
            description,
            full_html,
            read_time,
            thumbnail,
            additionalFile,
            serverFilepath,
        ]);
        const postTags = tagIds.map((tagId) => {
            return [newPost.rows[0].id, tagId];
        });
        if (postTags.length > 0) {
            yield pool.query(format('INSERT INTO "PostTag" (post_id, tag_id) VALUES %L RETURNING *;', postTags));
        }
        res.send({ message: "Created post!", post: newPost.rows[0] });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Something went wrong!", post: null });
    }
}));
router.get("/posts", auth_1.authenticateToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: posts } = yield pool.query(`SELECT * FROM "Post" ORDER BY "Post".created;`);
        res.send({ message: "Fetched all posts!", posts });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not fetch all posts!", posts: [] });
    }
}));
router.get("/posts-minimal", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: posts } = yield pool.query(`SELECT "Post".id, "Post".title, "Post".created, 
         "Post".description, "Post".slug, "Post".read_time
         FROM "Post" ORDER BY "Post".created;
        `);
        if (posts.length === 0) {
            res.send({ message: "No posts!", posts: [] });
            return;
        }
        res.send({ message: "Fetched all posts!", posts });
    }
    catch (_b) {
        res.send({ message: "Could not fetch the posts!", posts: [] });
    }
}));
router.get("/posts/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const { rows: posts } = yield pool.query(`SELECT * FROM "Post" WHERE slug = $1;`, [slug]);
        if (posts.length === 0) {
            res.send({ message: "Could not find the post!", post: null });
            return;
        }
        const post = posts[0];
        const { rows: tags } = yield pool.query(`SELECT "Tag".title FROM "PostTag" JOIN "Tag" ON "PostTag".tag_id = "Tag".id WHERE "PostTag".post_id = $1`, [post["id"]]);
        res.send({
            message: "Fetched post",
            post: post,
            tags: tags.map((tag) => Object.values(tag)).flat(),
        });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not get the post!", post: null });
    }
}));
router.put("/posts/:id", auth_1.authenticateToken, upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postDataJson = JSON.parse(req.body.postData);
        const serverFilepath = req.body.filepath;
        const { id } = req.params;
        const { slug, title, date, description, full_html, tags, read_time, imageData, } = postDataJson;
        const thumbnailExists = imageData.filter((file) => file.type === "thumbnail");
        const thumbnail = thumbnailExists.length > 0 ? thumbnailExists[0].filename : null;
        const additionalFileExists = imageData.filter((file) => file.type === "file");
        const additionalFile = additionalFileExists.length > 0
            ? additionalFileExists[0].filename
            : null;
        const { rows: updatedPosts } = yield pool.query(`
      UPDATE "Post" SET 
      slug = $1, title = $2, updated = $3, 
      description = $4, full_html = $5, read_time = $6,
      thumbnail = $7, filename = $8, server_filepath = $9
      WHERE id = $10
      RETURNING *;`, [
            slug,
            title,
            date,
            description,
            full_html,
            read_time,
            thumbnail,
            additionalFile,
            serverFilepath,
            id,
        ]);
        if (updatedPosts.length === 0) {
            res.send({ message: "Could not update the post!", post: null });
            return;
        }
        yield pool.query(`
      DELETE FROM "PostTag" WHERE "PostTag".post_id = $1
    `, [id]);
        yield pool.query(`
      DELETE FROM "Tag" t
      WHERE NOT EXISTS (
        SELECT FROM "PostTag" pt
        WHERE t.id = pt.tag_id
      );
    `);
        var tagIds = [];
        for (const tag of tags) {
            try {
                const newTags = yield pool.query('INSERT INTO "Tag" (title) VALUES ($1) RETURNING *;', [tag]);
                tagIds.push(newTags.rows[0].id);
            }
            catch (_c) {
                const existingTag = yield pool.query('SELECT * FROM "Tag" WHERE title = $1 RETURNING *;', [tag]);
                tagIds.push(existingTag.rows[0].id);
            }
        }
        const postTags = tagIds.map((tagId) => {
            return [updatedPosts[0].id, tagId];
        });
        if (postTags.length > 0) {
            yield pool.query(format('INSERT INTO "PostTag" (post_id, tag_id) VALUES %L RETURNING *;', postTags));
        }
        const dirPath = `./public/${serverFilepath}`;
        yield fs.readdir(dirPath, (err, files) => {
            if (err)
                throw err;
            for (const file of files) {
                if (file !== updatedPosts[0].thumbnail &&
                    file !== updatedPosts[0].filename) {
                    fs.unlink(path_1.default.join(dirPath, file), (err) => {
                        if (err)
                            throw err;
                    });
                }
            }
        });
        res.send({ message: "Updated the post!", post: updatedPosts[0] });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not update the post!", post: null });
    }
}));
router.delete("/posts/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rows: deletedPosts } = yield pool.query('DELETE FROM "Post" WHERE id = $1 RETURNING "Post".id, "Post".title, "Post".server_filepath AS "serverFilepath";', [id]);
        if (deletedPosts.length === 0) {
            res.send({ message: "Could not delete the post!", post: null });
            return;
        }
        const deletedPost = deletedPosts[0];
        const deletedDir = deletedPost.serverFilepath;
        fs.rmSync(`./public/${deletedDir}`, { recursive: true, force: true });
        yield pool.query(`
      DELETE FROM "Tag" t
      WHERE NOT EXISTS (
        SELECT FROM "PostTag" pt
        WHERE t.id = pt.tag_id
      );
    `);
        res.json({ message: "Deleted post!", post: deletedPost });
    }
    catch (err) {
        console.error(err.message);
        res.json({ message: "Something went wrong!", post: null });
    }
}));
module.exports = router;
//# sourceMappingURL=posts.js.map