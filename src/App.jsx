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
        },
        // panels: {
        //   defaults: [
        //     {
        //       id: "panel-devices",
        //       el: ".panel_devices",
        //       buttons: [],
        //     },
        //   ],
        // },
        canvas: {
          styles: ["./grapes.css"],
        },
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
    <div className="WebBuilderApp">
      <button onClick={handleSave}>Save</button>
      <div className="Editor">
        <div id="blocks">
          <span>My Custom Blocks</span>
        </div>
        <div id="gjs" />
      </div>
      <Template />
    </div>
  );
}

export default App;
