var express = require("express");
var router = express.Router();
const pool = require("../db");
import { Request, Response } from "express";
import { initFilesystem } from "../middleware/uploadFiles";
import { authenticateToken } from "../middleware/auth";
import path from "path";
const fs = require("fs");
const format = require("pg-format");
const upload = initFilesystem();

type PostResponse = {
  message: string;
  post?: any;
  posts?: Array<any>;
  tags?: Array<any>;
};

type PostCreate = {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  full_html: string;
  tags: Array<string>;
  filename: string;
  thumbnail: string;
  read_time: string;
  imageData: Array<any>;
};

type PostCreateBody = {
  postData: string;
  filepath: string;
};

// Add New Post
router.post(
  "/posts",
  authenticateToken,
  upload.any(),
  async (
    req: Request<{}, {}, PostCreateBody, {}>,
    res: Response<PostResponse>
  ) => {
    try {
      const postDataJson: PostCreate = JSON.parse(req.body.postData);
      const serverFilepath = req.body.filepath;
      const {
        slug,
        title,
        date,
        description,
        full_html,
        tags,
        read_time,
        imageData,
      } = postDataJson;

      // Add new tags into Tag table, or get existing
      var tagIds = [] as Array<number>;
      for (const tag of tags) {
        try {
          const newTags = await pool.query(
            'INSERT INTO "Tag" (title) VALUES ($1) RETURNING *;',
            [tag]
          );
          tagIds.push(newTags.rows[0].id);
        } catch {
          const existingTag = await pool.query(
            'SELECT * FROM "Tag" WHERE title = $1 RETURNING *;',
            [tag]
          );
          tagIds.push(existingTag.rows[0].id);
        }
      }

      const thumbnailExists = imageData.filter(
        (file) => file.type === "thumbnail"
      );
      const thumbnail =
        thumbnailExists.length > 0 ? thumbnailExists[0].filename : null;

      const additionalFileExists = imageData.filter(
        (file) => file.type === "file"
      );
      const additionalFile =
        additionalFileExists.length > 0
          ? additionalFileExists[0].filename
          : null;

      const newPost = await pool.query(
        `INSERT INTO "Post" 
        (slug, title, created, description, full_html, read_time, thumbnail, filename, server_filepath) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;`,
        [
          slug,
          title,
          date,
          description,
          full_html,
          read_time,
          thumbnail,
          additionalFile,
          serverFilepath,
        ]
      );

      // Create PostTag (post_id, tag_id)
      const postTags = tagIds.map((tagId) => {
        return [newPost.rows[0].id, tagId];
      });

      // Save new PostTag(s)
      if (postTags.length > 0) {
        await pool.query(
          format(
            'INSERT INTO "PostTag" (post_id, tag_id) VALUES %L RETURNING *;',
            postTags
          )
        );
      }

      res.send({ message: "Created post!", post: newPost.rows[0] });
    } catch (err) {
      console.log(err);
      res.send({ message: "Something went wrong!", post: null });
    }
  }
);

// Get All Posts
router.get(
  "/posts",
  authenticateToken,
  async (_: Request, res: Response<PostResponse>) => {
    try {
      const { rows: posts } = await pool.query(
        `SELECT * FROM "Post" ORDER BY "Post".created;`
      );
      res.send({ message: "Fetched all posts!", posts });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not fetch all posts!", posts: [] });
    }
  }
);

// Get client-side Posts
router.get(
  "/posts-minimal",
  async (_: Request, res: Response<PostResponse>) => {
    try {
      const { rows: posts } = await pool.query(
        `SELECT "Post".id, "Post".title, "Post".created, 
         "Post".description, "Post".slug, "Post".read_time
         FROM "Post" ORDER BY "Post".created;
        `
      );

      if (posts.length === 0) {
        res.send({ message: "No posts!", posts: [] });
        return;
      }

      res.send({ message: "Fetched all posts!", posts });
    } catch {
      res.send({ message: "Could not fetch the posts!", posts: [] });
    }
  }
);

// Get a post
router.get(
  "/posts/:slug",
  async (req: Request, res: Response<PostResponse>) => {
    try {
      const { slug } = req.params;

      const { rows: posts } = await pool.query(
        `SELECT * FROM "Post" WHERE slug = $1;`,
        [slug]
      );

      if (posts.length === 0) {
        res.send({ message: "Could not find the post!", post: null });
        return;
      }

      const post = posts[0];

      const { rows: tags }: { rows: Array<any> } = await pool.query(
        `SELECT "Tag".title FROM "PostTag" JOIN "Tag" ON "PostTag".tag_id = "Tag".id WHERE "PostTag".post_id = $1`,
        [post["id"]]
      );

      res.send({
        message: "Fetched post",
        post: post,
        tags: tags.map((tag: any) => Object.values(tag)).flat(),
      });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not get the post!", post: null });
    }
  }
);

