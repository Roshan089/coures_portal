"use client";
import React, { useState } from "react";
import { Button, Box, Modal } from "@mui/material";
import OTPVerificationPopup from "@/components/pop";

const ParentPage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Box sx={{ height: "600px", bgcolor: "red" }}>
      <Button variant="contained" color="primary" onClick={handleOpenPopup}>
        Open OTP Verification
      </Button>

      {isPopupOpen && (
        <Modal open={isPopupOpen} onClose={handleClosePopup}>
          <Box
            sx={{
              width: "100%",
              border: "solid red ",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "600px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "10px",
            }}
          >
            <OTPVerificationPopup onClose={handleClosePopup} />
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ParentPage;
