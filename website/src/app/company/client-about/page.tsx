"use client";

import { Box, Typography, Stack } from "@mui/material";

import AboutSection from "@/components/CompanyClientAbout/AboutSection";
import { useGetCompanyProfileQuery } from "@/store/api/companyApiSlice";
import CompanyProfile from "@/components/CompanyClientAbout/CompanyProfile";
import { AppIconButton } from "@/components";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setAbout } from "@/store/features/companyAbout/companyAboutSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { COMPANY_ROUTES } from "@/shared/constants";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
const ClientProfile = () => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const {
    data: companyProfile,
    isLoading,
    error,
    refetch: refetchCompanyProfile,
  } = useGetCompanyProfileQuery(
    currentUser.user.userType.id // Replace with dynamic company ID if needed
  );
  const handleEditButton = () => {
    router.push(`${COMPANY_ROUTES.CREATE}`);
  };
  useEffect(() => {
    if (companyProfile) {
      dispatch(setAbout(companyProfile));
    }
  }, [companyProfile, dispatch]);
  useEffect(() => {
    setBreadcrumbs([{ label: "My Company" }, { label: "My Profile" }]);
  }, [setBreadcrumbs]);
  useEffect(() => {
    refetchCompanyProfile();
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading company profile</div>;
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
            <Typography variant="h4">Company Profile</Typography>
          </Stack>

          <AppIconButton
            onClick={handleEditButton}
            title="Edit Page"
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
            Edit Page
          </AppIconButton>
        </Box>

        {/* Company Profile */}
        <CompanyProfile companyProfile={companyProfile} />
        {/* Main Content - About Section and Job Statistics */}

        <AboutSection companyProfile={companyProfile} />

        {/* Tab Panels */}
      </Box>
    </Box>
  );
};

export default ClientProfile;
