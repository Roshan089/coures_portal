import React from "react";
import { Box, TextField, Typography, TextFieldProps } from "@mui/material";

interface InputFieldProps extends Omit<TextFieldProps, "error"> {
  name: string;
  label: string;
  type?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error = false,
  helperText = "",
  slotProps, // Update to use slotProps
  ...rest
}) => {
  return (
    <Box
      sx={{
        margin: "10px 0",
        width: "100%",
      }}
    >
      {/* Typography Label */}
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

      {/* Input Field */}
      <TextField
        fullWidth
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        slotProps={slotProps} // Forward slotProps
        {...rest} // Forward other props
        sx={{
          width: "100%",
          height: "32px",
          "& .MuiInputBase-root": {
            height: "32px",
            alignItems: "center",
            fontSize: "14px", // Input font size
            borderRadius: "4px", // Optional: Rounded corners
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: error ? "1px solid #d32f2f" : "1px solid #D1D9E9", // Red border for error, default border otherwise
            },
            "&:hover fieldset": {
              borderColor: error ? "#d32f2f" : "#B0BEC5", // Red border on hover for error
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "#d32f2f" : "#1E88E5", // Red border on focus for error
            },
          },
          "& .MuiFormHelperText-root": {
            color: error ? "#d32f2f" : "inherit", // Red color for error text
          },
        }}
      />
    </Box>
  );
};

export default InputField;
