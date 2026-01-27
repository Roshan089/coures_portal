"use client";
import AppBarComponent from "@/components/common/AppBar/AppBar";
import { APP_CONSTANT } from "@/shared/constants/app";
import { Box } from "@mui/material";
import { FunctionComponent, PropsWithChildren, useEffect } from "react";

/**
 * Renders "Public Layout" composition
 * @layout PublicLayout
 */
const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    document.title = APP_CONSTANT.AppClientName; // Update Tab Title
  }, []);
  return (
    <>
      <AppBarComponent />
      <Box
        sx={{
          height: "calc(100vh - 7.5rem)",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default PublicLayout;
