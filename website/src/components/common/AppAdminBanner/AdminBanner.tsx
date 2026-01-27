import { Box, Typography } from "@mui/material";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface AdminBannerProps {
  logo: string;
  companyName: string;
  description: string;
  location: string;
  joinDate: string;
  applicants: string;
  jobs: string;
  revenue: string;
}

const AdminBanner = ({
  logo,
  companyName,
  ApplicantName,
  description,
  location,
  joinDate,
  applicants,
  jobs,
  revenue,
}: AdminBannerProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(90deg, #ABE8FF 37.23%, #00AFF0 100%)",
        p: { xs: 1, sm: 2 },
        mb: 4,
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: { xs: "center", lg: "flex-start" },
        gap: 2,
      }}
    >
      {/* Logo Container */}
      <Box
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          flexShrink: 0,
          bgcolor: "white",
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src={logo}
          alt={companyName}
          fill
          style={{
            objectFit: "contain",
            padding: "12px",
          }}
        />
      </Box>

      {/* Company Details */}
      <Box
        sx={{
          textAlign: { xs: "center", lg: "left" },
          width: { xs: "100%", lg: "auto" },
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: "24px", fontWeight: 500, mb: 1 }}
        >
          {companyName || ApplicantName}
        </Typography>
        <Typography sx={{ color: "#475569", mb: 2 }}>{description}</Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: { xs: "center", lg: "flex-start" },
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ color: "#475569", fontSize: 20 }} />
            <Typography sx={{ color: "#475569", fontSize: "14px" }}>
              {location}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ color: "#475569", fontSize: 20 }} />
            <Typography sx={{ color: "#475569", fontSize: "14px" }}>
              Joined {joinDate}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Card */}
      <Box
        sx={{
          ml: { xs: 0, lg: "auto" },
          width: { xs: "100%", lg: "auto" },
          display: "flex",
          gap: { xs: 2, sm: 2 },
          bgcolor: "rgba(255, 255, 255, 0.6)",
          borderRadius: "8px",
          p: { xs: 2.5, sm: 3 },
          flexDirection: { xs: "row", sm: "row" },
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          alignItems: "center",
          minWidth: { sm: "auto" },
          maxWidth: "100%",
        }}
      >
        {[
          { value: applicants, label: "Applicants" },
          { value: jobs, label: "Current Jobs Available" },
          { value: revenue, label: "Revenue" },
        ].map((stat, index) => (
          <Box
            key={stat.label}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: { xs: 1.5, sm: 3 },
              borderRight: {
                xs: "none",
                sm: index < 2 ? "1px solid #E5E7EB" : "none",
              },
              width: { xs: "calc(33.33% - 8px)", sm: "auto" },
              py: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "22px", md: "24px" },
                fontWeight: 600,
                textAlign: "center",
                color: "#111827",
                mb: { xs: 0.5, sm: 0.75 },
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              sx={{
                color: "#475569",
                fontSize: { xs: "12px", sm: "13px", md: "14px" },
                whiteSpace: "nowrap",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AdminBanner;
