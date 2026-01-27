import { AppBar, Box, Toolbar } from "@mui/material";
import React from "react";
import LogiLeadBlackLogo from "../AppIcon/icons/LogiLeadBlackLogo";

const AppBarComponent: React.FC = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "2px solid #000000CC",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" sx={{ gap: "18px" }}>
          <LogiLeadBlackLogo />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
