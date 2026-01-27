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
import { TDistinctCities, TApplicantDetailRevenue } from "@/shared/types/AdminApplicantStats";

// Define types at the top level
interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  memberSince: string;
  plan: string;
  applicantRevenue: number;
}

interface ApplicantTableProps {
  searchQuery?: string;
  applicantDetailRevenue?: TApplicantDetailRevenue;
}

export function ApplicantTable({
  searchQuery = "",
  applicantDetailRevenue,
}: ApplicantTableProps) {
  // Transform the API data
  // 
  // log the applicantDetailRevenue to the console
  console.log("applicantDetailRevenue", applicantDetailRevenue);
  // to match the table structure
  const data: Applicant[] = useMemo(() => {
    // Handle the actual structure being received - it's a direct array
    const companies = Array.isArray(applicantDetailRevenue) 
      ? applicantDetailRevenue 
      : applicantDetailRevenue?.totalCompanies || [];
    
    return companies.map((applicant: any) => ({
      id: applicant.id,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      memberSince: applicant.memberSince,
      plan: applicant.plan,
      applicantRevenue: applicant.applicantRevenue,
    }));
  }, [applicantDetailRevenue]);

  // Define columns with proper typing
  const columns = useMemo<MRT_ColumnDef<Applicant>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Applicant Name",
        Cell: ({ row }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {`${row.original.firstName} ${row.original.lastName}`}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "memberSince",
        header: "Member Since",
        Cell: ({ cell }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "plan",
        header: "Subscriptions",
        Cell: ({ cell }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "applicantRevenue",
        header: "Total Revenue",
        Cell: ({ cell }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#475569" }}>
              {`INR ${cell.getValue<number>()?.toLocaleString() || 0}`}
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

  // Filter data based on search query
  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [data, searchQuery]
  );

  // Get default table options
  const defaultMRTOptions = getDefaultMRTOptions<Applicant>();

  // Configure table with minimal required options
  const table = useMaterialReactTable({
    ...defaultMRTOptions, //spread your default options
    columns,
    data: filteredData, // Use filtered data instead of raw data
    enableGlobalFilter: false, //override default options
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
        height: "370px", // Increased from 400px to 600px
      },
    },
    initialState: {
      ...defaultMRTOptions.initialState, //spread default initial state
      showColumnFilters: false, //override default initial state for just this table
    },
    //...
  });

  return <MaterialReactTable table={table} />;
}
