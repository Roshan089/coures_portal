import React from "react";
import { TextField, FormControl, FormLabel, Typography } from "@mui/material";

interface AboutTextFieldProps {
  bgcolor?: string;
  lable?: string;
  value?: string;
  error?: boolean;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AboutTextField: React.FC<AboutTextFieldProps> = ({
  value,
  onChange,
  helperText,
  error,
  lable,
  bgcolor,
}) => (
  <FormControl
    fullWidth
    sx={{
      margin: "10px 0",
      width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
    }}
  >
    {/* Label for TextField */}
    <Typography
      variant="body2"
      sx={{
        marginBottom: "4px",
        fontWeight: "400",
        fontSize: "16px",
        color: "secondary.main", // Label color
      }}
    >
      {lable}
    </Typography>

    {/* TextField */}
    <TextField
      value={value}
      onChange={onChange}
      fullWidth
      variant="outlined"
      multiline
      rows={4} // Adjust rows for multi-line input
      sx={{
        width: "100%",
        height: "auto",
        "& .MuiInputBase-root": {
          height: "auto",
          display: "flex",
          alignItems: "center",
          fontSize: "14px", // Input font size
          backgroundColor: bgcolor || "#ffffff",
          borderRadius: "4px", // Optional: Rounded corners
        },
      }}
    />
    {helperText && (
      <Typography variant="caption" sx={{ color: "red" }}>
        {helperText}
      </Typography>
    )}
  </FormControl>
);

export default AboutTextField;
