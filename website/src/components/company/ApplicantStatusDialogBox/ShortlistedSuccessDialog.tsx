"use client";

import { Dialog, DialogContent, Typography, Stack } from "@mui/material";
import { AppIconButton } from "../../common";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ShortlistedSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortlistedSuccessDialog({
  isOpen,
  onClose,
}: ShortlistedSuccessDialogProps) {
  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          padding: "2rem",
        },
      }}
    >
      <DialogContent>
        <Stack spacing={3} alignItems="center">
          {/* Success Icon */}
          <CheckCircleIcon
            sx={{
              fontSize: "4rem",
              color: "#FFB53E", // Yellow/Orange color for shortlist
            }}
          />

          {/* Message */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              color: "#1F2937",
            }}
          >
            Application has Shortlisted
          </Typography>

          {/* Close Button */}
          <AppIconButton
            type="button"
            onClick={onClose}
            sx={{
              width: "100%",
              bgcolor: "#475569",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "1rem",
              ":hover": { bgcolor: "#334155" },
            }}
          >
            Close
          </AppIconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
