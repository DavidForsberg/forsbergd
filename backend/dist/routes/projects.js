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
const uploadFiles_1 = require("../middleware/uploadFiles");
const auth_1 = require("../middleware/auth");
const path_1 = __importDefault(require("path"));
const fs = require("fs");
const upload = (0, uploadFiles_1.initFilesystem)();
router.post("/projects", auth_1.authenticateToken, upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectDataJson = JSON.parse(req.body.projectData);
        const serverFilePath = req.body.filepath;
        const { name, link, description, type, date, techs, imageData, roles } = projectDataJson;
        const { rows: newProjects } = yield pool.query('INSERT INTO "Project" (name, link, description, type, created, roles, server_filepath) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [name, link, description, type, date, roles, serverFilePath]);
        const newProject = newProjects[0];
        techs.forEach((tech) => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query('INSERT INTO "ProjectTech" (project_id, name) VALUES ($1, $2) RETURNING *;', [newProject.id, tech]);
        }));
        imageData.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query('INSERT INTO "ProjectImage" (project_id, filename, device) VALUES ($1, $2, $3) RETURNING *;', [newProject.id, image.filename, image.device]);
        }));
        res.json({
            message: "Successfully created new project!",
            project: newProject,
        });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not create the new project!", project: null });
    }
}));
router.get("/projects", auth_1.authenticateToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: allProjects } = yield pool.query(`
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
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not fetch all projects!", projects: [] });
    }
}));
router.get("/projects/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rows: foundProjects } = yield pool.query(`
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
      `, [id]);
        if (foundProjects.length === 0) {
            res.json({ message: `Error finding project with id ${id}` });
            return;
        }
        res.json({ message: "Fetched project!", project: foundProjects[0] });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not fetch the project!", project: null });
    }
}));
router.put("/projects/:id", auth_1.authenticateToken, upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectDataJson = JSON.parse(req.body.projectData);
        const serverFilepath = req.body.filepath;
        const { id } = req.params;
        const { name, link, description, type, roles, date, techs, imageData } = projectDataJson;
        const { rows: updatedProjects } = yield pool.query(`UPDATE "Project" 
        SET name = $1, link = $2, description = $3, type = $4, roles = $5, server_filepath = $6, updated = $7 
        WHERE id = $8
        RETURNING "Project".id, "Project".name, 
        "Project".server_filepath as serverFilepath;
        `, [name, link, description, type, roles, serverFilepath, date, id]);
        if (updatedProjects.length === 0) {
            res.json({ message: "Could not update project" });
            return;
        }
        const updatedProject = updatedProjects[0];
        yield pool.query('DELETE FROM "ProjectTech" WHERE project_id = $1;', [
            id,
        ]);
        techs.forEach((tech) => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query('INSERT INTO "ProjectTech" (project_id, name) VALUES ($1, $2) RETURNING *;', [id, tech]);
        }));
        const { rows: deletedImages } = yield pool.query('DELETE FROM "ProjectImage" WHERE project_id = $1 RETURNING "ProjectImage".filename;', [id]);
        imageData.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query('INSERT INTO "ProjectImage" (project_id, filename, device) VALUES ($1, $2, $3) RETURNING *;', [id, image.filename, image.device]);
        }));
        const dirPath = `./public/${serverFilepath}`;
        yield fs.readdir(dirPath, (err, files) => {
            if (err)
                throw err;
            for (const file of files) {
                if (deletedImages.some((deletedImg) => deletedImg.filename === file)) {
                    fs.unlink(path_1.default.join(dirPath, file), (err) => {
                        if (err)
                            throw err;
                    });
                }
            }
        });
        res.json({
            message: "Successfully updated project!",
            project: updatedProject,
        });
    }
    catch (err) {
        res.send({ message: "Could not update the project!", project: null });
    }
}));
router.delete("/projects/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rows: deletedProjects } = yield pool.query(`
        DELETE FROM "Project" WHERE id = $1 
        RETURNING "Project".id, "Project".name, 
        "Project".server_filepath AS "serverFilepath";`, [id]);
        if (deletedProjects.length === 0) {
            res.json({ message: "Could not delete the project!" });
            return;
        }
        const deletedProject = deletedProjects[0];
        const deletedDir = deletedProject.serverFilepath;
        fs.rmSync(`./public/${deletedDir}`, { recursive: true, force: true });
        res.json({ message: "Project deleted!", project: deletedProject });
    }
    catch (err) {
        console.log(err);
        res.send({ message: "Could not delete the project!", project: null });
    }
}));
module.exports = router;
//# sourceMappingURL=projects.js.map