var express = require("express");
var router = express.Router();
const pool = require("../db");
import { Request, Response } from "express";
import { initFilesystem } from "../middleware/uploadfiles";
import { authenticateToken } from "../middleware/auth";
import path from "path";
const fs = require("fs");
const upload = initFilesystem();

type ProjectResponse = {
  message: string;
  project?: any;
  projects?: Array<any>;
};

type ProjectTech = {
  id: number;
  name: string;
  project_id: number;
};

type ProjectImage = {
  id: number;
  filename: string;
  device: "desktop" | "laptop" | "ipad" | "iphone" | "android";
  project_id: number;
};

type Project = {
  id: number;
  name: string;
  link: string;
  description: string;
  type: string;
  created: string;
  updated?: Date;
  roles: string;
  serverFilepath: string;
};

type ProjectCreate = {
  id: number;
  name: string;
  link: string;
  description: string;
  type: string;
  date: string;
  roles: string;
  techs: Array<string>;
  imageData: Array<ProjectImage>;
};

type ProjectRead = {
  name: string;
  techs: Array<ProjectTech>;
  images: Array<ProjectImage>;
};

type ProjectUpdate = {
  id: number;
  name: string;
  link: string;
  description: string;
  type: string;
  roles: string;
  serverFilepath: string;
  date: string;
  techs: Array<ProjectTech>;
  imageData: Array<ProjectImage>;
};

type ProjectCreateBody = {
  projectData: string;
  filepath: string;
};

// Create project, pgformat?
router.post(
  "/projects",
  authenticateToken,
  upload.any(),
  async (
    req: Request<{}, {}, ProjectCreateBody, {}>,
    res: Response<ProjectResponse>
  ) => {
    try {
      const projectDataJson: ProjectCreate = JSON.parse(req.body.projectData);
      const serverFilePath = req.body.filepath;
      const { name, link, description, type, date, techs, imageData, roles } =
        projectDataJson;

      // create project
      const { rows: newProjects }: { rows: Array<Project> } = await pool.query(
        'INSERT INTO "Project" (name, link, description, type, created, roles, server_filepath) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [name, link, description, type, date, roles, serverFilePath]
      );

      const newProject = newProjects[0];

      // create connected techs, fix the looping
      techs.forEach(async (tech) => {
        await pool.query(
          'INSERT INTO "ProjectTech" (project_id, name) VALUES ($1, $2) RETURNING *;',
          [newProject.id, tech]
        );
      });

      // create connected images, fix the looping
      imageData.forEach(async (image) => {
        await pool.query(
          'INSERT INTO "ProjectImage" (project_id, filename, device) VALUES ($1, $2, $3) RETURNING *;',
          [newProject.id, image.filename, image.device]
        );
      });

      res.json({
        message: "Successfully created new project!",
        project: newProject,
      });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not create the new project!", project: null });
    }
  }
);

// Read projects with techs
router.get(
  "/projects",
  authenticateToken,
  async (_: Request, res: Response<ProjectResponse>) => {
    try {
      // https://stackoverflow.com/questions/12464037/two-sql-left-joins-produce-incorrect-result/12464135#12464135
      const { rows: allProjects }: { rows: Array<ProjectRead> } =
        await pool.query(`
    SELECT u.id, u.name, u.link, u.description, u.created, u.type,
    g.techs, f.images
    FROM   "Project" u
    LEFT   JOIN (
    SELECT project_id, array_agg("ProjectTech".name) AS techs
    FROM   "ProjectTech"
    GROUP  BY project_id
    ) g    ON g.project_id = u.id
    LEFT   JOIN (
    SELECT project_id, array_agg("ProjectImage".filename) AS images
    FROM   "ProjectImage"
    GROUP  BY project_id
    ) f ON f.project_id = u.id
    ORDER  BY u.id;
  `);

      res.json({ message: "Fetched all projects", projects: allProjects });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not fetch all projects!", projects: [] });
    }
  }
);

// Read project
router.get(
  "/projects/:id",
  authenticateToken,
  async (req: Request<{ id: number }>, res: Response<ProjectResponse>) => {
    try {
      const { id } = req.params;

      const { rows: foundProjects }: { rows: Array<ProjectRead> } =
        await pool.query(
          `
        SELECT u.id, u.name, u.link, u.description, u.created, u.type, u.roles, u.server_filepath as "serverFilepath"
        , g.techs, f.images
        FROM   "Project" u
        LEFT   JOIN (
        SELECT project_id, array_agg("ProjectTech".name) AS techs
        FROM   "ProjectTech"
        GROUP  BY project_id
        ) g ON g.project_id = u.id
        LEFT   JOIN (
        SELECT project_id, array_agg("ProjectImage".filename) AS images
        FROM   "ProjectImage"
        GROUP  BY project_id
        ) f ON f.project_id = u.id
        WHERE u.id = $1
        ORDER  BY u.id;
      `,
          [id]
        );

      if (foundProjects.length === 0) {
        res.json({ message: `Error finding project with id ${id}` });
        return;
      }

      res.json({ message: "Fetched project!", project: foundProjects[0] });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not fetch the project!", project: null });
    }
  }
);

