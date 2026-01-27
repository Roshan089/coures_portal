"use client";

import { Dialog, DialogContent, Typography, Stack } from "@mui/material";
import { AppIconButton } from "../../common";
import CancelIcon from "@mui/icons-material/Cancel";

interface RejectedSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RejectedSuccessDialog({
  isOpen,
  onClose,
}: RejectedSuccessDialogProps) {
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
          {/* Icon */}
          <CancelIcon
            sx={{
              fontSize: "4rem",
              color: "#FB5B5B",
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
            Application has rejected
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
