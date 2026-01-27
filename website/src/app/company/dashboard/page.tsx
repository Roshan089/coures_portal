"use client";

import { Box, TableContainer, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useCallback } from "react";

import AreaChartComponent from "@/components/common/AppChart/CompanyChart";

import CompanyDashboardTable from "@/components/company/dashboard/CompanyDashboardTable";
import StatCards from "@/components/company/dashboard/StatCards";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useGetJobStatsByIdQuery } from "@/store/api/jobApiSlice";
import {
  useGetCompanyProfileQuery,
  useGetGraphJobStatsQuery,
} from "@/store/api/companyApiSlice";

const Dashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const CompanyId = currentUser.user?.userType?.id;
  const [interval, setInterval] = useState("monthly");

  const { data: CardValues, refetch: refetchCardValues } =
    useGetJobStatsByIdQuery(CompanyId);
  const {
    data: companyProfile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetCompanyProfileQuery(CompanyId);
  const {
    data: graphData,
    isLoading: graphLoading,
    refetch: refetchGraphData,
  } = useGetGraphJobStatsQuery({
    interval: interval as "monthly" | "weekly",
    companyId: CompanyId,
  });
  const refreshDashboardData = useCallback(() => {
    refetchGraphData();
    refetchCardValues();
  }, [refetchGraphData, refetchCardValues]);
  useEffect(() => {
    refreshDashboardData();
  }, [interval, refreshDashboardData]);
  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
    refreshDashboardData();
  };

  console.log("company data", companyProfile);
  if (profileLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (profileError || !companyProfile) {
    return <Typography>Error fetching company profile.</Typography>;
  }

  // Transform API data to match chart format if needed
  const chartData =
    graphData?.data?.map((item: { period: string; jobCount: number }) => ({
      name: item.period, // Adjust according to your API response
      value: item.jobCount, // Adjust according to your API response
    })) || [];

  return (
    <Box p={3} mx="auto" sx={{ width: "100%", alignItems: "flex-start" }}>
      {/* Welcome Header */}

      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Welcome {companyProfile.name}
      </Typography>

      {/* Main Content */}
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column", // Column for extra small screens
            sm: "column", // Column for small screens
            md: "row", // Row for medium and larger screens
          },
          gap: 2, // Add spacing between children
          height: "100%",
        }}
      >
        {/* Left Column: Stat Cards */}
        <Grid
          sx={{
            flex: {
              xs: "0 0 100%", // 100% width for extra small screens
              sm: "0 0 100%", // 100% width for small screens
              md: "0 0 30%", // 30% width for medium and larger screens
            },
            height: "100%",
          }}
        >
          <StatCards {...CardValues} />
        </Grid>

        {/* Right Column: Graph */}
        <Grid
          sx={{
            flex: {
              xs: "0 0 100%", // 100% width for extra small screens
              sm: "0 0 100%", // 100% width for small screens
              md: "1", // Full width for medium and larger screens
            },
            p: 2,
            height: "100%", // Ensure the grid takes up full height
            backgroundColor: "#FEFEFE",
          }}
        >
          <Box sx={{ height: "100%" }}>
            {" "}
            {/* Make the Box fill the entire Grid height */}
            <AreaChartComponent
              data={chartData}
              loading={graphLoading}
              interval={interval}
              onIntervalChange={handleIntervalChange}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Recent Job Postings */}
      <Box mt={4}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins",
            fontWeight: "500",
            fontSize: "26px",
          }}
        >
          Recent Job Postings
        </Typography>
        <TableContainer
          sx={{
            mt: 2,
            borderRadius: "8px",
            boxShadow: "none",
            overflowX: "auto",
            maxWidth: "100%", // Aligns with the graph width
          }}
        >
          <CompanyDashboardTable />
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
