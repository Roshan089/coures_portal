import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { formatDate } from "@/utils/date";
import Image from 'next/image'
import { useGetJobPostingsQuery } from "@/store/api/companyApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";

interface AboutSectionProps {
  agencyData?: {
    description: string;
    website: string;
    location: string;
    createdAt: string;
    gstNumber: string | null;
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({ agencyData }) => {
  const defaultFormat = "DD-MM-YYYY";
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const { data: jobPostings } = useGetJobPostingsQuery(clientId || '');

  // Example values, replace with your actual data/props
  const stats = [
    { value: jobPostings?.totalJobs || 0, label: 'Total Jobs' },
    { value: jobPostings?.openJobs || 0, label: 'Ongoing Postings' },
    { value: jobPostings?.closedJobs || 0, label: 'Jobs Closed' }
  ]

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      {/* About Section */}
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2,
            fontWeight: 500
          }}
        >
          About
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.8,
            color: 'text.secondary',
            maxWidth: '70%',
            mb: 4
          }}
        >
          {agencyData?.description || 'No description available'}
        </Typography>
      </Box>

      {/* Additional Info and Stats */}
      <Grid container spacing={8}>
        {/* Left Column - Additional Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={4}>
            {/* Website and Page Created */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      mb: 0.5,
                      fontWeight: 500
                    }}
                  >
                    Website
                  </Typography>
                  <Typography 
                    component="a"
                    href={agencyData?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'blue',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {agencyData?.website || 'No website available'}
                  </Typography>
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      mb: 0.5,
                      fontWeight: 500
                    }}
                  >
                    Page Created
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                  >
                    {agencyData?.createdAt ? formatDate(agencyData.createdAt, defaultFormat) : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* GST Number and Location */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      mb: 0.5,
                      fontWeight: 500
                    }}
                  >
                    GST Number
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                  >
                    {agencyData?.gstNumber || 'Not provided'}
                  </Typography>
                </Box>
          
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      mb: 0.5,
                      fontWeight: 500
                    }}
                  >
                    Location
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                  >
                    {agencyData?.location || 'No location available'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Stats */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3} width='100%' maxWidth={300} sx={{ mx: 'auto' }}>
            {stats.map(stat => (
              <Box
                key={stat.label}
                sx={{
                  background: '#fff',
                  borderRadius: '14px',
                  boxShadow: '0 6px 32px 0 rgba(30, 142, 215, 0.18)',
                  p: { xs: 2, md: 2.5 },
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'text.secondary' }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutSection;
