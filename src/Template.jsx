import { useEffect, useState } from "react";
import "./App.css";

const Box = ({ style, children }) => {
  return (
    <div
      style={{
        ...style,
        display: "flex",
        flexDirection: "row",
        padding: "10px",
        border: "1px solid #000",
      }}
    >
      {children}
    </div>
  );
};

const Text = ({ style, content }) => {
  return (
    <div
      style={{
        ...style,
        fontSize: "32px",
        color: "black",
        fontFamily: "Arial",
      }}
    >
      {content}
    </div>
  );
};

const Template = () => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem("MyPage"));
    if (savedContent) {
      setContent(savedContent.components);
    }
  }, []);

  const renderComponent = (component) => {
    if (component.type === "Box") {
      return (
        <Box>
          {component.components?.map((child, index) => (
            <div key={index}>{renderComponent(child)}</div>
          ))}
        </Box>
      );
    } else if (component.type === "Text") {
      return <Text content={component.content} />;
    }
    return null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "lightgray",
      }}
    >
      <h1>Website Builder Template</h1>
      <div style={{ flex: 1 }}>
        {content.map((component, index) => (
          <div key={index}>{renderComponent(component)}</div>
        ))}
      </div>
    </div>
  );
};

export { Template, Box, Text };
