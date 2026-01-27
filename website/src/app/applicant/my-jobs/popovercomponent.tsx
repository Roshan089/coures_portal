'use client'
import { ProjectCard } from "@/components/card";
import { Header } from "@/components/header";
import { TopBar } from "@/components/top-bar";
import { Button, Popover, Box, Typography } from "@mui/material";
import { useState } from "react";

const Home = () => {
  // State for managing popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Handlers for popover
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="absolute inset-0 flex justify-center items-center">
        <Button 
          variant="contained" 
          onClick={handleClick}
        >
          Apply Now
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '& .MuiPopover-paper': {
              width: '70%',
              height: '70vh',
              borderRadius: '8px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              position: 'fixed',
              left: '50% !important',
              top: '50% !important',
              transform: 'translate(-50%, -50%) !important',
              overflowY: 'auto',
              border: "solid",
              paddingX: '80px'
            }
          }}
        >
          <Box sx={{ 
            p: 3,
            backgroundColor: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 1, fontSize: '14px' }}
            >
              3 free applications left.
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontSize: '20px'
              }}
            >
              Apply with your CV
            </Typography>

            <Typography sx={{ mb: 1, fontSize: '14px' }}>
              Upload CV
            </Typography>
            
            {/* File Upload Area */}
            <Box
              sx={{
                width: '100%',
                border: '1px solid #E5E7EB',
                borderStyle: 'solid',
                borderRadius: '4px',
                p: 3,
                mb: 2,
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }
              }}
            >
              <Typography sx={{ fontSize: '24px', mb: 1 }}>+</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                File types accepted: TXT,PDF or Word Doc
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              sx={{
                backgroundColor: '#475569',
                textTransform: 'none',
                py: 1.5,
                width: '200px',
                display: 'block',
                margin: '0 auto',
                '&:hover': {
                  backgroundColor: '#364152'
                }
              }}
            >
              Apply
            </Button>
          </Box>
        </Popover>
      </div>
    </div>
  );
}

export default Home;