'use client'
import React from 'react'
import { JobPostingsTable } from '@/components/Recruitment/DashboardTabel'
import { useGetJobByAgencyIdQuery } from '@/store/api/jobApiSlice'
import { TJobs } from '@/shared/types/jobType'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'

export function JobsSection() {
  // Convert clientId to string if it's a number
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const agencyId = currentUser.user.userType.userId
  // Fetch jobs for the specific company
  const { data: jobsData, isLoading, error } = useGetJobByAgencyIdQuery({
    agencyId: agencyId,
    query: {
      limit: 10, // Limit to 10 jobs for display
      offset: 0
    }
  })
console.log( "jobsData", jobsData)
  if (isLoading) {
    return <div>Loading jobs...</div>
  }

  if (error) {
    return <div>Error loading jobs</div>
  }

  // Transform the API data to match the expected format
  const transformedJobs = jobsData?.rows?.map((job: TJobs) => ({
    id: job.id, // Keep as string instead of converting to number
    company: job.company?.name || 'Unknown Company',
    location: `${job.city}, ${job.state}`,
    jobRole: job.title,
    experience: `${job.minExperience}-${job.maxExperience} Yrs`,
    postingDate: new Date(job.createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    status: job.status,
    applicants: job.application?.length || 0
  })) || []

  return (
    <JobPostingsTable jobPostingsData={transformedJobs} />
  )
}

export default function AllClientsJobsPage() {
  const router = useRouter();

  return (
    <Box sx={{ p: '24px' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: '24px',
          gap: '12px',
        }}
      >
        <IconButton
          onClick={() => router.back()}
          aria-label="Back"
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            mr: '8px',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <Typography
          component="h1"
          sx={{
            color: '#000',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '100%',
            m: 0,
          }}
        >
          All Job Posts
        </Typography>
      </Box>
      {/* Table */}
      <JobsSection />
    </Box>
  )
}
