import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import DownloadFormatDialog from "@/app/admin/company/company-overview/popovers/DownloadFormatDialog";

const BillingContent = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedFormat, setSelectedFormat] = useState<"Excel" | "PDF" | null>(
    null
  );

  const handleDownloadClick = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedFormat(null);
  };

  const handleFormatSelect = (format: "Excel" | "PDF") => {
    setSelectedFormat(format);
  };

  const handleDownload = () => {
    // Handle download logic here
    console.log(`Downloading in ${selectedFormat} format`);
    handleClose();
  };

  const tableHeaderStyles = {
    color: "#1a1a1a", // Darker text color for better contrast with lighter blue
    fontWeight: 500,
    bgcolor: "#ABE8FF", // Updated blue color
    padding: "8px 16px", // Reduced padding for lower height
    height: "15px", // Explicitly set height
    fontSize: "0.875rem", // Slightly smaller font size
  };

  return (
    <Box>
      {/* Subscription Details */}
      <Box
        sx={{
          mb: 6,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", lg: "center" },
          gap: 3,
        }}
      >
        {/* Subscription Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ color: "#6B7280", mb: 1 }}>
              Subscription Plan:
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              Pro (₹1000.00 / Monthly)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ color: "#6B7280", mb: 1 }}>
              Start Date:
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>1st March 2024</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ color: "#6B7280", mb: 1 }}>
              Billing Date:
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>1st March 2024</Typography>
          </Box>
        </Box>

        {/* Status and Button */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            alignSelf: { xs: "flex-start", lg: "center" },
          }}
        >
          <Chip
            label="Active"
            sx={{
              bgcolor: "#10B981",
              color: "white",
              fontSize: "0.75rem",
              height: "1.5rem",
            }}
          />
          <Button
            variant="outlined"
            sx={{
              color: "#475569",
              borderColor: "#E5E7EB",
              textTransform: "none",
              "&:hover": {
                borderColor: "#D1D5DB",
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Cancel Subscription
          </Button>
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, fontSize: "18px", fontWeight: 500 }}
        >
          Bills & Payments
        </Typography>

        {/* Table Tabs */}
        <Box sx={{ borderBottom: "1px solid #E5E7EB", mb: 3 }}>
          <Button
            onClick={() => setActiveTab("invoices")}
            sx={{
              color: activeTab === "invoices" ? "#111827" : "#6B7280",
              borderBottom:
                activeTab === "invoices" ? "2px solid #111827" : "none",
              borderRadius: 0,
              px: 2,
              py: 1,
              minWidth: "auto",
              mr: 2,
            }}
          >
            Invoices
          </Button>
          <Button
            onClick={() => setActiveTab("payment-methods")}
            sx={{
              color: activeTab === "payment-methods" ? "#111827" : "#6B7280",
              borderBottom:
                activeTab === "payment-methods" ? "2px solid #111827" : "none",
              borderRadius: 0,
              px: 2,
              py: 1,
              minWidth: "auto",
            }}
          >
            Payment Methods
          </Button>
        </Box>

        {/* Invoices Tab Content */}
        {activeTab === "invoices" && (
          <Box
            sx={{
              width: "100%",
              overflow: "auto",
              "& .MuiTable-root": {
                borderCollapse: "separate",
                borderSpacing: "0",
              },
            }}
          >
            <Table sx={{ minWidth: { xs: "800px", lg: "100%" } }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...tableHeaderStyles,
                      whiteSpace: "nowrap",
                      "&:first-of-type": {
                        borderTopLeftRadius: "12px",
                        borderBottomLeftRadius: "12px",
                      },
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell sx={tableHeaderStyles}>Invoice Date</TableCell>
                  <TableCell sx={tableHeaderStyles}>Total Amount</TableCell>
                  <TableCell sx={tableHeaderStyles}>GST</TableCell>
                  <TableCell sx={tableHeaderStyles}>Status</TableCell>
                  <TableCell
                    sx={{
                      ...tableHeaderStyles,
                      "&:last-child": {
                        borderTopRightRadius: "12px",
                        borderBottomRightRadius: "12px",
                      },
                    }}
                  >
                    Download
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(8)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      E0800TAUI2
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      8/19/2024
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      $3000.00
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>$300.00</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography sx={{ color: "#6B7280" }}>N/A</Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        onClick={handleDownloadClick}
                        sx={{
                          color: "#3B82F6",
                          textTransform: "none",
                          p: 0,
                          minWidth: "auto",
                        }}
                      >
                        Download Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Payment Methods Tab Content */}
        {activeTab === "payment-methods" && (
          <Box
            sx={{
              width: "100%",
              overflow: "auto",
              "& .MuiTable-root": {
                borderCollapse: "separate",
                borderSpacing: "0",
              },
            }}
          >
            <Table sx={{ minWidth: { xs: "800px", lg: "100%" } }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...tableHeaderStyles,
                      "&:first-of-type": {
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      },
                    }}
                  >
                    Payment Methods
                  </TableCell>
                  <TableCell sx={tableHeaderStyles}>Expiration Date</TableCell>
                  <TableCell sx={tableHeaderStyles}>Status</TableCell>
                  <TableCell
                    sx={{
                      ...tableHeaderStyles,
                      "&:last-child": {
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                      },
                    }}
                  >
                    Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(8)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      ****9092
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>07/26</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Chip
                        label="Active"
                        sx={{
                          bgcolor: "#E5E7EB",
                          color: "#374151",
                          fontSize: "0.75rem",
                          height: "1.5rem",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>Credit</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      <DownloadFormatDialog
        open={openDialog}
        onClose={handleClose}
        selectedFormat={selectedFormat}
        onFormatSelect={handleFormatSelect}
        onDownload={handleDownload}
      />
    </Box>
  );
};

export default BillingContent;
