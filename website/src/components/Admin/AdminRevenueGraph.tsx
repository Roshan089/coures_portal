"use client";

import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import _ from "lodash";

// Add type for the API response
interface RevenueResponse {
  totalRevenue: number;
  percentageChange: string;
  data?: {
    period: string;
    revenue: number;
  }[];
}

// Update the data transformation function

const generateDetailedData = (apiData: RevenueResponse["data"] = []) => {
  if (!apiData || apiData.length === 0) return [];

  const formattedData = apiData.map((item) => ({
    week: item.period,
    value: item.revenue,
  }));

  const detailedData = _.flatMap(formattedData, (current, i) => {
    // If it's the last item, no interpolation is needed
    if (i === formattedData.length - 1) {
      return [current];
    }

    const next = formattedData[i + 1];
    const steps = 10;

    // Add the current data point
    const intermediateData = [current];

    // Generate the intermediate points
    _.forEach(_.range(1, steps), (j) => {
      const progress = j / steps;
      const value = current.value + (next.value - current.value) * progress;
      const variation = Math.sin(progress * Math.PI) * (current.value * 0.05); // 5% variation

      intermediateData.push({
        week: `${current.week}-${j}`,
        value: value + variation,
        isIntermediate: true,
      });
    });

    return intermediateData;
  });

  return detailedData;
};

interface AdminRevenueGraphProps {
  period: string;
  setPeriod: (value: string) => void;
  revenueData?: RevenueResponse;
}

// Complete the CustomXAxisTick component
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  if (payload.value.includes("-")) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );
};

export function AdminRevenueGraph({
  period,
  setPeriod,
  revenueData,
}: AdminRevenueGraphProps) {
  const chartData = generateDetailedData(revenueData?.data);
  const formattedRevenue =
    revenueData?.totalRevenue?.toLocaleString("en-IN") || "0";
  const percentageChange = revenueData?.percentageChange || "0.00%";

  // Handle interval change
  const handleChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  // Show empty state with period selector
  if (!revenueData?.data?.length) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: "16px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          height: "460px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, color: "#1E293B" }}>
              Revenue Graph
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: 500,
                color: "#475569",
              }}
            >
              INR {formattedRevenue}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "#64748B",
                fontWeight: 500,
              }}
            >
              {percentageChange}
            </Typography>
          </Box>

          <FormControl size="small" sx={{ width: 120 }}>
            <Select value={period} onChange={handleChange}>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            height: "calc(100% - 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">
            No revenue data available
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        height: "460px",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#1E293B" }}>
            Revenue Graph
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: 500,
              color: "#475569",
            }}
          >
            INR {formattedRevenue}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              color: percentageChange?.startsWith("-") ? "#EF4444" : "#10B981",
              fontWeight: 500,
            }}
          >
            {percentageChange}
          </Typography>
        </Box>

        <FormControl size="small" sx={{ width: 120 }}>
          <Select value={period} onChange={handleChange}>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Graph */}
      <Box sx={{ height: "calc(100% - 80px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" stroke="#94A3B8" tick={<CustomXAxisTick />} />
            <YAxis
              stroke="#94A3B8"
              tickFormatter={(value) => `₹${value / 100000}L`}
            />
            <Tooltip
              formatter={(value) =>
                `₹${(value as number).toLocaleString("en-IN")}`
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00B4D8"
              strokeWidth={2}
              dot={({ isIntermediate }) => !isIntermediate}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
