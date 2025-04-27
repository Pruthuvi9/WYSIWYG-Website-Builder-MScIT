import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import grapesjs from "grapesjs";

import "../../index.css";
import "grapesjs/dist/css/grapes.min.css";
import MainHeader from "../../components/Navigation/MainHeader";

const baseUrl = `${window.location.protocol}//${window.location.host}`;

function Editor() {
  const { projectId, pageName } = useParams();

  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editorInstance = grapesjs.init({
        container: "#gjs",
        fromElement: false,

        storageManager: false,
        plugins: [],
        blockManager: {
          appendTo: "#blocks",
          blocks: [],
        },
        assetManager: {
          upload: "http://localhost:5000/api/upload",
          autoAdd: true,
          openAssetsOnDrop: true,
          assets: [],
        },

        canvas: {
          styles: [`${baseUrl}/grapes.css`, "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"],
        },
      });

      editorInstance.on("asset:upload:response", (response) => {
        console.log(response);
      });

      editorInstance.on("asset:open", async () => {
        if (editorInstance.AssetManager.getAll().length === 0) {
          // Only load once
          try {
            const res = await fetch("http://localhost:5000/api/assets");
            const { data } = await res.json();
            editorInstance.AssetManager.add(data);
          } catch (error) {
            console.error("Failed to fetch assets:", error);
          }
        }
      });

      editorInstance.setStyle("@tailwind base; @tailwind components; @tailwind utilities;");

      // Custom Code Block
      editorInstance.BlockManager.add("custom-code-block", {
        label: "Custom Code",
        category: "Code",
        content: {
          type: "custom-code",
          content: `<script>\n  console.log("Hello from custom code!");\n</script>`,
        },
      });

      editorInstance.DomComponents.addType("custom-code", {
        model: {
          defaults: {
            tagName: "div",
            editable: true,
            droppable: false,
            draggable: true,
            attributes: {
              class: "custom-code-block",
            },
            content: `<script>\n  console.log("Hello from custom code!");\n</script>`,
            stylable: false,
            copyable: true,
            highlightable: true,
            script: "",
          },

          toHTML() {
            const raw = this.get("content");
            return raw;
          },
        },

        view: {
          onRender() {
            const code = this.model.get("content");
            this.el.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${code
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</pre>`;

            this.el.contentEditable = true;

            this.el.addEventListener("blur", () => {
              const text = this.el.innerText;
              this.model.set("content", text);
            });
          },
        },
      });

      // Simple Div
      editorInstance.BlockManager.add("Div", {
        label: "Div",
        category: "Components",
        content: {
          type: "div",
          components: [],
          attributes: { class: "p-4" },
        },
      });

      // Text Block
      editorInstance.BlockManager.add("text-block", {
        label: "Text",
        category: "Components",
        content: {
          type: "text",
          content: "Edit your text here",
          attributes: { class: "text-gray-700" },
        },
      });

      // Image Block
      editorInstance.BlockManager.add("image-block", {
        label: "Image",
        category: "Media",
        content: {
          type: "image",
          attributes: { draggable: true },
        },
      });

      // Button Block
      editorInstance.BlockManager.add("button-block", {
        label: "Button",
        category: "Components",
        content: {
          type: "button",
          content: "Click me",
          attributes: { class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" },
        },
      });

      // Anchor Link Block
      editorInstance.BlockManager.add("link-block", {
        label: "Link",
        category: "Components",
        content: {
          type: "link",
          content: "Visit link",
          attributes: { href: "#", class: "text-blue-600 underline" },
        },
      });

      // Single Column Block
      editorInstance.BlockManager.add("column-block", {
        label: "Column",
        category: "Layout",
        content: {
          type: "div",
          components: [],
          attributes: { class: "w-full" },
        },
      });

      // Row with 2 Columns Block
      editorInstance.BlockManager.add("row-block", {
        label: "2 Columns",
        category: "Layout",
        content: {
          type: "div",
          components: [
            {
              type: "div",
              components: [],
              attributes: { class: "w-1/2 p-2" },
            },
            {
              type: "div",
              components: [],
              attributes: { class: "w-1/2 p-2" },
            },
          ],
          attributes: { class: "flex" },
        },
      });

      // Simple Menu Bar Block
      editorInstance.BlockManager.add("menu-block", {
        label: "Menu Bar",
        category: "Components",
        content: {
          type: "nav",
          components: [
            {
              type: "link",
              content: "Home",
              attributes: { href: "#", class: "px-4 py-2" },
            },
            {
              type: "link",
              content: "About",
              attributes: { href: "#", class: "px-4 py-2" },
            },
            {
              type: "link",
              content: "Contact",
              attributes: { href: "#", class: "px-4 py-2" },
            },
          ],
          attributes: { class: "flex bg-gray-100 p-2" },
        },
      });

      const am = editorInstance.AssetManager;
      am.add;

      const loadContent = async () => {
        try {
          const savedContent = await loadPageFromProject();
          if (savedContent) {
            editorInstance.setComponents(savedContent.components);
          }
        } catch (error) {
          console.error("Failed to load content:", error);
        }
      };

      loadContent();

      editorRef.current = editorInstance;
      setEditor(editorInstance);
    }
  }, []);

  // Get content from DB
  const loadPageFromProject = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch project:", data.error);
        return null;
      }

      const page = data.pages?.find((p) => p.name === pageName);
      return page;
    } catch (err) {
      console.error("Failed to load page from DB:", err);
      return null;
    }
  };

  // Save a page to a project
  const savePageToProject = async () => {
    if (!editorRef.current) return;

    const path = ""; // if available
    const components = editorRef.current.getComponents();
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();

    const payload = {
      name: pageName,
      path,
      components: components.toJSON(),
      html,
      css,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/pages/${pageName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Page saved successfully!", data);
      } else {
        console.error("Failed to save page:", data.error);
      }
    } catch (error) {
      console.error("Error while saving:", error);
    }
  };

  // Undo/redo functionality
  const undoChange = () => {
    const um = editorRef.current.UndoManager;
    if (editorRef.current) {
      um.undo();
    }
  };

  const redoChange = () => {
    const um = editorRef.current.UndoManager;
    if (editorRef.current) {
      um.redo();
    }
  };

  const handlePreview = async () => {
    if (!editorRef.current) return;

    const html = editorRef.current.getHtml();

    const previewHtml = `
    <html>
      <head><meta charset="UTF-8"><title>Preview</title></head>
      <body>${html}</body>
    </html>
    `;

    const res = await fetch("http://localhost:5000/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: previewHtml }),
    });

    const data = await res.json();

    if (data.css) {
      const compiledCss = data.css;

      const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>${compiledCss}</style>  <!-- Include compiled Tailwind CSS -->
      </head>
      <body>
        ${html}  <!-- HTML generated by GrapesJS with Tailwind classes -->
      </body>
      </html>`;

      // Open preview in a new window
      const previewWindow = window.open("", "_blank");
      previewWindow.document.open();
      previewWindow.document.writeln(fullHtml);
      previewWindow.document.close();
    } else {
      console.error("Error: No CSS was generated. Please check the Tailwind configuration.");
    }
  };

  return (
    <>
      <MainHeader />
      <div className="WebBuilderApp w-screen bg-black">
        <div className="flex">
          <button className="text-white bg-sky-500/100 px-5 py-1 rounded-full" onClick={savePageToProject}>
            Save
          </button>
          <button className="text-white bg-green-500 px-5 py-1 rounded-full ml-2" onClick={handlePreview}>
            Preview
          </button>
          <button className="text-white bg-green-500 px-5 py-1 rounded-full ml-2" onClick={undoChange}>
            Undo
          </button>
          <button className="text-white bg-green-500 px-5 py-1 rounded-full ml-2" onClick={redoChange}>
            Redo
          </button>
        </div>
        <div className="Editor flex flex-row w-full">
          <div id="blocks" className="flex-1 p-4 bg-white">
            <span>Blocks</span>
          </div>
          <div id="gjs" className="box-border grow-[7] border-2" />
        </div>
      </div>
    </>
  );
}

export default Editor;
