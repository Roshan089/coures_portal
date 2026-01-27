"use client";
import { TJobs } from "@/shared/types/jobType";
import { formatDate } from "@/utils/date";
import { getDefaultMRTOptions } from "@/utils/defaultMRTOptions";
import { getStatusColor } from "@/utils/statusColor";
import { Box, Button, Chip } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import Link from "next/link";
import React, { useMemo } from "react";
import { COMPANY_ROUTES } from "@/shared/constants/routes/company.routes";
import { AppIconButton } from "@/components/common";
import { useRouter } from "next/navigation";
import { useGetJobByCompanyIdQuery } from "@/store/api/jobApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const defaultMRTOptions = getDefaultMRTOptions<TJobs>(); // Changed type here

interface CompanyDashboardTableProps {
  searchQuery?: string;
  filters?: {
    sortByRecent?: boolean;
    jobRole?: string;
    location?: string;
    date?: Date | null;
    experienceLevel?: string;
    minExperience?: string;
    maxExperience?: string;
  };
}

const CompanyDashboardTable = ({
  searchQuery = "",
  filters = {},
}: CompanyDashboardTableProps) => {
  const router = useRouter();

  // Update initial pagination state
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Calculate offset based on pagination
  const queryParams = useMemo(() => {
    const filterObj: any = {};
    const offset = pagination.pageIndex * pagination.pageSize;

    // Convert location to title case before sending to backend
    if (filters.location) {
      filterObj.city = filters.location
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Convert job role to title case before sending to backend
    if (filters.jobRole) {
      filterObj.title = filters.jobRole
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Add experience filter handling
    if (filters.minExperience) {
      filterObj.minExperience = filters.minExperience;
    }
    if (filters.maxExperience) {
      filterObj.maxExperience = filters.maxExperience;
    }

    // Handle date filter
    if (filters.date) {
      const dateStr =
        filters.date instanceof Date
          ? filters.date.toISOString().split("T")[0]
          : filters.date;

      return {
        query: {
          ...(Object.keys(filterObj).length > 0 && {
            filter: JSON.stringify(filterObj),
          }),
          sort: `createdAt:${dateStr}`,
          offset,
          limit: pagination.pageSize,
        },
      };
    }

    // Handle regular sort if no date filter
    const hasFilters = Object.keys(filterObj).length > 0;
    const hasSort = filters.sortByRecent;
    const hasSearch = searchQuery.trim() !== "";
    return {
      query: {
        ...(hasFilters && { filter: JSON.stringify(filterObj) }),
        ...(hasSort && { sort: "createdAt:desc" }),
        ...(hasSearch && { search: searchQuery }),
        offset,
        limit: pagination.pageSize,
      },
    };
  }, [filters, searchQuery, pagination]);

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const CompanyId = currentUser.user.userType.id;
  console.log("companyId", CompanyId);
  const { data, isLoading } = useGetJobByCompanyIdQuery({
    companyId: CompanyId,
    query: queryParams.query,
  }, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });

  // Update filteredData to use the paginated response
  const filteredData = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows;
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<TJobs>[]>( // Changed type here
    () => [
      {
        accessorKey: "title",
        header: "Job Name",
      },
      {
        accessorKey: "jobLocation",
        header: "Location",
        Cell: ({ row }) => {
          const { city, state } = row.original;
          const location =
            city && state ? `${city}, ${state}` : "Location not specified";
          return <Box>{location}</Box>;
        },
      },
      {
        accessorKey: "maxExperience",
        header: "Experience",
        Cell: ({ row }) => {
          const { minExperience, maxExperience } = row.original;
          return <Box>{`${minExperience}  - ${maxExperience} yrs`}</Box>;
        },
      },

      {
        accessorKey: "createdAt",
        header: "Posting Date",
        Cell: ({ renderedCellValue }) =>
          formatDate(renderedCellValue as string),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ renderedCellValue }) => {
          return (
            <Chip
              label={renderedCellValue}
              sx={{
                color: `${getStatusColor(renderedCellValue as string)}99`,
                backgroundColor: `${getStatusColor(
                  renderedCellValue as string
                )}33`,
                padding: 1,
              }}
            />
          );
        },
      },
      {
        accessorKey: "id",
        header: "Actions",
        Cell: ({ row }) => (
          <Link
            href={`${COMPANY_ROUTES.JOB_APPLICATION}?jobId=${row.original.id}`}
          >
            <Button
              sx={{
                color: "white",
                backgroundColor: "#536485",
                textTransform: "capitalize",
                ":hover": { backgroundColor: "#EA7516" },
              }}
            >
              View
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: filteredData,
    enableGlobalFilter: false,
    initialState: {
      ...defaultMRTOptions.initialState,
      showColumnFilters: false,
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    state: {
      isLoading,
      pagination,
    },
    rowCount: data?.count || 0,
    onPaginationChange: setPagination,
    enablePagination: true,
    manualPagination: true,
    paginationDisplayMode: "pages",
    positionPagination: "bottom",
    muiPaginationProps: {
      color: "primary",
      shape: "rounded",
      variant: "outlined",
      showFirstButton: true,
      showLastButton: true,
    },
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
        }}
      >
        <Box sx={{ color: "#6B7280", mb: 2 }}>
          {isLoading ? "Loading..." : "Create job posts to view job list"}
        </Box>
        {!isLoading && (
          <AppIconButton
            variant="contained"
            onClick={() => router.push(COMPANY_ROUTES.CREATE_JOB)}
            sx={{
              bgcolor: "#475569",
              color: "white",
              textTransform: "none",
              borderRadius: "0.25rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#364152" },
            }}
          >
            Create Job Post
          </AppIconButton>
        )}
      </Box>
    ),
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CompanyDashboardTable;
