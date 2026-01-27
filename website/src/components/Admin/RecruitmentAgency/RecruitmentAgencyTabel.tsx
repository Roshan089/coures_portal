'use client'

import { getDefaultMRTOptions } from "@/utils/defaultMRTOptions"
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"
import { useMemo } from "react"
import AppIconButton from '@/components/common/AppIconButton'

type Agency = {
  agencyName: string
  noOfCompanies: number
  totalJobs: number
  totalRevenue: string
  actions: string
}

const data: Agency[] = [
  {
    agencyName: "ABC Consultants",
    noOfCompanies: 32,
    totalJobs: 124,
    totalRevenue: "INR 5,20,456",
    actions: "View"
  },
  {
    agencyName: "XYZ Recruiters",
    noOfCompanies: 45,
    totalJobs: 156,
    totalRevenue: "INR 6,15,789",
    actions: "View"
  },
  {
    agencyName: "Global Hiring",
    noOfCompanies: 28,
    totalJobs: 98,
    totalRevenue: "INR 4,50,000",
    actions: "View"
  },
  {
    agencyName: "Tech Recruiters",
    noOfCompanies: 52,
    totalJobs: 178,
    totalRevenue: "INR 7,25,123",
    actions: "View"
  },
  {
    agencyName: "Talent Hub",
    noOfCompanies: 38,
    totalJobs: 142,
    totalRevenue: "INR 5,75,842",
    actions: "View"
  },
  {
    agencyName: "Smart Staffing",
    noOfCompanies: 41,
    totalJobs: 135,
    totalRevenue: "INR 5,90,234",
    actions: "View"
  },
  {
    agencyName: "Career Connect",
    noOfCompanies: 35,
    totalJobs: 115,
    totalRevenue: "INR 4,85,671",
    actions: "View"
  },
  {
    agencyName: "Prime Placements",
    noOfCompanies: 48,
    totalJobs: 165,
    totalRevenue: "INR 6,45,892",
    actions: "View"
  },
  {
    agencyName: "HR Solutions",
    noOfCompanies: 43,
    totalJobs: 148,
    totalRevenue: "INR 6,10,345",
    actions: "View"
  },
  {
    agencyName: "Expert Recruiters",
    noOfCompanies: 39,
    totalJobs: 132,
    totalRevenue: "INR 5,35,789",
    actions: "View"
  },
  {
    agencyName: "Next Gen Hiring",
    noOfCompanies: 46,
    totalJobs: 158,
    totalRevenue: "INR 6,75,123",
    actions: "View"
  },
  {
    agencyName: "Workforce Masters",
    noOfCompanies: 37,
    totalJobs: 128,
    totalRevenue: "INR 5,15,456",
    actions: "View"
  },
  {
    agencyName: "Recruit Right",
    noOfCompanies: 44,
    totalJobs: 152,
    totalRevenue: "INR 6,25,789",
    actions: "View"
  },
  {
    agencyName: "Talent Scouts",
    noOfCompanies: 33,
    totalJobs: 112,
    totalRevenue: "INR 4,95,234",
    actions: "View"
  },
  {
    agencyName: "Job Connect Pro",
    noOfCompanies: 49,
    totalJobs: 168,
    totalRevenue: "INR 6,85,671",
    actions: "View"
  },
  {
    agencyName: "Staffing Solutions",
    noOfCompanies: 36,
    totalJobs: 125,
    totalRevenue: "INR 5,45,123",
    actions: "View"
  },
  {
    agencyName: "Hire Hub",
    noOfCompanies: 42,
    totalJobs: 145,
    totalRevenue: "INR 5,95,456",
    actions: "View"
  },
  {
    agencyName: "Career Crafters",
    noOfCompanies: 31,
    totalJobs: 108,
    totalRevenue: "INR 4,75,789",
    actions: "View"
  },
  {
    agencyName: "Pro Recruiters",
    noOfCompanies: 47,
    totalJobs: 162,
    totalRevenue: "INR 6,55,234",
    actions: "View"
  },
  {
    agencyName: "Talent Bridge",
    noOfCompanies: 34,
    totalJobs: 118,
    totalRevenue: "INR 4,90,671",
    actions: "View"
  }
]

