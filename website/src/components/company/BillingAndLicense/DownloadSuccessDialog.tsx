import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AppIconButton from "@/components/common/AppIconButton/AppIconButton";

interface DownloadSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

const DownloadSuccessDialog = ({
  open,
  onClose,
}: DownloadSuccessDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "400px",
          maxWidth: "90%",
          borderRadius: "0.5rem",
          p: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: -16,
            top: -16,
            color: "#6B7280",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Success Icon */}
        <CheckCircleIcon
          sx={{
            color: "#F97316",
            fontSize: "3rem",
            mb: 2,
          }}
        />

        {/* Dialog content */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mb: 3,
            fontSize: "1.125rem",
            fontWeight: 500,
          }}
        >
          Downloaded
        </Typography>

        {/* Close button */}
        <AppIconButton
          title="Close"
          type="button"
          onClick={onClose}
          sx={{
            width: "100%",
            bgcolor: "secondary.main",
            color: "white",
            textTransform: "none",
            borderRadius: "0.25rem",
            padding: {
              xs: "0.5rem 1rem",
              sm: "0.375rem 1.5rem",
              md: "0.375rem 2.188rem",
            },
            fontSize: {
              xs: "0.875rem",
              sm: "0.875rem",
              md: "1rem",
            },
            "&:hover": {
              bgcolor: "#364152",
            },
          }}
        >
          Close
        </AppIconButton>
      </Box>
    </Dialog>
  );
};

export default DownloadSuccessDialog;
