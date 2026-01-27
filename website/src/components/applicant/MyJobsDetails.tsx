"use client";
import { Box, Divider, Stack, Typography } from "@mui/material";

// Ensure this path is correct

import { AppIconButton } from "../common";

interface ApplicationDetailsProps {
  selectedApplicant: {
    name: string;
    location: string;
    summary: string;
    about: string;
  };
  isMobile: boolean;
  handleBackClick: () => void;
}

export function JobPostingDetails({
  selectedApplicant,
  handleBackClick,
}: ApplicationDetailsProps) {
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "100%",
        overflowY: "auto",
        p: 4,
        bgcolor: "background.paper",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "8px",
          "&:hover": {
            background: "#666",
          },
        },
      }}
    >
      <Stack spacing={2}>
        {/* Job Title and Apply Button in same row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h4" fontWeight="600">
            Supply chain analyst
          </Typography>
          <AppIconButton
            size="small"
            sx={{
              bgcolor: "#475569",
              color: "white",

              borderRadius: "8px",
              textTransform: "none",
              paddingX: "0.75rem",
              paddingY: "0.55rem",
            }}
          >
            View Status
          </AppIconButton>
        </Box>

        <Typography variant="h6" color="text.secondary">
          Menlo Logistics
        </Typography>

        {/* Salary Range */}
        <Typography variant="h5">40-60K per month</Typography>

        <Divider sx={{ border: "1px solid #ddd" }}></Divider>
        {/* Key Responsibilities Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Key Responsibilities:
          </Typography>

          <Stack spacing={3}>
            {/* Data Analysis */}
            <Box>
              <Typography variant="h6" color="text.primary" gutterBottom>
                1. Data Analysis and Reporting:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  • Collect, analyze, and interpret data related to supply chain
                  operations.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Develop and maintain reports to track key performance
                  indicators (KPIs) such as inventory levels, order accuracy,
                  and transportation costs.
                </Typography>
              </Stack>
            </Box>

            {/* Process Optimization */}
            <Box>
              <Typography variant="h6" color="text.primary" gutterBottom>
                2. Process Optimization:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  • Identify inefficiencies and recommend improvements to
                  streamline supply chain processes.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Evaluate vendor performance and suggest strategies to
                  enhance collaboration.
                </Typography>
              </Stack>
            </Box>

            {/* Demand Planning */}
            <Box>
              <Typography variant="h6" color="text.primary" gutterBottom>
                3. Demand Planning:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  • Support forecasting and inventory planning processes by
                  analyzing historical data and market trends.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Work with cross-functional teams to align supply chain
                  strategies with business goals.
                </Typography>
              </Stack>
            </Box>

            {/* Risk Management */}
            <Box>
              <Typography variant="h6" color="text.primary" gutterBottom>
                4. Risk Management:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  • Identify potential risks in the supply chain and develop
                  contingency plans.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Monitor external factors such as market conditions and
                  regulations that may impact operations.
                </Typography>
              </Stack>
            </Box>

            {/* Systems and Tools */}
            <Box>
              <Typography variant="h6" color="text.primary" gutterBottom>
                5. Systems and Tools:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  • Utilize supply chain management software to enhance
                  operational efficiency.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Collaborate with IT teams to implement or improve supply
                  chain tools.
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* About the Job Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            About the job
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We are seeking a detail-oriented and analytical Supply Chain Analyst
            to join our team.
          </Typography>
        </Box>

        {/* View Full Description Link */}
        <Box
          sx={{
            mt: 2,
            p: 3,
            bgcolor: "#F8FAFC",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <Typography color="primary">View full job description</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default JobPostingDetails;
