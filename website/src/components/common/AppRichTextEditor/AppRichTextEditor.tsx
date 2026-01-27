import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import {
  Slate,
  withReact,
  Editable,
  useSlate,
  RenderElementProps,
} from "slate-react";
import { ICON_MAPPING } from "./icon-mapping"; // Import the icon mapping
import { FormatAlignLeft } from "@mui/icons-material";
import LinkButton from "./LinkButton";

// List Types
const LIST_TYPES = ["numbered-list", "bulleted-list"];

interface AppRichTextEditorProps {
  value?: any; // The value passed from React Hook Form
  onChange?: (value: any) => void; // Function to update the value in React Hook Form
  error?: boolean;
  helperText?: string;
}

// AppRichTextEditor component
const AppRichTextEditor: React.FC<AppRichTextEditorProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  const [editorValue, setEditorValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const editor = useMemo(() => withReact(createEditor()), []);

  const handleChange = (value: any) => {
    console.log("values in editor", value);
    setEditorValue(value);

    // Extract plain text from Slate editor value
    // Convert the editor value to a JSON string
    const jsonString = JSON.stringify(value); // This serializes the array into a string
    console.log("jsonSting", jsonString);
    onChange(jsonString); // Pass the JSON string back to React Hook Form
  };

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
        <Box
          bgcolor="info.main"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            width: "100%",
            borderRadius: "12px",
          }}
        >
          {/* Toolbar buttons in a responsive flexbox layout */}
          <Box
            sx={
              {
                // flexWrap: "wrap",
              }
            }
          >
            <MarkButton format="bold" icon="bold" />
            <MarkButton format="italic" icon="italic" />
            <MarkButton format="underline" icon="underline" />
            <MarkButton format="code" icon="code" />
          </Box>

          {/* Add text alignment buttons inside a dropdown */}
          <Box sx={{ display: "flex" }}>
            <DropdownAlignmentButton />
          </Box>

          {/* Block buttons */}
          <Box
            sx={
              {
                // flexWrap: "wrap",
              }
            }
          >
            <BlockButton format="heading-one" icon="heading-one" />
            <BlockButton format="heading-two" icon="heading-two" />
            <BlockButton format="block-quote" icon="block-quote" />
            <BlockButton format="numbered-list" icon="numbered-list" />
            <BlockButton format="bulleted-list" icon="bulleted-list" />
          </Box>

          {/* Add color picker and link/image buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <ColorButton />
            <LinkButton /> {/* LinkButton will open popover on click */}{" "}
          </Box>
        </Box>

        <Box sx={{ height: "13rem" }}>
          <Editable
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            placeholder="Enter text..."
            spellCheck
            style={{
              marginLeft: "2px",

              height: "100%",
              overflowY: "auto",
            }}
          />
        </Box>
      </Slate>
    </Box>
  );
};

// Toggle block function for text alignment and other blocks
const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  // Remove list types if toggling another block
  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type:
      format === "left" ||
      format === "center" ||
      format === "right" ||
      format === "justify"
        ? "paragraph"
        : format,
    align: isActive
      ? undefined
      : format === "left" ||
        format === "center" ||
        format === "right" ||
        format === "justify"
      ? format
      : undefined,
  });

  // Toggle block
  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Toggle mark function for bold, italic, underline, etc.
const toggleMark = (editor: Editor, format: string, value?: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    if (value) {
      Editor.addMark(editor, format, value);
    } else {
      Editor.addMark(editor, format, true);
    }
  }
};

const DropdownAlignmentButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Open the menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* Button that opens the dropdown menu */}
      <IconButton onClick={handleClick}>
        <FormatAlignLeft sx={{ fontSize: 24, color: "black" }} />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* Menu Items for each alignment option */}
        <MenuItem onClick={() => handleClose()}>
          <BlockButton format="left" icon="left" />
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <BlockButton format="center" icon="center" />
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <BlockButton format="right" icon="right" />
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <BlockButton format="justify" icon="justify" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Check if block is active
const isBlockActive = (editor: Editor, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return !!match;
};

// Check if mark is active
const isMarkActive = (editor: Editor, format: string): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Render elements based on type (heading, list, quote, etc.)
const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  // Apply alignment styles
  const alignmentStyle = element.align ? { textAlign: element.align } : {};

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote {...attributes} style={alignmentStyle}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} style={alignmentStyle}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 {...attributes} style={alignmentStyle}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 {...attributes} style={alignmentStyle}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li {...attributes} style={alignmentStyle}>
          {children}
        </li>
      );
    case "numbered-list":
      return <ol style={alignmentStyle}>{children}</ol>;
    default:
      return (
        <p {...attributes} style={alignmentStyle}>
          {children}
        </p>
      );
  }
};

// Render leaf text for marks (bold, italic, etc.)
const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

// Button components for BlockButton and MarkButton
const BlockButton: React.FC<{ format: string; icon: string }> = ({
  format,
  icon,
}) => {
  const editor = useSlate();
  const IconComponent = ICON_MAPPING[icon];

  return (
    <Button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {IconComponent ? (
        <IconComponent sx={{ fontSize: 24, color: "black" }} />
      ) : null}
    </Button>
  );
};

const MarkButton: React.FC<{ format: string; icon: string }> = ({
  format,
  icon,
}) => {
  const editor = useSlate();
  const IconComponent = ICON_MAPPING[icon];

  return (
    <Button
      sx={{ padding: 0, margin: 0 }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {IconComponent && (
        <IconComponent
          sx={{ padding: 0, margin: 0, fontSize: 24, color: "black" }}
        />
      )}
    </Button>
  );
};

// Color picker button
const ColorButton: React.FC = () => {
  const editor = useSlate();
  const [color, setColor] = useState<string>("");

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const colorValue = event.target.value;
    setColor(colorValue);
    toggleMark(editor, "color", colorValue); // Change color
    console.log("color", color);
  };

  return (
    <TextField
      variant="standard"
      slotProps={{
        input: {
          disableUnderline: true,
        },
      }}
      type="color"
      value={color}
      onChange={handleColorChange}
      sx={{
        "& fieldset": { border: "none" },
        borderRadius: "50%",
        backgroundColor: color,
        width: "30px", // Smaller width
        height: "30px", // Smaller height
        padding: 0, // Remove padding around the input
        "& input": {
          padding: 0, // Ensure there's no padding inside the input
        },
      }}
    />
  );
};

export default AppRichTextEditor;