interface RecruitmentAgencyTableProps {
  searchQuery?: string;
}

export function RecruitmentAgencyTable({ searchQuery = '' }: RecruitmentAgencyTableProps) {
  const columns = useMemo<MRT_ColumnDef<Agency>[]>(
    () => [
      {
        accessorKey: 'agencyName',
        header: 'Agency Name',
        Cell: ({ row }) => (
          <span style={{ color: '#475569', fontWeight: 500 }}>
            {row.original.agencyName}
          </span>
        ),
      },
      {
        accessorKey: 'noOfCompanies',
        header: 'No of Companies',
        Cell: ({ row }) => (
          <span style={{ color: '#475569' }}>
            {row.original.noOfCompanies}
          </span>
        ),
      },
      {
        accessorKey: 'totalJobs',
        header: 'Total Jobs',
        Cell: ({ row }) => (
          <span style={{ color: '#475569' }}>
            {row.original.totalJobs}
          </span>
        ),
      },
      {
        accessorKey: 'totalRevenue',
        header: 'Total Revenue',
        Cell: ({ row }) => (
          <span style={{ color: '#475569' }}>
            {row.original.totalRevenue}
          </span>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: () => (
          <AppIconButton
            type="button"
            sx={{
              backgroundColor: '#475569',
              borderRadius: '20px',
              textTransform: 'none',
              padding: '6px 35px',
              fontSize: '1rem',
              color: 'white',
              ':hover': { backgroundColor: '#334155' }
            }}
          >
            View
          </AppIconButton>
        ),
      },
    ],
    []
  )

  const defaultMRTOptions = getDefaultMRTOptions<Agency>()

  const filteredData = useMemo(() => {
    return data.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: filteredData,
    enableGlobalFilter: true,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    muiTableProps: {
      sx: {
        borderCollapse: 'separate',
        
      },
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: 'white',
        '& td': {
          borderBottom: '1px solid #E2E8F0',
          paddingY: '20px',
          '&:first-of-type': {
            paddingLeft: '16px',
          },
          '&:last-of-type': {
            paddingRight: '16px',
          },
        },
        '&:last-child td': {
          borderBottom: 'none',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#F0F9FF',
        color: '#0F172A',
        fontWeight: '600',
        paddingTop: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #E2E8F0',
      },
    },
    positionPagination: 'bottom',
    paginationDisplayMode: 'pages',
    muiPaginationProps: {
      count: Math.ceil(filteredData.length / 5),
      hideNextButton: true,
      hidePrevButton: true,
      shape: 'circular',
      variant: 'text',
      size: 'medium',
      sx: {
       
        '.MuiPaginationItem-root': {
          margin: '0 4px',
          minWidth: '40px',
          height: '40px',
          borderRadius: '50%',
          fontSize: '16px',
          fontWeight: 500,
          color: '#64748B',
          border: 'none',
          '&.Mui-selected': {
            backgroundColor: '#64748B',
            color: 'white',
            '&:hover': {
              backgroundColor: '#64748B',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(100, 116, 139, 0.1)',
          },
        },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderTop: 'none',
        padding: '0px 0',
        paddingLeft: { xs: 0, md: '190px' },
        '& .MuiToolbar-root': {
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          minHeight: 'auto',
          padding: { xs: '16px 0', md: 'inherit' }
        }
      },
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    enableTopToolbar: false,
    enableBottomToolbar: true,
    enablePagination: true,
    renderBottomToolbarCustomActions: () => null,
    displayColumnDefOptions: {
      'mrt-row-numbers': {
        size: 5,
      },
    },
    muiTableContainerProps: {
      sx: {
        overflow: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        height: '400px',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#F1F5F9',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#CBD5E1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#94A3B8',
          },
        },
      },
    },
    muiTablePaperProps: {
      sx: {
        borderRadius: '8px',
      },
    },
  })

  return <MaterialReactTable table={table} />
}
