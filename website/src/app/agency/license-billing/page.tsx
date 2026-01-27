"use client";
import { Box, Chip, Typography } from "@mui/material";
import BillingAndLicenseTable from "@/components/company/BillingAndLicense/BillingAndLicenseTable";
import { AppIconButton } from "@/components";
import { useEffect, useState } from "react";
import { DurationPlans } from "@/components/company/BillingAndLicense/DurationPlans";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
import { useRouter } from "next/navigation";
export default function LicenseBillingPage() {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([{ label: "My Company" }, { label: "License & Billing" }]);
  }, [setBreadcrumbs]);

  const handleUpdatePlan = () => {
    router.push(AGENCY_ROUTES.PLANS_PRICING);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "#F3F4F6",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Subscription Details</Typography>
      </Box>
      {/* Subscription Details Card */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "12px",
          p: { xs: 2, sm: 3, md: 4 },
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "auto 1fr",
              md: "auto 1fr auto",
            },
            gap: { xs: 3, sm: 4 },
            alignItems: "start",
          }}
        >
          {/* Labels Column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 500,
              }}
            >
              Subscription Plan
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 500,
              }}
            >
              Start Date
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 500,
              }}
            >
              Billing Date
            </Typography>
          </Box>

          {/* Values Column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              sx={{
                color: "#6B7280",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Pro (₹1000.00 / Monthly)
            </Typography>
            <Typography
              sx={{
                color: "#6B7280",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              1st March 2024
            </Typography>
            <Typography
              sx={{
                color: "#6B7280",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              1st March 2024
            </Typography>
          </Box>

          {/* Status and Button Column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              justifyContent: { xs: "space-between", sm: "flex-start" },
              alignItems: { xs: "center", sm: "flex-end" },
              gap: 2,
              width: "100%",
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: 500,
                }}
              >
                Status
              </Typography>
              <Chip
                label="Active"
                sx={{
                  bgcolor: "#10B981",
                  color: "white",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  height: { xs: "2rem", sm: "2.5rem" },
                  borderRadius: "4px",
                  minWidth: { xs: "80px", sm: "100px" },
                }}
              />
            </Box>
            <AppIconButton
              variant="outlined"
              onClick={handleUpdatePlan}
              sx={{
                color: "#475569",
                borderColor: "#E5E7EB",
                textTransform: "none",
                borderRadius: "6px",
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1 },
                minWidth: { xs: "120px", sm: "140px" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "&:hover": {
                  borderColor: "#D1D5DB",
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Update Plan
            </AppIconButton>
          </Box>
        </Box>
      </Box>

      
    </Box>
  );
}
