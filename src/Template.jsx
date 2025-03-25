import { useEffect, useState } from "react";

import { Box, Section, Text } from "./components/customBlocks";
import "./App.css";

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
    } else if (component.type === "Section") {
      return (
        <Section>
          {component.components?.map((child, index) => (
            <div key={index}>{renderComponent(child)}</div>
          ))}
        </Section>
      );
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
