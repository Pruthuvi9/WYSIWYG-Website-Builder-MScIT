import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Editor from "./pages/Editor/Editor.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import Project from "./components/Project/Project.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:projectId/pages/:pageName/editor" element={<Editor />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<Project />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
