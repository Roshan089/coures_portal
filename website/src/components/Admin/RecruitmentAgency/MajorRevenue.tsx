"use client";

import { useGetSortedRevenueCompanyQuery } from "@/store/api/adminCompanyDashboard";
import { Paper, Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { adminCompany } from "@/shared/types/Admin";

export function MajorRevenue() {
  const { data: sortedCompaniesRevenue } =
    useGetSortedRevenueCompanyQuery<adminCompany>();

  // Transform the API data into the format needed for the chart
  const chartData = Array.isArray(sortedCompaniesRevenue?.totalCompanies)
    ? sortedCompaniesRevenue.totalCompanies.map((company, index) => ({
        id: index + 1,
        amount: company.companyRevenue,
        name: company.name,
      }))
    : []; // Default to an empty array if totalCompanies is not an array

  // const theme = useTheme();

  const formatAmount = (amount: number) => {
    return `INR ${amount.toLocaleString("en-IN")}`;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        height: "550px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: "calc(100% - 60px)",
          width: "100%",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 40,
              bottom: 5,
            }}
            barSize={20}
          >
            <defs>
              <linearGradient
                id="revenueBarGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#00B4D8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00B4D8" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              type="number"
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              tickFormatter={formatAmount}
            />
            <YAxis
              type="category"
              dataKey="id"
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
              tick={{
                fontSize: 19,
              }}
              width={30}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "text.secondary",
                          mb: 0.5,
                        }}
                      >
                        {payload[0].payload.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        {formatAmount(payload[0].value as number)}
                      </Typography>
                    </Paper>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              fill="url(#revenueBarGradient)"
              radius={[0, 4, 4, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
