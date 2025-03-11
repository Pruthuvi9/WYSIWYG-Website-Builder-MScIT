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

export { Box, Text };
