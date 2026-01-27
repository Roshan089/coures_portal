import React from "react";
import { Typography } from "@mui/material";

type RichTextDisplayProps = {
  content: string; // HTML string to render
};

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content }) => {
  return (
    <Typography
      component="div" // Use div to allow raw HTML rendering
      sx={{
        typography: "body1",
        color: "text.primary",
        "& strong": { fontWeight: "bold" },
        "& em": { fontStyle: "italic" },
        "& p": { marginBottom: 2 },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;