// Update project
router.put(
  "/projects/:id",
  authenticateToken,
  upload.any(),
  async (
    req: Request<{ id: number }, {}, ProjectCreateBody>,
    res: Response<ProjectResponse>
  ) => {
    /*
        1. Update Project table
        2. Update ProjectTech table
        3. Update ProjectImage table
        4. Delete project folder in public/
        5. Create project folder with new files
        
        - Fix process, dont delete project folder and create a new one.
            Instead only remove or add new images to the folder.
        - Same with tables ProjectImag, ProjectTech.
        - Could change ProjectTech and ProjectImage tables to cascade 
            on Project table update.
    */
    try {
      const projectDataJson: ProjectUpdate = JSON.parse(req.body.projectData);
      const serverFilepath = req.body.filepath;

      const { id } = req.params;
      const { name, link, description, type, roles, date, techs, imageData } =
        projectDataJson;

      // Update project
      const { rows: updatedProjects }: { rows: Array<ProjectUpdate> } =
        await pool.query(
          `UPDATE "Project" 
        SET name = $1, link = $2, description = $3, type = $4, roles = $5, server_filepath = $6, updated = $7 
        WHERE id = $8
        RETURNING "Project".id, "Project".name, 
        "Project".server_filepath as serverFilepath;
        `,
          [name, link, description, type, roles, serverFilepath, date, id]
        );

      if (updatedProjects.length === 0) {
        res.json({ message: "Could not update project" });
        return;
      }

      const updatedProject = updatedProjects[0];

      // Update techs (delete old, insert new)
      await pool.query('DELETE FROM "ProjectTech" WHERE project_id = $1;', [
        id,
      ]);
      techs.forEach(async (tech) => {
        await pool.query(
          'INSERT INTO "ProjectTech" (project_id, name) VALUES ($1, $2) RETURNING *;',
          [id, tech]
        );
      });

      // Update images (delete old, insert new)
      const { rows: deletedImages }: { rows: Array<ProjectImage> } =
        await pool.query(
          'DELETE FROM "ProjectImage" WHERE project_id = $1 RETURNING "ProjectImage".filename;',
          [id]
        );

      imageData.forEach(async (image) => {
        await pool.query(
          'INSERT INTO "ProjectImage" (project_id, filename, device) VALUES ($1, $2, $3) RETURNING *;',
          [id, image.filename, image.device]
        );
      });

      // Delete image in directory
      const dirPath = `./public/${serverFilepath}`;
      await fs.readdir(dirPath, (err: Error, files: Array<any>) => {
        if (err) throw err;

        for (const file of files as Array<string>) {
          if (
            deletedImages.some((deletedImg) => deletedImg.filename === file)
          ) {
            fs.unlink(path.join(dirPath, file), (err: Error) => {
              if (err) throw err;
            });
          }
        }
      });

      res.json({
        message: "Successfully updated project!",
        project: updatedProject,
      });
    } catch (err) {
      res.send({ message: "Could not update the project!", project: null });
    }
  }
);

// Delete project
router.delete(
  "/projects/:id",
  authenticateToken,
  async (req: Request, res: Response<ProjectResponse>) => {
    /* 
        1. delete project, will cascade connected ProjectTechs and ProjectImages
        2. delete, using fs, the public/project folder (server_filepath = "project/name") 
    */
    try {
      const { id } = req.params;
      const { rows: deletedProjects }: { rows: Array<Project> } =
        await pool.query(
          `
        DELETE FROM "Project" WHERE id = $1 
        RETURNING "Project".id, "Project".name, 
        "Project".server_filepath AS "serverFilepath";`,
          [id]
        );

      if (deletedProjects.length === 0) {
        res.json({ message: "Could not delete the project!" });
        return;
      }

      const deletedProject: Project = deletedProjects[0];
      const deletedDir: string = deletedProject.serverFilepath;

      fs.rmSync(`./public/${deletedDir}`, { recursive: true, force: true });

      res.json({ message: "Project deleted!", project: deletedProject });
    } catch (err) {
      console.log(err);
      res.send({ message: "Could not delete the project!", project: null });
    }
  }
);

module.exports = router;
