import React from "react";
import { Typography, Button, Grid, TextField, Box } from "@mui/material";

interface OTPVerificationPopupProps {
  onClose: () => void; // Only the close handler is required
}

const OTPVerificationPopup: React.FC<OTPVerificationPopupProps> = ({
  onClose,
}) => {
  const [otp, setOtp] = React.useState(["", "", "", ""]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus on the next input field
    if (value.length === 1 && index < otp.length - 1) {
      const nextSibling = document.getElementById(`otp-input-${index + 1}`);
      if (nextSibling) {
        (nextSibling as HTMLElement).focus();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Verification Code
      </Typography>
      <Typography variant="body2" gutterBottom>
        Enter the OTP sent to your registered mobile number.
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        {otp.map((value, index) => (
          <Grid item key={index}>
            <TextField
              id={`otp-input-${index}`}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              inputProps={{ maxLength: 1 }}
              sx={{
                width: "50px",
                textAlign: "center",
                border: "solid red",
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={onClose}
        sx={{ marginTop: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default OTPVerificationPopup;
