'use client'

import { Box, Stack, Typography, Paper, Avatar } from '@mui/material'
import { AppIconButton } from '@/components'
import AppIcon from '@/components/common/AppIcon'
import { Fragment } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useGetClientsQuery } from '@/store/api/companyApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation';
import { AGENCY_ROUTES } from '@/shared/constants/routes/agency.routes'

interface Client {
  id: string;
  name: string;
  description: string;
  companyType: string;
  companySize: number;
  location: string;
  website: string;
  logoUrl: string;
  imageUrl: string;
  gstNumber: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
}

function AllClientsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentUserId = currentUser.user.userType.userId;

  const { data: clients, isLoading, error } = useGetClientsQuery(currentUserId);
  console.log("clients", clients);

  const router = useRouter();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading clients...</Typography>
      </Box>
    );
  }








 







  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">Error loading clients</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 1, px: { xs: 1, sm: 3, md: 6 } }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
        <Typography variant='h6' sx={{ fontWeight: 400, color: '#000', fontSize: 24 }}>
          Your Clients
        </Typography>
        <AppIconButton
          sx={{
            bgcolor: '#5c6a82',
            color: '#000',
            borderRadius: 1,
            px: 3,
            fontWeight: 500,
            fontSize: 14,
            gap: 1,
            '&:hover': { bgcolor: '#4a5670' }
          }}
          onClick={() => router.push('/agency/create-client')}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid white',
            }}
          >
            <AddIcon sx={{ fontSize: '1.25rem' }} />
          </Box>
          Add new Client
        </AppIconButton>
      </Stack>
      <Stack spacing={2}>
        {clients?.map((client: Client) => (
          <Paper
            key={client.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              p: 1.5,
              gap: 2,
              bgcolor: '#fff',
              minHeight: 148,
            }}
          >
            <Box sx={{ minWidth: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar
                sx={{ width: 40, height: 40, bgcolor: '#e0e7ef', color: '#333', fontWeight: 700, fontSize: 18 }}
                src={client.logoUrl}
              >
                {client.name
                  .split(' ')
                  .map((word: string) => word[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </Avatar>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {client.name}
              </Typography>
              <Typography variant='caption' color='text.secondary' sx={{ mb: 0.5, display: 'block' }}>
                {client.companyType} • {client.companySize} employees • Joined {new Date(client.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                {client.description}
              </Typography>
              
            </Box>
            <Stack direction='row' spacing={1}>
              <AppIconButton
                onClick={() => router.push(`${AGENCY_ROUTES.CLIENT_ABOUT}?clientId=${client.id}`)}
                title='View'
                sx={{ bgcolor: '#5c6a82', color: '#fff', px: 2, borderRadius: 1, fontWeight: 500, fontSize: 13, height: 32 }}
              >
                View
              </AppIconButton>
              <AppIconButton
                title='Edit'
                onClick={() => router.push(`/agency/edit-client?clientId=${client.id}`)}
                sx={{ bgcolor: '#5c6a82', color: '#fff', px: 2, borderRadius: 1, fontWeight: 500, fontSize: 13, height: 32 }}
              >
                Edit
              </AppIconButton>
              <AppIconButton
                onClick={() => router.push(`/agency/create-job?clientId=${client.id}`)}
                title='View Job Posts'
                sx={{
                  bgcolor: '#f97316',
                  color: '#fff',
                  px: 2,
                  borderRadius: 1,
                  fontWeight: 500,
                  fontSize: 13,
                  height: 32,
                  '&:hover': { bgcolor: '#ea7516' },
                }}
              >
                Create Job Post
              </AppIconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default AllClientsPage
