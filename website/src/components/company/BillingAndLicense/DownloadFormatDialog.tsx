import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppIconButton from "@/components/common/AppIconButton/AppIconButton";
import { useState } from "react";
import DownloadSuccessDialog from "./DownloadSuccessDialog";

interface DownloadFormatDialogProps {
  open: boolean;
  onClose: () => void;
  selectedFormat: "Excel" | "PDF" | null;
  onFormatSelect: (format: "Excel" | "PDF") => void;
  onDownload: () => void;
}

const DownloadFormatDialog = ({
  open,
  onClose,
  selectedFormat,
  onFormatSelect,
  onDownload,
}: DownloadFormatDialogProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDownloadClick = () => {
    onDownload();
    onClose();
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
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
            Select Invoice Format
          </Typography>

          {/* Format selection buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              justifyContent: "center",
            }}
          >
            <AppIconButton
              title="Excel"
              type="button"
              onClick={() => onFormatSelect("Excel")}
              variant={selectedFormat === "Excel" ? "contained" : "outlined"}
              sx={{
                width: { xs: "100%", sm: "auto" },
                border: "1px solid #475569",
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
                bgcolor:
                  selectedFormat === "Excel" ? "secondary.main" : "transparent",
                color: selectedFormat === "Excel" ? "white" : "secondary.main",
                boxShadow:
                  selectedFormat === "Excel"
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "none",
                "&:hover": {
                  bgcolor:
                    selectedFormat === "Excel"
                      ? "#364152"
                      : "rgba(71, 85, 105, 0.04)",
                },
              }}
            >
              Excel
            </AppIconButton>
            <AppIconButton
              title="PDF"
              type="button"
              onClick={() => onFormatSelect("PDF")}
              variant={selectedFormat === "PDF" ? "contained" : "outlined"}
              sx={{
                width: { xs: "100%", sm: "auto" },
                border: "1px solid #475569",
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
                bgcolor: selectedFormat === "PDF" ? "#475569" : "transparent",
                color: selectedFormat === "PDF" ? "white" : "#475569",
                boxShadow:
                  selectedFormat === "PDF"
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "none",
                "&:hover": {
                  bgcolor:
                    selectedFormat === "PDF"
                      ? "#364152"
                      : "rgba(71, 85, 105, 0.04)",
                },
              }}
            >
              PDF
            </AppIconButton>
          </Box>

          {/* Download button */}
          <AppIconButton
            title="Download"
            type="button"
            onClick={handleDownloadClick}
            disabled={!selectedFormat}
            sx={{
              width: "100%",
              bgcolor: "#475569",
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
              "&.Mui-disabled": {
                bgcolor: "#E5E7EB",
                color: "#9CA3AF",
              },
            }}
          >
            Download
          </AppIconButton>
        </Box>
      </Dialog>

      <DownloadSuccessDialog open={showSuccess} onClose={handleSuccessClose} />
    </>
  );
};

export default DownloadFormatDialog;
