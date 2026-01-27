"use client";
import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AppBarComponent from "@/components/common/AppBar/AppBar";

// Explicit type for the code state
type CodeState = {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
};

const VerificationPage = () => {
  const [code, setCode] = useState<CodeState>({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  });

  // Refs for input boxes
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Handle input change and auto-jump
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    if (value.length <= 1) {
      setCode((prevState) => ({
        ...prevState,
        [`digit${index + 1}`]: value,
      }));

      // Automatically focus on the next input box
      if (value && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = `${code.digit1}${code.digit2}${code.digit3}${code.digit4}`;
    console.log("Entered Code:", enteredCode);
    // Add verification logic here
  };

  return (
    <Box>
     

      {/* Main Content */}
      <Grid
        sx={{
          height: "calc(100vh - 120px)", // Keeps the height of the container adjusted
          overflow: "hidden", // Prevents scrolling on the main container
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          {/* Left Section */}
          <Grid
            sx={{
              height: "100%", // Ensures it takes the full height of the parent container
              bgcolor: "#f4f4f4",
              flex: 1, // Ensures it takes 50% of the width
              display: { xs: "none", sm: "block" }, // Hide on small screens
            }}
          />

          {/* Right Section */}
          <Grid
            sx={{
              flex: 1, // Ensures it takes 50% of the width
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "white",
              px: { xs: 2, md: 4 },
              py: 4,
              height: "100%", // Ensures it takes the full height of the parent container
              overflow: "auto", // Optional: Use this to allow internal scrolling if needed
            }}
          >
            {/* Verification Form */}
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Enter Verification Code
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2} justifyContent="center">
                {/* Four Input Boxes for Code */}
                {[...Array(4)].map((_, index) => (
  <Grid  key={index}>
    <TextField
      variant="outlined"
      name={`digit${index + 1}`}
      value={code[`digit${index + 1}` as keyof CodeState]}
      onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, index)}
      inputRef={(el) => (inputRefs.current[index] = el)} // Assign ref
      inputProps={{
        maxLength: 1,
        style: { textAlign: "center" },
      }}
      sx={{
        width: "50px",
        "& .MuiInputBase-root": {
          textAlign: "center",
        },
      }}
    />
  </Grid>
))}

              </Grid>

              {/* Submit Button */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "60%",
                    bgcolor: "#000000",
                    "&:hover": { bgcolor: "#333333" },
                  }}
                >
                  Confirm
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VerificationPage;
