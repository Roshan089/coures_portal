import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Select, MenuItem } from "@mui/material";

interface ChartData {
  period: string;
  jobCount: number;
}

interface AreaChartProps {
  data: ChartData[];
  loading?: boolean;
  interval: string;
  onIntervalChange: (newInterval: string) => void;
}

const AreaChartComponent: React.FC<AreaChartProps> = ({
  data,
  loading,
  interval,
  onIntervalChange,
}) => {
  if (loading) {
    return <div>Loading chart...</div>;
  }

  const emptyStateMessage = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        color: "#666",
      }}
    >
      <Typography variant="h6" sx={{ color: "#637381" }}>
        Create jobs to view graph
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", height: "400px", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Job postings graph
        </Typography>
        <Select
          value={interval}
          onChange={(e) => onIntervalChange(e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00A9FF",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00A9FF",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00A9FF",
            },
            color: "#00A9FF",
          }}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </Box>

      {data.length === 0 ? (
        emptyStateMessage
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A9FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00A9FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{
                fontSize: "12px",
                fontFamily: "Arial",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              style={{
                fontSize: "12px",
                fontFamily: "Arial",
              }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00A9FF"
              fillOpacity={1}
              fill="url(#colorUv)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default AreaChartComponent;
