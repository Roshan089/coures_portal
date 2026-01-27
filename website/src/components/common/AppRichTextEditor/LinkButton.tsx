import React, { useState } from "react";
import { Button, TextField, Popover, Box, Typography } from "@mui/material";
import { Link } from "@mui/icons-material";
import { useSlate } from "slate-react";
import { Transforms } from "slate";

const LinkButton: React.FC = () => {
  const editor = useSlate();
  const [link, setLink] = useState<string>(""); // Store link value
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Anchor element for popover
  const [open, setOpen] = useState<boolean>(false); // State to manage popover visibility

  // Open the popover and set the anchor element
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log("Button clicked, setting anchorEl");
    setAnchorEl(event.currentTarget); // Set the current target of the button
    setOpen(true); // Open the popover
  };

  // Close the popover
  const handleClose = () => {
    setOpen(false); // Set open state to false to close the popover
  };

  // Insert the link into the editor
  const insertLink = (url: string) => {
    if (url) {
      const linkNode = { type: "link", url, children: [{ text: url }] };
      Transforms.insertNodes(editor, linkNode); // Insert the link node
    }
    handleClose(); // Close the popover after inserting the link
  };

  return (
    <Box>
      {/* Link Button with Icon */}
      <Button onClick={handleClick}>
        <Link sx={{ fontSize: 24, color: "black" }} />
      </Button>

      {/* Popover (Small card-like input field) */}
      <Popover
        open={open}
        anchorEl={anchorEl} // Anchor the popover to the button
        onClose={handleClose} // Close the popover when clicking outside
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ padding: 2 }}>
          {/* { <Typography>dfdf</Typography>} */}
          <TextField
            label="Enter URL"
            variant="outlined"
            value={link}
            onChange={(e) => setLink(e.target.value)} // Update link value
            onBlur={() => insertLink(link)} // Insert link when the input loses focus
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default LinkButton;
