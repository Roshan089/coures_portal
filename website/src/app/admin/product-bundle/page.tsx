"use client";

import { Box } from "@mui/material";
import ProductBundleTable from "@/components/Admin/ProductBundle/ProductBundleTable";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { useEffect } from "react";
export default function ProductBundlePage() {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([{ label: "Licensing" }]);
  }, [setBreadcrumbs]);
  return (
    <Box sx={{ p: 3 }}>
      <ProductBundleTable />
    </Box>
  );
}
