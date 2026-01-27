import React from 'react'
import { JobPostingsTable } from '@/components/Recruitment/DashboardTabel'
import { useGetJobByCompanyIdQuery } from '@/store/api/jobApiSlice'
import { TJobs } from '@/shared/types/jobType'

interface JobsSectionProps {
  clientId: string | number
}

export function JobsSection({ clientId }: JobsSectionProps) {
  // Convert clientId to string if it's a number
  const companyId = typeof clientId === 'number' ? clientId.toString() : clientId

  // Fetch jobs for the specific company
  const { data: jobsData, isLoading, error } = useGetJobByCompanyIdQuery({
    companyId: companyId,
    query: {
      limit: 10, // Limit to 10 jobs for display
      offset: 0
    }
  })

  if (isLoading) {
    return <div>Loading jobs...</div>
  }

  if (error) {
    return <div>Error loading jobs</div>
  }

  // Transform the API data to match the expected format
  const transformedJobs = jobsData?.rows?.map((job: TJobs) => ({
    id: job.id, // Keep as string instead of converting to number
    clientId: parseInt(job.companyId),
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

export default JobsSection
