"use client";

import { getDefaultMRTOptions } from "@/utils/defaultMRTOptions";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import AppIconButton from "@/components/common/AppIconButton";
import { Box, Typography } from "@mui/material";
import { adminCompany } from "@/shared/types/Admin";

interface CompanyTableProps {
  searchQuery?: string;
  companiesData: adminCompany[];
}

export function CompanyTable({
  searchQuery = "",
  companiesData,
}: CompanyTableProps) {
  const columns = useMemo<MRT_ColumnDef<adminCompany>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Company Name",
        Cell: ({ cell }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "jobCount",
        header: "Total Jobs",
        Cell: ({ cell }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {cell.getValue<number>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "companyRevenue",
        header: "Total Revenue",
        Cell: ({ cell }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {"INR " + cell.getValue<number>().toLocaleString("en-IN")}
            </Typography>
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: () => (
          <Box sx={{ textAlign: "center" }}>
            <AppIconButton
              type="button"
              sx={{
                backgroundColor: "#475569",
                borderRadius: "20px",
                textTransform: "none",
                padding: "6px 35px",
                fontSize: "1rem",
                color: "white",
                ":hover": { backgroundColor: "#334155" },
              }}
            >
              View
            </AppIconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const defaultMRTOptions = getDefaultMRTOptions<adminCompany>();

  const filteredData = useMemo(
    () =>
      Array.isArray(companiesData)
        ? companiesData.filter((item) =>
            Object.values(item).some((value) =>
              value
                ?.toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
          )
        : [], // Default to an empty array if companiesData is not an array
    [companiesData, searchQuery]
  );

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: filteredData,
    enableGlobalFilter: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        backgroundColor: "#F0F9FF",
        color: "#0F172A",
        fontWeight: "600",
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      sx: {
        color: "#475569",
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        height: "370px",
      },
    },
    initialState: {
      ...defaultMRTOptions.initialState,
      showColumnFilters: false,
    },
  });

  return <MaterialReactTable table={table} />;
}
