import fs from "fs-extra";
import path from "path";
import Project from "../models/project.js";
import { compileTailwind } from "./compileTailwind.js";

const outputDirectory = "./exports";

export const exportWebsite = async (projectId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    const projectFolder = path.join(outputDirectory, project.name);
    await fs.ensureDir(projectFolder);

    for (const page of project.pages) {
      const pageFolder = path.join(projectFolder, page.path || page.name);
      await fs.ensureDir(pageFolder);

      const htmlContent = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css"></link>
  <title>${page.name}</title>
</head>
<body>
  ${page.html}
</body>
</html>`;

      const compiledCss = compileTailwind(htmlContent);

      await fs.writeFile(path.join(pageFolder, "styles.css"), compiledCss);
      await fs.writeFile(path.join(pageFolder, "index.html"), htmlContent);
    }

    console.log("Website exported successfully!");
    return { success: true, message: "Website exported!" };
  } catch (error) {
    console.error("Error exporting website:", error);
    return { success: false, error: error.message };
  }
};
