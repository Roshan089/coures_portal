"use client";

import { Box, Typography, Stack, Button } from "@mui/material";
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import AboutSection from "@/components/Recruitment/AboutSection";
import { AppIconButton } from "@/components";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setAbout } from "@/store/features/companyAbout/companyAboutSlice";
import { useRouter } from "next/navigation";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import AgencyProfile from "@/components/Recruitment/AgencyProfile";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
import { useGetCompanyProfileQuery } from "@/store/api/companyApiSlice";
import ClientAboutSection from "@/components/Recruitment/ClientAboutSection";
import JobsSection from "@/components/Recruitment/JobsSection";

const ClientProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const { setBreadcrumbs } = useBreadcrumbs();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentUserId = currentUser.user.userType.userId;
  const dispatch = useDispatch();

  // Use the specific clientId to fetch client details instead of agency profile
  const { data: clientProfile, isLoading, error } = useGetCompanyProfileQuery(
    clientId || '' // Use the clientId from URL params
  );
  
  const [activeTab, setActiveTab] = useState<'about' | 'jobs'>('about');

  const handleEditButton = () => {
    router.push(`${AGENCY_ROUTES.CREATE}`);
  };

  const handleDeactivateButton = () => {
    // Implement deactivate client functionality
  };

  const handleChatsButton = () => {
    // Navigate to agency chats page with company ID
    router.push(`${AGENCY_ROUTES.CHATS}?companyId=${clientId}`);
  };

  // Redirect if no clientId is provided (following company pattern)
  useEffect(() => {
    if (!clientId) {
      router.push(AGENCY_ROUTES.ALL_CLIENTS);
    }
  }, [clientId, router]);

  useEffect(() => {
    if (clientId) {
      setBreadcrumbs([
        { label: 'Clients', onClick: () => router.push('/agency/all-clients') },
        { label: 'Client Profile' }
      ]);
    } else {
      setBreadcrumbs([{ label: 'Client Profile' }]);
    }
  }, [setBreadcrumbs, router, clientId]);

  useEffect(() => {
    if (clientProfile) {
      dispatch(setAbout(clientProfile));
    }
  }, [clientProfile, dispatch]);

  // Don't render if no clientId (following company pattern)
  if (!clientId) return null;
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading client profile</div>;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f9f9f9",
      }}
    >
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: "#fff" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 3,
          }}
        >
          <Stack direction={"row"}>
            <Typography variant="h4">Client Profile</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleChatsButton}
              variant="contained"
              sx={{
                bgcolor: "#4A90E2",
                color: "#FFFFFF",
                textTransform: "none",
                borderRadius: "4px",
                padding: "6px 35px",
                fontSize: "1rem",
                ":hover": { backgroundColor: "#357ABD" },
              }}
            >
              Chats
            </Button>

            <AppIconButton
              onClick={handleDeactivateButton}
              title="Deactivate Client"
              type="button"
              sx={{
                border: "1px solid black",
                textTransform: "none",
                borderRadius: "4px",
                padding: "6px 35px",
                fontSize: "1rem",
                ":hover": { backgroundColor: "#333" },
              }}
            >
              Deactivate Client
            </AppIconButton>
          </Stack>
        </Box>

        {/* Client Profile */}
        <AgencyProfile agencyData={clientProfile} />
        
       

        {/* Tab Switcher */}
        <Box
          sx={{
            display: 'flex',
            bgcolor: '#fff',
            borderRadius: 3,
            width: 240,
            mx: 3,
            mt: 3,
            p: 0.5,
            boxShadow: 3,
          }}
        >
          <Box
            onClick={() => setActiveTab('about')}
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 0.6,
              borderRadius: 2,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 18,
              color: activeTab === 'about' ? '#fff' : '#000',
              bgcolor: activeTab === 'about' ? '#ea7516' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            About
          </Box>
          <Box
            onClick={() => setActiveTab('jobs')}
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 0.6,
              borderRadius: 2,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 18,
              color: activeTab === 'jobs' ? '#fff' : '#000',
              bgcolor: activeTab === 'jobs' ? '#ea7516' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            Jobs
          </Box>
        </Box>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <Box sx={{ p: 3 }}>
            <AboutSection agencyData={clientProfile} />
          </Box>
        )}
        {activeTab === 'jobs' && (
          <Box sx={{ p: 3 }}>
            <JobsSection clientId={clientId} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ClientProfile;
