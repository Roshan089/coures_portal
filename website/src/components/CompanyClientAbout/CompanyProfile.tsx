import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { TCompany } from "@/shared/types/companyType";

const CompanyProfile = ({ companyProfile }: { companyProfile: TCompany }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "200px", // Adjust height as needed
        backgroundImage: `url(${companyProfile.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Avatar
        src={companyProfile.logoUrl}
        variant="circular"
        sx={{
          position: "absolute",
          top: { xs: 50, sm: 40 },
          left: { xs: 15, sm: 40 },
          width: { xs: 90, sm: 150 },
          height: { xs: 90, sm: 130 },

          objectFit: "cover",
          layout: "fill",
          zIndex: 1,
          borderRadius: "50%",
        }}
      />

      {/* Right Side Statistic */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 60, sm: 120 },
          height: { xs: 50, sm: 60 },
          bgcolor: "#FFFFFFA3",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          zIndex: 1,
        }}
      >
        <Typography variant="h6">{companyProfile.companySize}</Typography>
        <Typography variant="subtitle2" color="#535353">
          Employees
        </Typography>
      </Box>
    </Box>
  );
};

export default CompanyProfile;
