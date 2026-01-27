'use client'

import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Typography,
  styled
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'

const DialogButton = styled(Button)({
  borderRadius: '8px',
  padding: '8px 32px',
  textTransform: 'none',
  fontSize: '1rem'
})

interface DeleteSuccessDialogProps {
  open: boolean
  onClose: () => void
  bundleName?: string
}

export function DeleteSuccessDialog({ open, onClose, bundleName }: DeleteSuccessDialogProps) {
  return (
    <Dialog 
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '16px'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} sx={{ color: '#64748B' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 4 
      }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <CheckIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500, 
            mb: 3,
            color: '#1E293B'
          }}
        >
          Bundle has Deleted
        </Typography>
        <DialogButton
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{
            bgcolor: '#536485',
            '&:hover': {
              bgcolor: '#3f4d65'
            },
            py: 1.5
          }}
        >
          Close
        </DialogButton>
      </DialogContent>
    </Dialog>
  )
} 