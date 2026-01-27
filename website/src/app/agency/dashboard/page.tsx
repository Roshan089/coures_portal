'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import AddIcon from '@mui/icons-material/Add'
import Grid from '@mui/material/Grid2'
import { formatDate } from '@/utils/date'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CancelIcon from '@mui/icons-material/Cancel'
import BusinessIcon from '@mui/icons-material/Business'
import TotalJobs from '@/components/company/dashboard/TotalJobs'
import OngoingJobs from '@/components/company/dashboard/OngoingJobs'
import ClosedJobs from '@/components/company/dashboard/ClosedJobs'
import TotalCompanies from "@/components/Recruitment/TotalCompaniesIcon";
import { JobPostingsTable } from '@/components/Recruitment/DashboardTabel';
import { useRouter } from 'next/navigation'
import { AGENCY_ROUTES } from '@/shared/constants/routes/agency.routes'
import { useGetClientsQuery } from '@/store/api/companyApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetAgencyStatsQuery } from '@/store/api/agencyApiSlice' 
import { useGetJobByAgencyIdQuery, useGetAgencyJobGraphQuery } from '@/store/api/jobApiSlice'
export default function AgencyDashboard() {
  const router = useRouter();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const agencyId = currentUser.user?.userType?.userId; 
  console.log('Agency ID:', agencyId)
  
  // Only fetch data if agencyId exists
  const { data: agencyStats, isLoading: statsLoading } = useGetAgencyStatsQuery(agencyId, {
    skip: !agencyId
  });
  
  const statsData = {
    totalJobs: agencyStats?.allJobsCount || 0,
    ongoingPostings: agencyStats?.openJobsCount || 0,
    jobsClosed: agencyStats?.closedJobsCount || 0,
    companies: agencyStats?.allCompaniesCount || 0
  }

  // Sample data for chart
  const [chartData, setChartData] = useState([])
  const [chartInterval, setChartInterval] = useState<'weekly' | 'monthly'>('weekly')

  const { data: jobGraphData, isLoading: jobGraphLoading, error: jobGraphError } = useGetAgencyJobGraphQuery({
    agencyId,
    period: chartInterval
  }, {
    skip: !agencyId
  })

  // Generate sample data for chart
  useEffect(() => {
    if (jobGraphData?.data) {
      setChartData(jobGraphData.data);
    } else {
      const generateChartData = () => {
        const data = []
        const weeks = 10
        const baseValue = 10
        
        for (let i = 1; i <= weeks; i++) {
          data.push({
            name: `Week ${i}`,
            value: baseValue + Math.floor(Math.random() * 25)
          })
        }
        
        setChartData(data as any)
      }
      
      generateChartData()
    }
  }, [chartInterval, jobGraphData])

  const {data: recentJobPostings, error: jobError, isLoading: jobLoading} = useGetJobByAgencyIdQuery({
    agencyId,
    query: {
      limit: 10,
      offset: 0
    }
  }, {
    skip: !agencyId
  })
  
  console.log("recentJobPostings", recentJobPostings)
  

  // Transform TJobs data to JobPosting format
  const transformedJobPostings = recentJobPostings?.rows?.map(job => ({
    id: job.id, // Keep as string instead of converting to number
    company: job.company?.name || 'Company ID: ' + job.companyId, // Use company name if available, otherwise company ID
    location: `${job.city || 'N/A'}, ${job.state || 'N/A'}`,
    jobRole: job.title,
    experience: `${job.minExperience} - ${job.maxExperience} Yrs`,
    postingDate: new Date(job.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    applicants: job.application?.length || 0, // Use actual application count if available
    status: job.status
  })) || [];

  console.log("transformedJobPostings", transformedJobPostings)
  console.log("transformedJobPostings length", transformedJobPostings.length)

  // Show message if no jobs found
  const noJobsMessage = !jobLoading && !jobError && transformedJobPostings.length === 0 ? "No job postings found" : null;

  // Sample data for job listings
  // const dummyRecentJobPostings = [
  //   {
  //     id: 1,
  //     company: 'Menlo Logistics',
  //     location: 'Gujarat',
  //     jobRole: 'Logistics Manager',
  //     experience: '2-3 Yrs',
  //     postingDate: '26 January 2024',
  //     status: 'Pending',
  //     applicants: 230
  //   },
  //   // Duplicated for demo purposes to match the image
  //   {
  //     id: 2,
  //     company: 'Menlo Logistics',
  //     location: 'Gujarat',
  //     jobRole: 'Logistics Manager',
  //     experience: '2-3 Yrs',
  //     postingDate: '26 January 2024',
  //     status: 'Pending',
  //     applicants: 230
  //   },
  //   {
  //     id: 3,
  //     company: 'Menlo Logistics',
  //     location: 'Gujarat',
  //     jobRole: 'Logistics Manager',
  //     experience: '2-3 Yrs',
  //     postingDate: '26 January 2024',
  //     status: 'Pending',
  //     applicants: 230
  //   },
  //   {
  //     id: 4,
  //     company: 'Menlo Logistics',
  //     location: 'Gujarat',
  //     jobRole: 'Logistics Manager',
  //     experience: '2-3 Yrs',
  //     postingDate: '26 January 2024',
  //     status: 'Pending',
  //     applicants: 230
  //   },
  //   {
  //     id: 5,
  //     company: 'Menlo Logistics',
  //     location: 'Gujarat',
  //     jobRole: 'Logistics Manager',
  //     experience: '2-3 Yrs',
  //     postingDate: '26 January 2024',
  //     status: 'Pending',
  //     applicants: 230
  //   }
  // ]

  // Top clients data
  const topClients = [
    { id: 1, name: 'Menlo logistics' },
    { id: 2, name: 'Menlo logistics' },
    { id: 3, name: 'Menlo logistics' },
    { id: 4, name: 'Menlo logistics' },
    { id: 5, name: 'Menlo logistics' }
  ]

  const { data: clients, isLoading: clientsLoading, error: clientsError } = useGetClientsQuery(agencyId, {
    skip: !agencyId
  });

  // Check for any errors first
  const hasErrors = jobError || jobGraphError || clientsError;
  
  // Show loading state if any data is being fetched
  const dashboardLoading = statsLoading || jobLoading || jobGraphLoading || clientsLoading;

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dashboardLoading) {
        console.warn('Dashboard loading timeout - some data may not be available');
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [dashboardLoading]);

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 }, // Reduce container padding on smaller screens
      }}
    >
      {/* Show errors first */}
      {hasErrors && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          bgcolor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 2,
          p: 3,
          mb: 3
        }}>
          <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
            Error Loading Dashboard Data
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            {jobError && (
              <Typography variant="body2" color="error">
                • Failed to load job postings
              </Typography>
            )}
            {jobGraphError && (
              <Typography variant="body2" color="error">
                • Failed to load job graph data
              </Typography>
            )}
            {clientsError && (
              <Typography variant="body2" color="error">
                • Failed to load clients data
              </Typography>
            )}
          </Box>
          <Button 
            variant="outlined" 
            color="error" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      )}
      
      {dashboardLoading && !hasErrors && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          <Typography variant="h6" color="text.secondary">
            Loading dashboard data...
          </Typography>
        </Box>
      )}
      
      {/* Only show dashboard content if no errors */}
      {!hasErrors && (
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, sm: 3, md: 4 },
            color: "text.primary",
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
          }}
        >
          Agency Dashboard
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Stats Cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              <Grid size={{ xs: 6, sm: 6 }}>
                <Box 
                  sx={{ 
                    bgcolor: '#FFEDD1', 
                    borderRadius: 2, 
                    p: { xs: 1.5, sm: 2 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: 'auto',
                    minHeight: { xs: '80px', sm: '90px' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '1.7rem' },
                        lineHeight: 1.1
                      }}
                    >
                      {statsData.totalJobs}
                    </Typography>
                    
                    <TotalJobs />
                    
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                      lineHeight: 1.4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Total Jobs
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 6, sm: 6 }}>
                <Box 
                  sx={{ 
                    bgcolor: '#C8F0FF', 
                    borderRadius: 2, 
                    p: { xs: 1.5, sm: 2 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: 'auto',
                    minHeight: { xs: '80px', sm: '90px' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '1.7rem' },
                        lineHeight: 1.1
                      }}
                    >
                      {statsData.ongoingPostings}
                    </Typography>
                    
                    <OngoingJobs />
                    
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                      lineHeight: 1.4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Ongoing Postings
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 6, sm: 6 }}>
                <Box 
                  sx={{ 
                    bgcolor: '#ECEAFF', 
                    borderRadius: 2, 
                    p: { xs: 1.5, sm: 2 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: 'auto',
                    minHeight: { xs: '80px', sm: '90px' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '1.7rem' },
                        lineHeight: 1.1
                      }}
                    >
                      {statsData.jobsClosed}
                    </Typography>
                    
                    <ClosedJobs />
                    
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                      lineHeight: 1.4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Jobs Closed
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 6, sm: 6 }}>
                <Box 
                  sx={{ 
                    bgcolor: '#C9F5EF', 
                    borderRadius: 2, 
                    p: { xs: 1.5, sm: 2 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: 'auto',
                    minHeight: { xs: '80px', sm: '90px' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '1.7rem' },
                        lineHeight: 1.1
                      }}
                    >
                      {statsData.companies}
                    </Typography>
                   
                    <TotalCompanies />
                    
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                      lineHeight: 2.5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Companies
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Chart Section - Job postings graph */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                border: '1px solid #E7EAF0',
                height: '100%',
                mb: { xs: 3, md: 0 },
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                background: 'linear-gradient(to bottom, #ffffff, #fafbfc)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.02))',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: '#475569', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Job postings graph
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {jobGraphData?.percentageChange || '+10.7%'} last {chartInterval === 'weekly' ? 'wk' : 'mo'}
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
                    <Select
                      value={chartInterval}
                      onChange={(e) => setChartInterval(e.target.value as 'weekly' | 'monthly')}
                      sx={{
                        height: { xs: 28, sm: 32 },
                        '& .MuiSelect-select': {
                          padding: { xs: '2px 6px', sm: '4px 8px' },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        },
                      }}
                    >
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#64748B', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                {jobGraphData?.totalJobs || 65}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                {jobGraphLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Loading chart data...
                    </Typography>
                  </Box>
                ) : jobGraphError ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" sx={{ color: '#EF4444' }}>
                      Error loading chart data
                    </Typography>
                  </Box>
                ) : (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A9FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00A9FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#A0AEC0' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 13, fill: '#A0AEC0' }}
                    />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#00A9FF" 
                      fillOpacity={1} 
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Remove spacing completely by using a negative margin top */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ 
          mt: { 
            xs: 1,
            md: -14.5
          }
        }}>
          {/* Client shortcuts section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
              position: 'relative',
              overflow: 'hidden',
              '&:hover .scroll-button': {
                opacity: 1
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#475569',
                    fontWeight: 500,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Your Clients
                </Typography>
                <Typography
                  onClick={()=>{
                    router.push(AGENCY_ROUTES.ALL_CLIENTS)
                  }}  
                  variant="body2"
                  sx={{
                    color: '#64748B',
                    cursor: 'pointer',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  View All
                </Typography>
              </Box>
              
              {/* Left Arrow - Hidden on mobile */}
              <Box
                className="scroll-button"
                onClick={() => {
                  const container = document.getElementById('clients-container');
                  if (container) {
                    container.scrollLeft -= 200;
                  }
                }}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: '60%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
              
              <Box 
                id="clients-container"
                sx={{ 
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  pb: 1
                }}
              >
                {/* Display actual clients */}
                {clients?.map((client: any, index: number) => (
                  <Paper
                    key={client.id}
                    elevation={1}
                    sx={{
                      borderRadius: 2,
                      height: { xs: 80, sm: 100 },
                      minWidth: { xs: 120, sm: 140, md: 160 },
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: '1px solid #E7EAF0',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={() => router.push(AGENCY_ROUTES.ALL_CLIENTS)}
                      sx={{
                        color: '#64748B',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textTransform: 'none',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: { xs: 30, sm: 40 },
                          height: { xs: 30, sm: 40 },
                          borderRadius: '50%',
                          bgcolor: '#00A9FF',
                          color: 'white',
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: { xs: '0.75rem', sm: '1rem' }
                        }}
                      >
                        {client.name?.charAt(0)?.toUpperCase() || 'C'}
                      </Box>
                      <Typography 
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
                          textAlign: 'center',
                          maxWidth: '90%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {client.name || 'Unnamed Client'}
                      </Typography>
                    </Button>
                  </Paper>
                ))}

                {/* Add Client Buttons - Fill remaining slots */}
                {Array.from({ length: Math.max(0, 4 - (clients?.length || 0)) }).map((_, index) => (
                  <Paper
                    key={`add-client-${index}`}
                    elevation={1}
                    sx={{
                      borderRadius: 2,
                      height: { xs: 80, sm: 100 },
                      minWidth: { xs: 120, sm: 140, md: 160 },
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: '1px solid #E7EAF0',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={() => router.push(AGENCY_ROUTES.CREATE_CLIENT)}
                      sx={{
                        color: '#64748B',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textTransform: 'none',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: { xs: 25, sm: 30 },
                          height: { xs: 25, sm: 30 },
                          borderRadius: '50%',
                          border: '1px solid #9AA4B2',
                          mb: 1,
                        }}
                      >
                        <AddIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                      </Box>
                      <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                        Add Client
                      </Typography>
                    </Button>
                  </Paper>
                ))}
              </Box>
              
              {/* Right Arrow - Hidden on mobile */}
              <Box
                className="scroll-button"
                onClick={() => {
                  const container = document.getElementById('clients-container');
                  if (container) {
                    container.scrollLeft += 200;
                  }
                }}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '60%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
            </Box>
          </Grid>
          
          {/* Empty grid item to maintain alignment */}
          <Grid size={{ xs: 12, md: 6 }}></Grid>
          
          {/* Job Table and Top Clients section */}
          <Grid container size={{ xs: 12 }} spacing={{ xs: 2, sm: 3 }} sx={{ mt: 2 }}>
            {/* Table Section - Increased width */}
            <Grid size={{ xs: 12, lg: 9 }}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#475569',
                    fontWeight: 500,
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Recent Job Postings
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    mb: { xs: 2, sm: 3 },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={()=>{
                      router.push(AGENCY_ROUTES.CREATE_CLIENT)
                    }}
                    sx={{
                      bgcolor: '#475569',
                      textTransform: 'none',
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Add Client
                  </Button>
                </Box>
                
                <JobPostingsTable 
                  jobPostingsData={transformedJobPostings} 
                  isLoading={jobLoading}
                  error={jobError}
                />
              </Box>
            </Grid>

            {/* Top Clients Section - Decreased width */}
            <Grid size={{ xs: 12, lg: 3 }}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#475569',
                    fontWeight: 500,
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Top Clients
                </Typography>
                
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    p: { xs: 1.5, sm: 2 },
                    border: '1px solid #E7EAF0',
                    height: 'calc(100% - 40px)'
                  }}
                >
                  {topClients.map((client, index) => (
                    <Box 
                      key={client.id} 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: { xs: 1, sm: 1.5 },
                        pb: 1,
                        borderBottom: index < topClients.length - 1 ? '1px solid #EDF2F7' : 'none'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: { xs: 30, sm: 36 },
                          height: { xs: 30, sm: 36 },
                          borderRadius: '50%', 
                          bgcolor: '#00A9FF', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white',
                          fontWeight: 'bold',
                          mr: { xs: 1, sm: 1.5 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: '#475569',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {client.name}
                      </Typography>
                      <Box 
                        sx={{ 
                          ml: 'auto',
                          height: 4,
                          borderRadius: 2,
                          bgcolor: '#00A9FF',
                          width: `${100 - (index * 10)}%`,
                          maxWidth: { xs: '30%', sm: '40%' }
                        }}
                      />
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      )}
    </Container>
  )
}    