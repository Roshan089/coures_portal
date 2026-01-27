'use client'

import { AdminStatsCard, AdminStatsCardProps } from '@/components/Admin/AdminMainAndRAStatsCard'
import { AdminRevenueGraph } from '@/components/Admin/AdminRevenueGraph'
import { RecruitmentAgencyTable } from '@/components/Admin/RecruitmentAgency/RecruitmentAgencyTabel'
import { MajorRevenue } from '@/components/Admin/RecruitmentAgency/MajorRevenue'
import { Box, Typography, Container } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AppIconButton from '@/components/common/AppIconButton'
import { useState } from 'react'

export default function RecruitmentAgencyDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const stats: AdminStatsCardProps[] = [
    { title: "Total Agencies", value: "23", type: "agencies" },
    { title: "Total Companies", value: "105", type: "companies" },
    { title: "Applicants", value: "756", type: "applicants" },
    { title: "Revenue this month", value: "5 Lakhs", type: "revenue" }
  ] as const

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            color: 'text.primary' 
          }}
        >
          Welcome, John Doe
        </Typography>

        <Grid container spacing={2}>
          {/* Stats Cards */}
          <Grid size={{xs:12, md:6}}>
            <Grid container spacing={3}>
              {stats.map((stat) => (
                <Grid size={{xs:6}} key={stat.type}>
                  <AdminStatsCard {...stat} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Revenue Graph */}
          <Grid size={{xs:12, md:6}}>
            <AdminRevenueGraph />
          </Grid>

          {/* Recruitment Agencies Table and Major Revenue Section */}
          <Grid container size={{xs:12}} spacing={2}>
            {/* Table Section */}
            <Grid size={{xs:12, lg:8}}>
              <Box sx={{ 
                mt: 0,
                borderRadius: '8px'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#475569',
                    fontWeight: 500,
                    mb: 3
                  }}
                >
                  Recruitment Agencies
                </Typography>

                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3
                }}>
                  <Box sx={{ 
                    position: 'relative',
                    width: '400px'
                  }}>
                    <input
                      type="search"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearch}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: '1px solid #CBD5E1',
                        width: '100%',
                        outline: 'none',
                        fontSize: '0.875rem'
                      }}
                    />
                  </Box>
                  <AppIconButton
                    type="button"
                    sx={{
                      backgroundColor: '#475569',
                      borderRadius: '8px', 
                      textTransform: 'none',
                      padding: { xs: '8px 8px', md: '8px 64px' },
                      fontSize: '1rem',
                      color: 'white',
                      ':hover': { backgroundColor: '#334155' }
                    }}
                  >
                    Create Agency
                  </AppIconButton>
                </Box>
                <RecruitmentAgencyTable searchQuery={searchQuery} />
              </Box>
            </Grid>

            {/* Major Revenue Section */}
            <Grid size={{xs:12, lg:4}}>
              <Box sx={{ mt: 0 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#475569',
                    fontWeight: 500,
                    mb: 3
                  }}
                >
                  Major Revenue
                </Typography>
                <MajorRevenue />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
