import { writeFileSync, readFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";

export const compileTailwind = (htmlContent, inputCssPath = "index.css", outputDir = "./exports") => {
  const tempHtmlPath = path.join(outputDir, "exported.html");
  const outputCssPath = path.join(outputDir, "output.css");

  try {
    // Save the HTML temporarily for Tailwind to scan
    writeFileSync(tempHtmlPath, htmlContent);
    console.log("Saved exported HTML at", tempHtmlPath);

    // Compile TailwindCSS based on the HTML
    execSync(`npx @tailwindcss/cli -o ${outputCssPath}`);
    console.log("Tailwind compilation completed");

    // Read the compiled CSS
    const compiledCss = readFileSync(outputCssPath, "utf-8");
    if (!compiledCss) throw new Error("Compiled CSS is empty.");

    return compiledCss;
  } catch (err) {
    console.error("Tailwind compilation failed:", err);
    throw new Error("Tailwind compilation failed");
  }
};
