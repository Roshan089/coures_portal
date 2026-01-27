import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Importing an icon for "Hooray!"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        width: { xs: "100%", sm: "60" }, // Set the dialog width to 61rem
        margin: "auto", // Center the dialog horizontally
      }}
    >
      {/* Title Section with Icon */}
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <EmojiEventsIcon
            sx={{ fontSize: 50, color: "#FF9800", marginRight: 1 }}
          />
          <Typography variant="h5" color="primary" fontWeight="bold">
            Hooray!
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content Section with Message */}
      <DialogContent>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
          }}
        >
          You have successfully set-up your profile!
        </Typography>
      </DialogContent>

      {/* Actions Section with View Profile Button */}
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{
            width: "100%",
            padding: "10px 0",
            fontSize: { xs: "14px", sm: "16px" },
          }}
        >
          View Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
