"use client";

import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { AppIconButton } from "../../common";
import CloseIcon from "@mui/icons-material/Close";
import { usePatchApplicationStatusMutation } from "@/store/api/applicationDetailsApiSlice";

interface RejectConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobId: string;
  applicantId: string;
}

export function RejectConfirmationDialog({
  isOpen,
  onClose,
  onSuccess,
  jobId,
  applicantId,
}: RejectConfirmationDialogProps) {
  const [updateStatus, { isLoading }] = usePatchApplicationStatusMutation();

  const handleConfirm = async () => {
    try {
      await updateStatus({
        jobId,
        applicantId,
        status: "Rejected",
      }).unwrap();

      onClose(); // Close the confirmation dialog
      onSuccess(); // Trigger success dialog
    } catch (error) {
      console.error("Failed to reject application:", error);
      // Optionally handle error state here
    }
  };

  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          padding: "1.5rem",
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#666",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={4} alignItems="center">
          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              color: "#FB5B5B",
              fontSize: "1.75rem",
            }}
          >
            Are you sure you want to Reject Application
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} width="100%">
            <AppIconButton
              type="button"
              onClick={onClose}
              disabled={isLoading}
              sx={{
                flex: 1,
                border: "1px solid #475569",
                color: "#475569",
                textTransform: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "1rem",
                bgcolor: "transparent",
                ":hover": { bgcolor: "rgba(71, 85, 105, 0.04)" },
              }}
            >
              No
            </AppIconButton>

            <AppIconButton
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              sx={{
                flex: 1,
                bgcolor: "#475569",
                color: "white",
                textTransform: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "1rem",
                ":hover": { bgcolor: "#334155" },
              }}
            >
              Yes
            </AppIconButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
