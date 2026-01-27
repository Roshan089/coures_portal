import { Box, Typography } from "@mui/material";
import AppIconButton from "@/components/common/AppIconButton/AppIconButton";

const ProfileContent = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        {/* Header with buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontSize: "1.25rem", fontWeight: 500 }}
          >
            About
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <AppIconButton
              title="View Profile"
              type="button"
              sx={{
                color: "white",
                textTransform: "none",
                borderRadius: "0.25rem",
                padding: {
                  xs: "0.5rem 1rem",
                  sm: "0.375rem 1.5rem",
                  md: "0.375rem 2.188rem",
                },
                fontSize: {
                  xs: "0.875rem",
                  sm: "0.875rem",
                  md: "1rem",
                },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              View Profile
            </AppIconButton>
            <AppIconButton
              title="View Jobs"
              type="button"
              sx={{
                color: "white",
                textTransform: "none",
                borderRadius: "0.25rem",
                padding: {
                  xs: "0.5rem 1rem",
                  sm: "0.375rem 1.5rem",
                  md: "0.375rem 2.188rem",
                },
                fontSize: {
                  xs: "0.875rem",
                  sm: "0.875rem",
                  md: "1rem",
                },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              View Jobs
            </AppIconButton>
          </Box>
        </Box>

        <Typography
          sx={{ color: "#475569", lineHeight: 1.6, maxWidth: "100%" }}
        >
          At Menlo Logistics, we specialize in delivering efficient, scalable,
          and innovative supply chain solutions tailored to meet the dynamic
          needs of our clients. With a commitment to operational excellence, we
          integrate cutting-edge technology, advanced analytics, and industry
          expertise to optimize every aspect of logistics from warehousing and
          transportation to inventory management and distribution.
        </Typography>
        <Typography
          sx={{ color: "#475569", lineHeight: 1.6, mt: 1, maxWidth: "100%" }}
        >
          Our mission is to streamline supply chains, reduce costs, and enhance
          visibility, enabling businesses to focus on their core competencies.
          Backed by a global network, a highly skilled team, and a
          customer-centric approach, Menlo Logistics partners with organizations
          across industries to achieve seamless operations and sustainable
          growth. At Menlo, logistics isn&apos;t just about moving
          goods—it&apos;s about building trust, creating value, and driving
          success for our partners.
        </Typography>
      </Box>

      {/* Grid - Stack on mobile */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
          width: "100%",
        }}
      >
        <Box>
          <Typography sx={{ color: "#475569", mb: 0.5 }}>Website</Typography>
          <Typography
            component="a"
            href="http://www.Menlologistics.com"
            target="_blank"
            sx={{ color: "#3B82F6", textDecoration: "none" }}
          >
            http://www.Menlologistics.com
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "#475569", mb: 0.5 }}>Industry</Typography>
          <Typography>Consultancy Services</Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "#475569", mb: 0.5 }}>
            Page created
          </Typography>
          <Typography>August 16 2024</Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "#475569", mb: 0.5 }}>Location</Typography>
          <Typography>Gujarat, India</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileContent;
