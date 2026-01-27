import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface CustomDropdownProps {
  options: string[];
  value?: string | number;
  onChange: (value: string) => void;
  label: string;
  error?: boolean;
  helperText?: string;
  bgcolor?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  bgcolor,
  options,
  value,
  onChange,
  label,
  error = false,
  helperText,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    handleClose();
  };

  return (
    <Box
      sx={{
        margin: "10px 0",
        width: "100%",
      }}
    >
      {label && (
        <Typography
          variant="body2"
          sx={{
            marginBottom: "4px",
            fontWeight: "400",
            fontSize: "16px",
            color: "secondary.main", // Label color
          }}
        >
          {label}
        </Typography>
      )}

      <Button
        variant="outlined"
        fullWidth
        onClick={handleClick}
        sx={{
          height: "32px",
          textTransform: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
          color: "#FEFEFE",
          backgroundColor: bgcolor || "white",
          borderRadius: "4px",
          border: error ? "1px solid #d32f2f" : "1px solid #D1D9E9", // Red border for error
          "&:hover": {
            borderColor: error ? "#d32f2f" : "#B0BEC5", // Red border on hover for error
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#767676",
              flex: 1,
            }}
          >
            {value || "Select option"}
          </Typography>
          <ArrowDropDownIcon sx={{ fontSize: 20, color: "#666", marginLeft: 1 }} />
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: anchorEl?.offsetWidth || "auto", // Ensure dropdown width matches the button
            maxHeight: "200px", // Limit height to 200px for scrolling
            overflowY: "auto", // Make the dropdown scrollable
            border: "1px solid #D1D9E9", // Optional: Add border
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional: Add shadow
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSelect(option)}
            sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              color: "#000",
              "&:hover": {
                backgroundColor: "#FEFEFE",
              },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      {helperText && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: error ? "#d32f2f" : "inherit", // Red color for error text
            marginTop: "4px",
            display: "block"
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default CustomDropdown;
