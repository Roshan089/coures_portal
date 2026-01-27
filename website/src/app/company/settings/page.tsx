import React from 'react';
import { Box, Typography, Paper, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// Define types for settings sections and items
interface SettingsItem {
  name: string;
  action: string;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const SettingsPage: React.FC = () => {
  // Define settings data
  const sections: SettingsSection[] = [
    {
      title: 'General Preferences',
      items: [
        { name: 'Name, location, and industry', action: 'Edit' },
        { name: 'Profile Visibility', action: 'Anonymous' },
        { name: 'Verifications', action: 'View' },
        { name: 'Notifications', action: 'Manage' },
      ],
    },
    {
      title: 'Subscriptions',
      items: [
        { name: 'Reactivate', action: 'Reactivate' },
        { name: 'View Purchase History', action: 'View' },
      ],
    },
    {
      title: 'Account Management',
      items: [
        { name: 'Sign in & Security', action: 'Update' },
        { name: 'Deactivate Account', action: 'Deactivate' },
        { name: 'Close Account', action: 'Close' },
      ],
    },
  ];

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#FEFEFE',
        display: 'flex',
        flexDirection: 'column',
              alignItems: 'center',
      }}
    >
      {/* Title Section with Back Icon */}
      <Box
        sx={{
                  display: 'flex',
            alignItems:"center",
          width: {
            xs: '90%', // Mobile
            sm: '80%', // Tablet
            md: '100%', // Desktop
          },
                  mb: 4,
        }}
      >
        <IconButton sx={{ mr: 1 }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5">Settings</Typography>
      </Box>

      {/* Settings Sections */}
      {sections.map((section, sectionIndex) => (
        <Box
          key={sectionIndex}
          sx={{
            mb: 4,
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: {
              xs: '90%', // Mobile
              sm: '80%', // Tablet
              md: '60%', // Desktop
              },
            borderRadius:"2rem"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {section.title}
          </Typography>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              px: 2,
                      width: '100%',
            }}
          >
            {section.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: "0.5rem",
                  }}
                >
                  <Typography sx={{ color: '#536485' }}>{item.name}</Typography>
                  <IconButton>
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Box>
                {itemIndex < section.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default SettingsPage;
