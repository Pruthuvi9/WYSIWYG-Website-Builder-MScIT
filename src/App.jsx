import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";

import { Template } from "./Template";
import "./App.css";
import "grapesjs/dist/css/grapes.min.css";

function App() {
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editorInstance = grapesjs.init({
        container: "#gjs",
        fromElement: false,
        // height: "100%",
        // width: "auto",
        storageManager: false,
        blockManager: {
          appendTo: "#blocks",
          blocks: [
            {
              id: "section", // id is mandatory
              label: "<b>Section</b>", // You can use HTML/SVG inside labels
              attributes: { class: "gjs-block-section" },
              content: `<section>
                <h1>This is a simple title</h1>
                <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
              </section>`,
            },
            {
              id: "text",
              label: "Text",
              content: '<div data-gjs-type="text">Insert your text here</div>',
            },
            {
              id: "image",
              label: "Image",
              // Select the component once it's dropped
              select: true,
              // You can pass components as a JSON instead of a simple HTML string,
              // in this case we also use a defined component type `image`
              content: { type: "image" },
              // This triggers `active` event on dropped components and the `image`
              // reacts by opening the AssetManager
              activate: true,
            },
          ],
        },
        panels: {
          defaults: [],
        },
        canvas: {
          styles: ["./grapes.css"],
        },
      });

      editorInstance.BlockManager.add("box-block", {
        label: "Section",
        content: {
          type: "Section",
          components: [],
          attributes: { class: "section" },
        },
        category: "Components",
      });
      
      editorInstance.BlockManager.add("box-block", {
        label: "Box",
        content: {
          type: "Box",
          components: [],
          attributes: { class: "box-block" },
        },
        category: "Components",
      });

      editorInstance.BlockManager.add("text-block", {
        label: "Text",
        content: {
          type: "Text",
          content: "Hello",
        },
        category: "Components",
      });

      const savedContent = JSON.parse(localStorage.getItem("MyPage"));
      if (savedContent) {
        editorInstance.setComponents(savedContent.components);
      }

      editorRef.current = editorInstance;
      setEditor(editorInstance);
    }
  }, []);

  const handleSave = () => {
    if (editorRef.current) {
      const components = editorRef.current.getComponents();
      const savedContent = {
        components: components.toJSON(),
      };
      localStorage.setItem("MyPage", JSON.stringify(savedContent));
    }
  };

  return (
    <div className="WebBuilderApp w-screen bg-black">
      <button className="text-white bg-sky-500/100 px-5 py-1 rounded-full" onClick={handleSave}>
        Save
      </button>
      <div className="Editor flex flex-row w-full">
        <div id="blocks" className="flex-1 p-4 bg-white">
          <span>My Custom Blocks</span>
        </div>
        <div id="gjs" className="box-border grow-[7]" />
      </div>
      <Template />
    </div>
  );
}

export default App;
