"use client"

import { getDefaultMRTOptions } from "@/utils/defaultMRTOptions"
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"
import { useMemo, useCallback, useState } from "react"
import AppIconButton from "@/components/common/AppIconButton"
import { Box, Typography, CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes"
import { performanceMonitor } from "@/utils/performance"

interface JobPosting {
  id: string
  company?: string
  location?: string
  jobRole?: string
  experience?: string
  postingDate?: string 
  status?: string
  applicants?: number

}

interface JobPostingsTableProps {
  searchQuery?: string
  jobPostingsData: JobPosting[]
  isLoading?: boolean
  error?: any
}

export function JobPostingsTable({
  searchQuery = "",
  jobPostingsData,
  isLoading = false,
  error = null,
}: JobPostingsTableProps) {
  const router = useRouter()
  const [navigatingJobId, setNavigatingJobId] = useState<string | null>(null)

  const handleViewClick = useCallback(async (jobId: string) => {
    try {
      setNavigatingJobId(jobId)
      
      // Measure navigation performance
      await performanceMonitor.measureAsync('Job Navigation', async () => {
        // Preload the target page data by prefetching the route
        router.prefetch(`${AGENCY_ROUTES.JOB_APPLICATION}?jobId=${jobId}`)
        
        // Small delay to allow prefetch to complete
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Navigate to the job application page
        router.push(`${AGENCY_ROUTES.JOB_APPLICATION}?jobId=${jobId}`)
      })
    } catch (error) {
      console.error('Navigation failed:', error)
      // Fallback navigation
      router.push(`${AGENCY_ROUTES.JOB_APPLICATION}?jobId=${jobId}`)
    } finally {
      setNavigatingJobId(null)
    }
  }, [router])

  const columns = useMemo<MRT_ColumnDef<JobPosting>[]>(
    () => [
      {
        accessorKey: "company",
        header: "Company",
        size: 150,
        grow: true,
        minSize: 120,
        maxSize: 200,
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 170,
        grow: true,
        minSize: 120,
        maxSize: 300,
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          return (
            <Box
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "default",
                "&:hover": {
                  overflow: "visible",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: "#fff",
                  padding: "4px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }
              }}
              title={value}
            >
              {value}
            </Box>
          );
        },
      },
      {
        accessorKey: "jobRole",
        header: "Job Role",
        size: 180,
        grow: true,
        minSize: 140,
        maxSize: 350,
      },
      {
        accessorKey: "experience",
        header: "Experience",
        size: 100,
        grow: false,
        minSize: 80,
        maxSize: 150,
      },
      {
        accessorKey: "postingDate",
        header: "Posting Date",
        size: 130,
        grow: false,
        minSize: 100,
        maxSize: 180,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        grow: false,
        minSize: 80,
        maxSize: 120,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          let bg = '#E6F9F0', color = '#22C55E'; // default green
          if (typeof value === 'string' && value.toLowerCase() === 'closed') {
            bg = '#FFECEC';
            color = '#F87171';
          } else if (typeof value === 'string' && value.toLowerCase() === 'active') {
            bg = '#E6F9F0';
            color = '#22C55E';
          }
          return (
            <Box
              sx={{
                display: 'inline-block',
                pl: 2,
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                backgroundColor: bg,
                color: color,
                fontWeight: 500,
                fontSize: '0.95em',
                minWidth: '70px',
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
            >
              {String(value)}
            </Box>
          );
        },
      },
    
      {
        accessorKey: "applicants",
        header: "Applicants",
        size: 90,
        grow: false,
        minSize: 70,
        maxSize: 120,
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        grow: false,
        minSize: 70,
        maxSize: 180,
        Cell: ({ row }) => {
          const isNavigating = navigatingJobId === row.original.id;
          
          return (
            <Box sx={{ textAlign: "center" }}>
              <AppIconButton
                type="button"
                onClick={() => handleViewClick(row.original.id)}
                disabled={isNavigating}
                sx={{
                  backgroundColor: isNavigating ? "#9CA3AF" : "#475569",
                  borderRadius: "20px",
                  textTransform: "none",
                  padding: "6px 16px",
                  fontSize: "0.875rem",
                  color: "white",
                  ":hover": { 
                    backgroundColor: isNavigating ? "#9CA3AF" : "#334155" 
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {isNavigating ? (
                  <>
                    <CircularProgress size={16} sx={{ color: "white" }} />
                    Loading...
                  </>
                ) : (
                  "View"
                )}
              </AppIconButton>
            </Box>
          );
        },
      },
    ],
    [handleViewClick, navigatingJobId]
  )

  const defaultMRTOptions = getDefaultMRTOptions<JobPosting>()

  const filteredData = useMemo(
    () =>
      Array.isArray(jobPostingsData)
        ? jobPostingsData.filter((item) =>
            Object.values(item).some((value) =>
              value
                ?.toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
          )
        : [],
    [jobPostingsData, searchQuery]
  )

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: filteredData,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    layoutMode: "grid",
    state: {
      isLoading,
      showAlertBanner: !!error,
    },
    muiTableHeadCellProps: {
      align: "center",
      sx: {
       
        
        fontWeight: "600",
        padding: "12px 4px",
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      sx: {
        color: "#475569",
        padding: "8px 4px",
        borderBottom: "1px solid #E2E8F0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        height: "370px",
        width: "99%",
        overflowX: "auto",
        "& .MuiTable-root": {
          minWidth: "90%",
          tableLayout: "auto",
        }
      },
    },
    muiTablePaperProps: {
      sx: {
        width: "100%",
        maxWidth: "100%",
        boxShadow: "none",
        borderRadius: "8px",
      }
    },
    defaultColumn: {
      minSize: 80,
      maxSize: 200,
      grow: false,
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 80,
      },
    },
    enableStickyHeader: true,
    enablePagination: false,
    positionToolbarAlertBanner: "none",
    enableBottomToolbar: false,
    enableColumnResizing: true,
    initialState: {
      ...defaultMRTOptions.initialState,
      showColumnFilters: false,
      density: "compact",
    },
    muiTableBodyRowProps: {
      sx: {
        height: "48px",
      }
    },
  })

  return <MaterialReactTable table={table} />
}
