'use client'

import { Paper, Typography, Box } from '@mui/material'
import TotalAgencies from './AdminDashboardIcons/TotalAgenciesIcon'
import TotalCompanies from './AdminDashboardIcons/TotalCompaniesIcon'
import TotalApplicants from './AdminDashboardIcons/TotalApplicantsIcon'
import TotalRevenue from './AdminDashboardIcons/TotalRevenueIcon'

export interface AdminStatsCardProps {
  title: string
  value: string | number
  type: 'agencies' | 'companies' | 'applicants' | 'revenue'
}

const bgColors = {
  agencies: '#FFF5EB',
  companies: '#EBF6FF',
  applicants: '#F5F3FF',
  revenue: '#EBFAF7'
}

const getIcon = (type: AdminStatsCardProps['type']) => {
  switch (type) {
    case 'agencies':
      return <TotalAgencies />
    case 'companies':
      return <TotalCompanies />
    case 'applicants':
      return <TotalApplicants />
    case 'revenue':
      return <TotalRevenue />
  }
}

export function AdminStatsCard({ title, value, type }: AdminStatsCardProps) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: '100%',
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: bgColors[type],
        border: 'none',
        borderRadius: { xs: '12px', sm: '16px' },
        minHeight: { xs: '110px', sm: '130px', md: '160px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ mb: { xs: 1, sm: 2 } }}>
        {getIcon(type)}
      </Box>
      <Box>
        <Typography 
          variant="h3"
          sx={{
            fontSize: {
              xs: '1.25rem',
              sm: '1.5rem',
              md: '1.75rem',
              lg: '2rem'
            },
            fontWeight: 600,
            lineHeight: 1.2,
            mb: { xs: 0.5, sm: 1 },
            color: 'text.primary',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              md: '1rem'
            },
            color: 'text.secondary',
            fontWeight: 500,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  )
}
