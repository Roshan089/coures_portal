import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { formatDate } from "@/utils/date";
import { TCompany } from "@/shared/types/companyType";

const AboutSection = ({ companyProfile }: { companyProfile: TCompany }) => {
  const defaultFormat = "DD-MM-YYYY";
  
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
          {companyProfile.description}
        </Typography>
      </Box>

      {/* Additional Info */}
      <Grid container spacing={8}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 6 }}>
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
                href={companyProfile.website}
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
                {companyProfile.website}
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
                {formatDate(companyProfile.createdAt, defaultFormat)}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 6 }}>
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
                Industry
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: 'text.secondary' }}
              >
                {companyProfile.companyType}
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
                {companyProfile.location}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutSection;
