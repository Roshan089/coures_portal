"use client";

import { Paper, Typography, Box } from "@mui/material";
import TotalApplicants from "./TotalApplicantsIcon";
import PlacementIcon from "./PlacementIcon";
import CompaniesByCities from "../CompanyDashboard/ComapniesByCitiesIcon";
import TotalRevenue from "../AdminDashboardIcons/TotalRevenueIcon";

export interface ApplicantStatsCardProps {
  title: string;
  value: string | number;
  type: "applicants" | "placements" | "applicantsByCity" | "revenue";
}

const bgColors = {
  applicants: "#FFF5EB",
  placements: "#EBF6FF",
  applicantsByCity: "#F5F3FF",
  revenue: "#EBFAF7",
};

const getIcon = (type: ApplicantStatsCardProps["type"]) => {
  switch (type) {
    case "applicants":
      return <TotalApplicants />;
    case "placements":
      return <PlacementIcon />;
    case "applicantsByCity":
      return <CompaniesByCities />;
    case "revenue":
      return <TotalRevenue />;
  }
};

export function ApplicantStatsCard({
  title,
  value,
  type,
}: ApplicantStatsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: bgColors[type],
        border: "none",
        borderRadius: { xs: "12px", sm: "16px" },
        minHeight: { xs: "110px", sm: "130px", md: "160px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ mb: { xs: 1, sm: 2 } }}>{getIcon(type)}</Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            mb: { xs: 0.5, sm: 1 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: {
                xs: "1.25rem", // 20px
                sm: "1.5rem", // 24px
                md: "1.75rem", // 28px
                lg: "2rem", // 32px
              },
              fontWeight: 600,
              lineHeight: 1.2,
              color: "text.primary",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: {
              xs: "0.75rem", // 12px
              sm: "0.875rem", // 14px
              md: "1rem", // 16px
            },
            color: "text.secondary",
            fontWeight: 500,
            lineHeight: 1.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
}
