"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Stack,
} from "@mui/material";

interface CloseJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CloseJobDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CloseJobDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          padding: "1rem",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 500,
          pt: 3,
        }}
      >
        Close Job
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "1.125rem",
            color: "#4B5563",
            mt: 1,
          }}
        >
          Are you sure you want to close this Job?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width="100%"
          px={2}
          pb={2}
        >
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#475569",
              color: "white",
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "#334155",
              },
            }}
          >
            {isLoading ? "Closing..." : "Yes"}
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#475569",
              color: "#475569",
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                borderColor: "#334155",
                bgcolor: "transparent",
              },
            }}
          >
            No
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
