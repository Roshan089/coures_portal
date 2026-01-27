"use client";
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import AdvertisementTable from "@/components/Admin/Advertisement/AdvertisementTable";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
export default function Page() {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([{ label: "Ads" }]);
  }, [setBreadcrumbs]);
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3, md: 4, lg: 5 }, // Adjust padding for different screen sizes
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box>
        <AdvertisementTable />
      </Box>

    </Box>
  );
}
