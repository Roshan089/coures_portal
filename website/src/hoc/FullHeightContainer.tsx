"use client";
import { useIsMobile } from "@/hooks";
import { TOP_BAR_DESKTOP_HEIGHT, TOP_BAR_MOBILE_HEIGHT } from "@/layout/config";
import { Box } from "@mui/material";
import { FunctionComponent, PropsWithChildren } from "react";

const FullHeightContainer: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const onMobile = useIsMobile();

  return (
    <Box
      sx={{
        height: `calc(100vh - ${
          onMobile ? TOP_BAR_MOBILE_HEIGHT : TOP_BAR_DESKTOP_HEIGHT
        } - 2rem )`,
      }}
    >
      {children}
    </Box>
  );
};

export default FullHeightContainer;
