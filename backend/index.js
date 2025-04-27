import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer, { diskStorage } from "multer";
import { readdirSync } from "fs";
import path from "path";
import mongoose from "mongoose";
import Project from "./models/project.js";
import projectRoutes from "./routes/projects-routes.js";
import { compileTailwind } from "./util/compileTailwind.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const { json } = bodyParser;
const PORT = 5000;

// dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(json());
app.use(express.static("exports"));
// app.use(express.static("uploads")); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://pruthuvi:dOeReQc3UTNQ6ntk@cluster0.e2yqvqx.mongodb.net/WYSIWYG?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo error:", err));

// Configure multer for image upload
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Project routes
app.use("/api/projects", projectRoutes);

// Upload images route
app.post("/api/upload", upload.array("files[]"), (req, res) => {
  const uploadedFiles = req.files.map((file) => ({
    src: `http://localhost:${PORT}/uploads/${file.filename}`,
  }));
  res.json({ data: uploadedFiles });
});

// Serve a list of uploaded assets
app.get("/api/assets", (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, "uploads");
    const files = readdirSync(uploadsDir);

    const assets = files.map((file) => ({
      src: `http://localhost:${PORT}/uploads/${file}`,
      type: file.type,
    }));

    res.json({ data: assets });
  } catch (err) {
    console.error("Error reading assets:", err);
    res.status(500).json({ error: "Failed to load assets" });
  }
});

app.post("/export", (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: "HTML content required" });

  try {
    const compiledCss = compileTailwind(html);
    return res.json({ css: compiledCss });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
