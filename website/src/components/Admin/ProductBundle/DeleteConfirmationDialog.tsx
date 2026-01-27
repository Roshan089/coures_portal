"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogButton = styled(Button)({
  borderRadius: "8px",
  padding: "8px 32px",
  textTransform: "none",
  fontSize: "1rem",
});

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  bundleName?: string;
}

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "16px",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} sx={{ color: "#64748B" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 3,
          fontSize: "1.5rem",
          fontWeight: 500,
        }}
      >
        Are You Sure You Want Delete?
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          pb: 4,
        }}
      >
        <DialogButton
          variant="contained"
          onClick={handleConfirm}
          sx={{
            bgcolor: "#536485",
            "&:hover": {
              bgcolor: "#3f4d65",
            },
          }}
        >
          Yes
        </DialogButton>
        <DialogButton
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "#536485",
            color: "#536485",
            "&:hover": {
              borderColor: "#3f4d65",
              bgcolor: "transparent",
            },
          }}
        >
          No
        </DialogButton>
      </DialogContent>
    </Dialog>
  );
}
