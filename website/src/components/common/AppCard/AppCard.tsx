"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface StatCardProps {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  bgColor?: string;
}

function AppCard({ icon, value, label, bgColor = "#FFF6F0" }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 3,
        borderRadius: 2,
        bgcolor: bgColor,
        minWidth: "100%",
        mb: 2,
      }}
    >
      <Box sx={{ flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default AppCard;
