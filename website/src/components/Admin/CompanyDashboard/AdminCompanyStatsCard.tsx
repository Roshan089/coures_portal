"use client";

import { Box, Paper, Typography } from "@mui/material";
import TotalCompanies from "../AdminDashboardIcons/TotalAgenciesIcon";

import CompaniesByCities from "../CompanyDashboard/ComapniesByCitiesIcon";
import TotalRevenue from "../AdminDashboardIcons/TotalRevenueIcon";
import PlacementThisMonth from "../CompanyDashboard/PlacementThisMonthIcon";

export interface CompanyStatsCardProps {
  title: string;
  value: string | number;
  type: "companies" | "placements" | "companiesByCity" | "revenue";
}

const bgColors = {
  companies: "#FFF5EB",
  placements: "#EBF6FF",
  companiesByCity: "#F5F3FF",
  revenue: "#EBFAF7",
};

const getIcon = (type: CompanyStatsCardProps["type"]) => {
  switch (type) {
    case "companies":
      return <TotalCompanies />;
    case "placements":
      return <PlacementThisMonth />;
    case "companiesByCity":
      return <CompaniesByCities />;
    case "revenue":
      return <TotalRevenue />;
  }
};

export function CompanyStatsCard({
  title,
  value,
  type,
}: CompanyStatsCardProps) {
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
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.5rem",
              md: "1.75rem",
              lg: "2rem",
            },
            fontWeight: 600,
            lineHeight: 1.2,
            mb: { xs: 0.5, sm: 1 },
            color: "text.primary",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: {
              xs: "0.75rem",
              sm: "0.875rem",
              md: "1rem",
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
