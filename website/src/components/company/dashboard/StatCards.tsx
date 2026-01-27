"use client";

import { Box, Grid2 } from "@mui/material";
import AppCard from "@/components/common/AppCard/AppCard";
import TotalJobs from "./TotalJobs";
import ClosedJobs from "./ClosedJobs";
import OngoingJobs from "./OngoingJobs";

interface StatCardsProps {
  totalJobs?: number;
  closedJobs?: number;
  ongoingJobs?: number;
}

function StatCards({
  totalJobs = 0,
  closedJobs = 0,
  ongoingJobs = 0,
}: StatCardsProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid2
        container
        spacing={3}
        sx={{
          "& .MuiGrid-": {
            paddingTop: "24px",
          },
        }}
      >
        <Grid2 size={12}>
          <AppCard
            icon={<TotalJobs />}
            value={totalJobs}
            label="Total Jobs"
            bgColor="#FFF6F0"
          />
        </Grid2>
        <Grid2 size={12}>
          <AppCard
            icon={<ClosedJobs />}
            value={closedJobs}
            label="Jobs Closed"
            bgColor="#F5F3FF"
          />
        </Grid2>
        <Grid2 size={12}>
          <AppCard
            icon={<OngoingJobs />}
            value={ongoingJobs}
            label="Ongoing Postings"
            bgColor="#EFF8FF"
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default StatCards;
