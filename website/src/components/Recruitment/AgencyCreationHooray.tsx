'use client'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useRouter } from 'next/navigation'
import { RECRUITMENT_ROUTES } from '@/shared/constants/routes/recruitment.routes'
interface AgencyCreationHoorayProps {
  isOpen: boolean
  onClose: () => void
}

export function AgencyCreationHooray({ isOpen, onClose }: AgencyCreationHoorayProps) {
  const router = useRouter()

  const handleViewDashboard = () => {
    router.push(RECRUITMENT_ROUTES.DASHBOARD)
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      sx={{
        width: { xs: '100%', sm: '60' },
        margin: 'auto'
      }}
    >
      {/* Title Section with Icon */}
      <DialogTitle
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <EmojiEventsIcon 
            sx={{ fontSize: 50, color: '#FF9800', marginRight: 1 }} 
          />
          <Typography variant="h5" color="primary" fontWeight="bold">
            Hooray!
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content Section with Message */}
      <DialogContent>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '14px', sm: '16px', md: '18px' }
          }}
        >
          You have successfully {isOpen ? 'created' : 'updated'} your agency!
        </Typography>
      </DialogContent>

      {/* Actions Section with View Dashboard Button */}
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={handleViewDashboard}
          color="primary"
          variant="contained"
          sx={{
            width: '100%',
            padding: '10px 0',
            fontSize: { xs: '14px', sm: '16px' }
          }}
        >
          View Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  )
}
