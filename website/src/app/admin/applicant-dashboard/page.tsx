"use client";

import {
  ApplicantStatsCard,
  ApplicantStatsCardProps,
} from "@/components/Admin/ApplicantDashboard/AdminApplicantStatsCard";
import { AdminRevenueGraph } from "@/components/Admin/AdminRevenueGraph";
import { Box, Typography, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AppIconButton from "@/components/common/AppIconButton";
import { useEffect, useState } from "react";
import { ApplicantTable } from "@/components/Admin/ApplicantDashboard/ApplicantTabel";
import { MajorRevenue } from "@/components/Admin/ApplicantDashboard/MajorRevenue";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import {
  useGetDistinctCitiesQuery,
  useGetStatsQuery,
  useGetApplicantDetailRevenueQuery,
} from "@/store/api/adminApplicantApiSlice";
import {
  TStatsValue,
  TDistinctCitiesRevenue,
  TApplicantDetailRevenue,
} from "@/shared/types/AdminApplicantStats";
import { useGetRevenueGraphQuery } from "@/store/api/adminApplicantApiSlice";
export default function ApplicantDashboard() {
  const { data: distinctCities } = useGetDistinctCitiesQuery();
  console.log("distinctCities", distinctCities);
  const [searchQuery, setSearchQuery] = useState("");
  const { setBreadcrumbs } = useBreadcrumbs();
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const [period, setPeriod] = useState("monthly"); // ✅ Control period in the page
  useEffect(() => {
    setBreadcrumbs([{ label: "Customers" }, { label: "Applicants" }]);
  }, [setBreadcrumbs]);
  const { data } = useGetStatsQuery();
  const { data: graphData } = useGetRevenueGraphQuery(period);
  console.log("graphData", graphData);

  const { data: applicantDetailRevenue } = useGetApplicantDetailRevenueQuery();
  console.log("applicantDetailRevenue", applicantDetailRevenue);

  const stats: ApplicantStatsCardProps[] = [
    {
      title: "Total Applicants",
      value: data?.totalApplicant || 0,
      type: "applicants",
    },
    {
      title: "Applications",
      value: data?.totalApplication || 0,
      type: "placements",
    },
    {
      title: "Applicants by Cities",
      value: data?.totalDistinctCities || 0,
      type: "applicantsByCity",
    },
    {
      title: "Total Revenue",
      value: data?.totalRevenue || "0",
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
          Applicants
        </Typography>

        <Grid container spacing={4}>
          {/* Stats Cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              {stats.map((stat) => (
                <Grid size={{ xs: 6 }} key={stat.type}>
                  <ApplicantStatsCard {...stat} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Revenue Graph */}
          <Grid size={{ xs: 12, md: 6 }}>
            <AdminRevenueGraph
              revenueData={graphData}
              period={period}
              setPeriod={setPeriod}
            />
          </Grid>

          {/* Applicants Table Section */}
          <Grid container size={{ xs: 12 }} spacing={2}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#475569",
                    fontWeight: 500,
                    mb: 3,
                  }}
                >
                  Applicants
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "400px",
                    }}
                  >
                    <input
                      type="search"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearch}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "100px",
                        border: "1px solid #CBD5E1",
                        width: "100%",
                        outline: "none",
                        fontSize: "0.875rem",
                      }}
                    />
                  </Box>
                </Box>
                <ApplicantTable
                  searchQuery={searchQuery}
                  applicantDetailRevenue={applicantDetailRevenue?.totalCompanies}
                />
              </Box>
            </Grid>

            {/* Major Revenue Section */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#475569",
                    fontWeight: 500,
                    mb: 3,
                  }}
                >
                  Major Revenue
                </Typography>

                {distinctCities && (
                  <MajorRevenue distinctCities={distinctCities} />
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
