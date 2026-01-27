"use client";

import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { AppIconButton } from "../common";
import CloseIcon from "@mui/icons-material/Close";
import { COMPANY_ROUTES } from "@/shared/constants/routes/company.routes";

interface JobSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  route: string;
}

export function JobSuccessDialog({ isOpen, onClose, route }: JobSuccessDialogProps) {
  const router = useRouter();

  const handleViewDashboard = () => {
    onClose(); // Close dialog and clear preview data first
    setTimeout(() => {
      router.push(route);
    }, 0);
  };

  const handleCreateAnotherJob = () => {
    onClose(); // Close dialog and clear preview data first
    setTimeout(() => {
      router.push(COMPANY_ROUTES.CREATE_JOB);
    }, 0);
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
          {/* Success Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#EA7516",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "white",
                fontSize: "3rem",
                lineHeight: 1,
                fontWeight: "bold",
              }}
            >
              ✓
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              color: "#333",
            }}
          >
            Job Successfully Posted
          </Typography>

          {/* Action Buttons */}
          <Stack spacing={2} width="100%">
            <AppIconButton
              type="button"
              onClick={handleViewDashboard}
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
              View Dashboard
            </AppIconButton>

            <AppIconButton
              type="button"
              onClick={handleCreateAnotherJob}
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
              Create another job post
            </AppIconButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
