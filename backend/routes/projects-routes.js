import express from "express";
import Project from "../models/project.js";
import { exportWebsite } from "../util/exportWebsite.js";

const app = express();
const router = express.Router();

// GET: Get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// GET: Fetch a project by ID
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Create a new project
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }

  try {
    const newProject = new Project({
      name,
      pages: [], // start with no pages
    });

    await newProject.save();

    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// DELETE /api/projects/:projectId
router.delete("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await Project.deleteOne({ _id: projectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:projectId/pages", async (req, res) => {
  const { projectId, pageName } = req.params;
  const { name, path, components, html, css } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: "Project not found" });

  // Check if page already exists
  const existingPage = project.pages.find((p) => p.name === pageName);
  if (existingPage) {
    // Update page
    existingPage.path = path;
    existingPage.components = components;
    existingPage.html = html;
    existingPage.css = css;
  } else {
    // Add new page
    project.pages.push({ name, path, components: "", html: "", css: "" });
  }

  await project.save();
  res.json({ success: true, project });
});

// Save or update a page in an existing project
router.post("/:projectId/pages/:pageName", async (req, res) => {
  const { projectId, pageName } = req.params;
  const { name, path, components, html, css } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: "Project not found" });

  // Check if page already exists
  const existingPage = project.pages.find((p) => p.name === pageName);
  if (existingPage) {
    // Update page
    existingPage.path = path;
    existingPage.components = components;
    existingPage.html = html;
    existingPage.css = css;
  } else {
    // Add new page
    project.pages.push({ name, path, components: "", html: "", css: "" });
  }

  await project.save();
  res.json({ success: true, project });
});

// Get specific page from a project
router.get("/api/projects/:projectId/pages/:pageName", async (req, res) => {
  const { projectId, pageName } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const page = project.pages.find((p) => p.name === pageName);
  if (!page) return res.status(404).json({ error: "Page not found" });

  res.json(page);
});

// Delete specific page from a project
router.delete("/:projectId/pages/:pageName", async (req, res) => {
  const { projectId, pageName } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const pageIndex = project.pages.findIndex((p) => p.name === pageName);
    if (pageIndex === -1) return res.status(404).json({ error: "Page not found" });

    project.pages.splice(pageIndex, 1); // Remove the page from the array

    await project.save();

    res.json({ success: true, message: `Page '${pageName}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API route to trigger export
router.post("/export", async (req, res) => {
  const { projectId } = req.body;

  try {
    const result = await exportWebsite(projectId);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
