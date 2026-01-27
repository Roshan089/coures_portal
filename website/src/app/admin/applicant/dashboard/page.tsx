"use client";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppIconButton from "@/components/common/AppIconButton/AppIconButton";
import AdminBanner from "@/components/common/AppAdminBanner/AdminBanner";
import { useState } from "react";
import ProfileContent from "@/components/common/DailogsAnd Comformation/ProfileContent";
import BillingContent from "@/components/common/DailogsAnd Comformation/BillingContent";

const ApplicantOverview = () => {
  const [activeTab, setActiveTab] = useState("billing");

  return (
    <Box
      sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: " #F8F8F8", border: "solid" }}
    >
      {/* Header with Back Button - Stack buttons on mobile */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h1" sx={{ fontSize: "24px", fontWeight: 500 }}>
            Applicant Overview
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: { xs: 2, sm: 0 },
            ml: { xs: 0, sm: "auto" },
          }}
        >
          <AppIconButton
            title="Message"
            type="button"
            sx={{
              bgcolor: "#475569",
              color: "white",
              textTransform: "none",
              borderRadius: "0.25rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#364152" },
            }}
          >
            Message
          </AppIconButton>
          <AppIconButton
            title="Deactivate "
            type="button"
            sx={{
              border: "1px solid #475569",
              textTransform: "none",
              borderRadius: "0.25rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
            }}
          >
            Deactivate Applicant
          </AppIconButton>
        </Box>
      </Box>

      {/* Move banner outside the padding area */}
      <Box
        sx={{
          mx: { xs: -2, sm: -3, md: -4 },
          mb: 4,
        }}
      >
        <AdminBanner
          logo="/menlo-logo.png"
          companyName="Menlo Logistics"
          description="Logistic and supply chain management"
          location="XYZ Layout, Mumbai"
          joinDate="12-04-2023"
          applicants="450+"
          jobs="12"
          revenue="56K"
        />
      </Box>

      <Box sx={{ p: 4, bgcolor: "white" }}>
        {/* Tabs - Full width on mobile */}
        <Box
          sx={{
            bgcolor: "primary.main",
            borderRadius: "12px",
            mb: 4,
            display: "flex",
            overflow: "hidden",
            border: "1px solid",
          }}
        >
          <Button
            onClick={() => setActiveTab("profile")}
            sx={{
              color: "#111827",
              bgcolor: activeTab === "profile" ? "white" : "transparent",
              borderRadius: 0,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.75, md: 2 },
              flex: 1,
              minHeight: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              "&:hover": {
                bgcolor:
                  activeTab === "profile" ? "white" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Applicant Profile
          </Button>
          <Button
            onClick={() => setActiveTab("billing")}
            sx={{
              color: "#111827",
              bgcolor: activeTab === "billing" ? "white" : "transparent",
              borderRadius: 0,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.75, md: 2 },
              flex: 1,
              minHeight: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              "&:hover": {
                bgcolor:
                  activeTab === "billing" ? "white" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Licenses & Billing
          </Button>
        </Box>

        {/* Content */}
        {activeTab === "billing" && <BillingContent />}
        {activeTab === "profile" && <ProfileContent />}
      </Box>
    </Box>
  );
};

export default ApplicantOverview;