// Update a Post
router.put(
  "/posts/:id",
  authenticateToken,
  upload.any(),
  async (req: Request, res: Response<PostResponse>) => {
    try {
      const postDataJson: PostCreate = JSON.parse(req.body.postData);
      const serverFilepath = req.body.filepath;
      const { id } = req.params;
      const {
        slug,
        title,
        date,
        description,
        full_html,
        tags,
        read_time,
        imageData,
      } = postDataJson;

      const thumbnailExists = imageData.filter(
        (file) => file.type === "thumbnail"
      );
      const thumbnail =
        thumbnailExists.length > 0 ? thumbnailExists[0].filename : null;

      const additionalFileExists = imageData.filter(
        (file) => file.type === "file"
      );
      const additionalFile =
        additionalFileExists.length > 0
          ? additionalFileExists[0].filename
          : null;

      // Update post
      const { rows: updatedPosts } = await pool.query(
        `
      UPDATE "Post" SET 
      slug = $1, title = $2, updated = $3, 
      description = $4, full_html = $5, read_time = $6,
      thumbnail = $7, filename = $8, server_filepath = $9
      WHERE id = $10
      RETURNING *;`,
        [
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
        ]
      );

      if (updatedPosts.length === 0) {
        res.send({ message: "Could not update the post!", post: null });
        return;
      }

      // Delete old tags
      await pool.query(
        `
      DELETE FROM "PostTag" WHERE "PostTag".post_id = $1
    `,
        [id]
      );

      await pool.query(`
      DELETE FROM "Tag" t
      WHERE NOT EXISTS (
        SELECT FROM "PostTag" pt
        WHERE t.id = pt.tag_id
      );
    `);

      // Create new tags
      var tagIds = [] as Array<number>;
      for (const tag of tags) {
        try {
          const newTags = await pool.query(
            'INSERT INTO "Tag" (title) VALUES ($1) RETURNING *;',
            [tag]
          );
          tagIds.push(newTags.rows[0].id);
        } catch {
          const existingTag = await pool.query(
            'SELECT * FROM "Tag" WHERE title = $1 RETURNING *;',
            [tag]
          );
          tagIds.push(existingTag.rows[0].id);
        }
      }

      // Create PostTag (post_id, tag_id)
      const postTags = tagIds.map((tagId) => {
        return [updatedPosts[0].id, tagId];
      });

      // Save new PostTag(s)
      if (postTags.length > 0) {
        await pool.query(
          format(
            'INSERT INTO "PostTag" (post_id, tag_id) VALUES %L RETURNING *;',
            postTags
          )
        );
      }

      // Delete old files in directory
      const dirPath = `./public/${serverFilepath}`;
      await fs.readdir(dirPath, (err: Error, files: Array<any>) => {
        if (err) throw err;

        for (const file of files as Array<string>) {
          if (
            file !== updatedPosts[0].thumbnail &&
            file !== updatedPosts[0].filename
          ) {
            fs.unlink(path.join(dirPath, file), (err: Error) => {
              if (err) throw err;
            });
          }
        }
      });
      res.send({ message: "Updated the post!", post: updatedPosts[0] });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not update the post!", post: null });
    }
  }
);

// Delete a Post [DONE]
router.delete(
  "/posts/:id",
  authenticateToken,
  async (req: Request, res: Response<PostResponse>) => {
    try {
      const { id } = req.params;

      const { rows: deletedPosts } = await pool.query(
        'DELETE FROM "Post" WHERE id = $1 RETURNING "Post".id, "Post".title, "Post".server_filepath AS "serverFilepath";',
        [id]
      );

      if (deletedPosts.length === 0) {
        res.send({ message: "Could not delete the post!", post: null });
        return;
      }

      const deletedPost = deletedPosts[0];

      const deletedDir: string = deletedPost.serverFilepath;
      fs.rmSync(`./public/${deletedDir}`, { recursive: true, force: true });

      // Check if tags are unreferenced
      await pool.query(`
      DELETE FROM "Tag" t
      WHERE NOT EXISTS (
        SELECT FROM "PostTag" pt
        WHERE t.id = pt.tag_id
      );
    `);

      res.json({ message: "Deleted post!", post: deletedPost });
    } catch (err) {
      console.error(err.message);
      res.json({ message: "Something went wrong!", post: null });
    }
  }
);

module.exports = router;
