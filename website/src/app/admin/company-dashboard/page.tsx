"use client";

import {
  CompanyStatsCard,
  CompanyStatsCardProps,
} from "@/components/Admin/CompanyDashboard/AdminCompanyStatsCard";
import { AdminRevenueGraph } from "@/components/Admin/AdminRevenueGraph";
import { CompanyTable } from "@/components/Admin/CompanyDashboard/CompanyTabel";
import { MajorRevenue } from "@/components/Admin/RecruitmentAgency/MajorRevenue";
import { Box, Typography, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AppIconButton from "@/components/common/AppIconButton";
import { useEffect, useState } from "react";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { adminCompany, companySummary } from "@/shared/types/Admin";
import {
  useGetDetailsCompanyQuery,
  useGetGraphRevenueCompanyQuery,
  useGetSummaryCompanyQuery,
} from "@/store/api/adminCompanyDashboard";

export default function CompanyDashboard() {
  const [period, setPeriod] = useState("monthly"); // ✅ Control period in the page

  const { data: revenueData } = useGetGraphRevenueCompanyQuery(period); // ✅ Fetch data based on period

  const { data: companiesDetails } = useGetDetailsCompanyQuery<adminCompany>();

  const [searchQuery, setSearchQuery] = useState("");
  const { setBreadcrumbs } = useBreadcrumbs();
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  useEffect(() => {
    setBreadcrumbs([{ label: "Customers" }, { label: "Companies" }]);
  }, [setBreadcrumbs]);
  const { data: companySummary, error } =
    useGetSummaryCompanyQuery<companySummary>();

  const stats: CompanyStatsCardProps[] = [
    {
      title: "Total Companies",
      value: String(companySummary?.totalCompanies || 0),
      type: "companies",
    },
    {
      title: "Placements This Month",
      value: String(companySummary?.totalJobs || 0),
      type: "placements",
    },
    {
      title: "Companies by Cities",
      value: String(companySummary?.totalDistinctCities?.length || 0),
      type: "companiesByCity",
    },
    {
      title: "Revenue this month",
      value: companySummary?.totalRevenue || "0",
      type: "revenue",
    },
  ] as const;

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
          Companies
        </Typography>

        <Grid container spacing={4}>
          {/* Stats Cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              {stats.map((stat) => (
                <Grid size={{ xs: 6 }} key={stat.type}>
                  <CompanyStatsCard {...stat} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Revenue Graph */}
          <Grid size={{ xs: 12, md: 6 }}>
            <AdminRevenueGraph
              period={period}
              setPeriod={setPeriod}
              revenueData={revenueData}
            />
          </Grid>

          {/* Companies Table and Major Revenue Section */}
          <Grid container size={{ xs: 12 }} spacing={2}>
            {/* Table Section */}
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
                  Companies
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
                  <AppIconButton
                    type="button"
                    sx={{
                      backgroundColor: "#475569",
                      borderRadius: "8px",
                      textTransform: "none",
                      padding: { xs: "8px 8px", md: "8px 64px" },
                      fontSize: "1rem",
                      color: "white",
                      ":hover": { backgroundColor: "#334155" },
                    }}
                  >
                    Create Company
                  </AppIconButton>
                </Box>
                <CompanyTable
                  searchQuery={searchQuery}
                  companiesData={companiesDetails?.totalCompanies || []}
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
                <MajorRevenue />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
