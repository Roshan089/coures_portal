'use client'

import { Box, Button, Stack, Typography, IconButton, Divider } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WorkIcon from '@mui/icons-material/Work'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useRouter } from 'next/navigation'

type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected'

export default function JobStatusPage() {
  const router = useRouter()
  const applicationStatus: ApplicationStatus = 'pending'

  const getStatusStyles = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return {
          bgcolor: '#FFF3E0',
          color: '#FB923C',
          '&:hover': { bgcolor: '#FFE0B2' }
        }
      case 'shortlisted':
        return {
          bgcolor: '#4CAF50',
          color: 'white',
          '&:hover': { bgcolor: '#43A047' }
        }
      case 'rejected':
        return {
          bgcolor: '#F44336',
          color: 'white',
          '&:hover': { bgcolor: '#E53935' }
        }
    }
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#F0F9FF' }}>
      {/* Header Section - Now outside the main container */}
      <Box sx={{ 
        width: '100%',
        bgcolor: 'white',
        px: { xs: 2, md: 4 },
        py: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => router.back()}
              sx={{ 
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={500}>
              Job Details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained"
              sx={{
                ...getStatusStyles(applicationStatus),
                textTransform: 'none',
                px: 4,
                minWidth: '120px'
              }}
            >
              {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
            </Button>
            <Button 
              variant="contained"
              sx={{
                bgcolor: '#475569',
                '&:hover': { bgcolor: '#334155' },
                textTransform: 'none',
                px: 4
              }}
            >
              Message
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Job Info Section - Full width with centered content */}
      <Box sx={{ 
        width: '100%',
        py: 4,
      }}>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          px: { xs: 2, md: 4 },
        }}>
          {/* Main content container */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 4
          }}>
            {/* Left Stack - Company info */}
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, color: 'text.secondary' }}>
                <Typography>Menlo logistics</Typography>
                <Typography>•</Typography>
                <Typography>1 week ago</Typography>
              </Box>

              <Typography variant="h4" fontWeight={600}>
                Supply chain analyst
              </Typography>

              <Box sx={{ display: 'flex', gap: 17 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ color: '#F97316' }} />
                  <Typography>Gujarat</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon sx={{ color: '#F97316' }}/>
                  <Typography>Full-time</Typography>
                </Box>
              </Box>
            </Stack>

            {/* Vertical Divider - Centered and Darker */}
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                mr: 4, // Added margin for centering
                borderColor: '#000000', // Darker color
                borderRightWidth: 3
              }} 
            />

            {/* Right Stack - Job details grid */}
            <Stack direction={'row'} sx={{ flex: 1 }}>
              <Box sx={{ 
                paddingTop: 2,
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 4,
                width: '100%'
              }}>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Experience
                  </Typography>
                  <Typography variant="body1">2-3 years</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Work level
                  </Typography>
                  <Typography variant="body1">Senior level</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Salary
                  </Typography>
                  <Typography variant="body1">40-60K</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ 
        bgcolor: 'white',
        width: '100%',
        py: 4
      }}>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          px: { xs: 2, md: 4 },
        }}>
          {/* About the job */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              About the job
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              We are seeking a detail-oriented and analytical Supply Chain Analyst to join our team. 
              The successful candidate will be responsible for analyzing and optimizing our supply chain operations, 
              ensuring efficiency, and supporting data-driven decision-making. The ideal candidate will have strong 
              analytical skills, a thorough understanding of supply chain processes, and the ability to communicate 
              insights effectively to stakeholders.
            </Typography>

            {/* Key Responsibilities */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Key Responsibilities:
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  1. Data Analysis and Reporting:
                </Typography>
                <Stack spacing={1} sx={{ pl: 2 }}>
                  <Typography color="text.secondary">
                    • Collect, analyze, and interpret data related to supply chain operations.
                  </Typography>
                  <Typography color="text.secondary">
                    • Develop and maintain reports to track key performance indicators (KPIs) such as inventory levels, 
                      order accuracy, and transportation costs.
                  </Typography>
                </Stack>
              </Box>

              {/* Add other responsibilities sections similarly */}
            </Stack>
          </Box>

          {/* Qualifications */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Qualifications:
            </Typography>
            <Stack spacing={1} sx={{ pl: 2 }}>
              <Typography color="text.secondary">
                • Education: Bachelor's degree in Supply Chain Management, Business Administration, Logistics, or a related field.
              </Typography>
              <Typography color="text.secondary">
                • Experience: 2-4 years of experience in supply chain analysis or a related role.
              </Typography>
              <Typography color="text.secondary">
                • Technical Skills:
              </Typography>
              <Typography color="text.secondary" sx={{ pl: 2 }}>
                - Proficiency in supply chain management software (e.g., SAP, Oracle, or equivalent).
              </Typography>
              <Typography color="text.secondary" sx={{ pl: 2 }}>
                - Advanced Excel skills and experience with data visualization tools (e.g., Power BI, Tableau).
              </Typography>
              <Typography color="text.secondary" sx={{ pl: 2 }}>
                - Knowledge of statistical analysis and forecasting techniques.
              </Typography>
            </Stack>
          </Box>

          {/* Soft Skills */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Soft Skills:
            </Typography>
            <Stack spacing={1} sx={{ pl: 2 }}>
              <Typography color="text.secondary">
                • Strong analytical and problem-solving abilities.
              </Typography>
              <Typography color="text.secondary">
                • Excellent communication and presentation skills.
              </Typography>
              <Typography color="text.secondary">
                • Ability to work collaboratively in a fast-paced environment.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
