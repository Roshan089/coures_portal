import { Box, Typography } from "@mui/material";

interface StatsCardProps {
  value: string;
  label: string;
}

const StatsCard = ({ value, label }: StatsCardProps) => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "0.5rem",
        p: "1.5rem",
        flex: 1,
        textAlign: "center",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #E5E7EB",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          fontWeight: 600,
          color: "#111827",
          mb: "0.5rem",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.875rem", sm: "1rem" },
          color: "#6B7280",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default StatsCard;
