"use client";

import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TDistinctCitiesRevenue } from "@/shared/types/AdminApplicantStats";
import { useGetDistinctCitiesQuery } from "@/store/api/adminApplicantApiSlice";

interface MajorRevenueProps {
  distinctCities: TDistinctCitiesRevenue;
}

export const MajorRevenue = ({ distinctCities }: MajorRevenueProps) => {
  const { data: distinctCitiesData } = useGetDistinctCitiesQuery();
  console.log("distinctCities", distinctCitiesData);

  // Check if data exists and has content
  const hasData = distinctCities?.totalCitiesRevenue?.[0]?.length > 0;

  if (!hasData) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "4px 4px 20px rgba(0, 0, 0, 0.05)",
          py: { xs: 2, sm: 3, md: 4 },
          height: "550px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#94A3B8",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          No Revenue Data Available
        </Typography>
      </Box>
    );
  }

  // Calculate total revenue first
  const totalRevenue = distinctCities.totalCitiesRevenue[0].reduce(
    (sum, item) => sum + parseInt(item.total_amount),
    0
  );

  // Transform the data into percentages
  const data = distinctCities.totalCitiesRevenue[0].map((item, index) => {
    const amount = parseInt(item.total_amount);
    const percentage = Math.round((amount / totalRevenue) * 100);

    return {
      name: item.city,
      value: percentage, // Now this will be a percentage
      color: ["#00B5FF", "#FF9E9E", "#FFB547", "#B4C8FF", "#47DEBB"][index % 5],
    };
  });

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "4px 4px 20px rgba(0, 0, 0, 0.05)",
        py: { xs: 2, sm: 3, md: 4 },
        height: "550px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ value }) => `${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 2,
          }}
        >
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: 0.5,
                }}
              />
              <Box sx={{ fontSize: 14 }}>{item.name}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
