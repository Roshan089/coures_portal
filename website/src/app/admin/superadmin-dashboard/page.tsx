"use client";

import {
  AdminStatsCard,
  AdminStatsCardProps,
} from "@/components/Admin/AdminMainAndRAStatsCard";
import { AdminRevenueGraph } from "@/components/Admin/AdminRevenueGraph";
import { AdminRecruitingGraph } from "@/components/Admin/AdminDashboardIcons/AdminRecruitingGraph";
import { AdminCompanyGraph } from "@/components/Admin/AdminDashboardIcons/AdminCompanyGraph";
import { AdminApplicantGraph } from "@/components/Admin/AdminDashboardIcons/AdminApplicantGraph";
import { Box, Typography, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  useGetGraphRevenueAdminQuery,
  useGetSummaryQuery,
} from "@/store/api/adminDasboardApiSlice";
import { useState } from "react";

export default function AdminDashboard() {
  const [period, setPeriod] = useState<string>("monthly");
  const { data: getDetails, error, isLoading } = useGetSummaryQuery();
  const { data: revenueData } = useGetGraphRevenueAdminQuery(period);
  // Make sure getDetails is populated before rendering
  const stats: AdminStatsCardProps[] = [
    {
      title: "Total Agencies",
      value: getDetails?.totalAgencies.toString() || "0",
      type: "agencies",
    },
    {
      title: "Total Companies",
      value: getDetails?.totalCompanies.toString() || "0",
      type: "companies",
    },
    {
      title: "Applicants",
      value: getDetails?.totalApplicants.toString() || "0",
      type: "applicants",
    },
    {
      title: "Revenue this month",
      value: getDetails?.revenueThisMonth || "0",
      type: "revenue",
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "text.primary",
          }}
        >
          Welcome, John Doe
        </Typography>

        <Grid container spacing={4}>
          {/* Top Row */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              {stats.map((stat) => (
                <Grid size={{ xs: 6 }} key={stat.type}>
                  <AdminStatsCard {...stat} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AdminRevenueGraph
              period={period}
              setPeriod={setPeriod}
              revenueData={revenueData}
            />
          </Grid>

          {/* Bottom Row - Three Graphs */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={4}>
              {/* Recruiting Graph */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    fontWeight: 500,
                  }}
                >
                  Recruitment Agencies
                </Typography>
                <AdminRecruitingGraph />
              </Grid>

              {/* Company Graph */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    fontWeight: 500,
                  }}
                >
                  Companies
                </Typography>
                <AdminCompanyGraph />
              </Grid>

              {/* Applicants Graph */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    fontWeight: 500,
                  }}
                >
                  Applicants
                </Typography>
                <AdminApplicantGraph />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
