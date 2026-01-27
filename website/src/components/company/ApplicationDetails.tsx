/* eslint-disable @next/next/no-img-element */
"use client";

// Correct import for Next.js Image

import { Box, IconButton, Stack, Avatar, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Ensure this path is correct
import Grid from "@mui/material/Grid2";
import ExperienceTimeline from "../common/CompanyExperienceTimeline/ExperienceTimeline";
import { AppIconButton } from "../common";
import { TJobApplication } from "@/shared/types/jobApplications";
import { useGetApplicantExperienceQuery } from "@/store/api/applicantProfileApiSlice";
import { useRouter } from "next/navigation";
import { COMPANY_ROUTES } from "@/shared/constants/routes/company.routes";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedApplicant } from "@/store/features/applicantDetails/applicantDetailsSlice";
import { RootState } from "@/store/store";

interface ApplicationDetailsProps {
  selectedApplicant: TJobApplication;
  handleBackClick: () => void;
  isMobile: boolean;
}
// const backgroundUrl = "https://placehold.co/600x400";
export default function ApplicationDetails({
  selectedApplicant,
  handleBackClick,
  isMobile,
}: ApplicationDetailsProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const applicantId = selectedApplicant.applicant.id;
  console.log("appId", selectedApplicant.applicantId);
  const {
    data: applicantData,
    isLoading,
    isError,
  } = useGetApplicantExperienceQuery(applicantId);
  console.log("experiences");

  const currentUser = useSelector((state: RootState) => state.auth.currentUser.user.type);
  console.log("currentUsernene", currentUser);

  const handleViewJobDescription = () => {
    if (selectedApplicant) {
      dispatch(setSelectedApplicant(selectedApplicant));
      const route = currentUser === 'agency' ? AGENCY_ROUTES.JOB_DETAILS : COMPANY_ROUTES.JOB_DETAILS;
      router.push(`${route}?id=${selectedApplicant.id}`);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        flex: 1,
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "8px",
        },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1,
            bgcolor: "background.paper",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      <Stack spacing={8} sx={{ flex: 1, overflowY: "auto", pb: "80px" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            // Adjust the height for better layout
          }}
        >
          <img
            src={selectedApplicant.applicant.backgroundUrl}
            alt="background"
            style={{ width: "100%", height: "50%", objectFit: "contain" }}
          />
          <Avatar
            src={selectedApplicant.applicant.profileUrl}
            sx={{
              width: 100,
              height: 100,

              right: -8,
              bottom: -50,
            }}
          />
        </Box>
        <Grid sx={{ justifyItems: "left", px: 2 }}>
          <Typography variant="h4">{selectedApplicant.name}</Typography>

          {/* <Typography variant="subtitle1" color="text.secondary">
            {selectedApplicant.applicant.location}
          </Typography> */}
          <Stack spacing={3}>
            <Typography variant="subtitle1" color="text.secondary">
              {/* {selectedApplicant.applicant.summary} */}
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <AppIconButton
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
                View Resume
              </AppIconButton>
            </Stack>
          </Stack>

          <Typography variant="h4" sx={{ mt: 4 }}>
            About
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedApplicant.applicant.biography}
          </Typography>
          <Stack>
            <Typography variant="h5" sx={{ mt: 4 }}>
              Experience
            </Typography>

            {isLoading && <Typography>Loading experience data...</Typography>}

            {isError && (
              <Typography color="error">
                Error loading experience data.
              </Typography>
            )}

            {applicantData?.experiences &&
            applicantData.experiences.length > 0 ? (
              <ExperienceTimeline experiences={applicantData.experiences} />
            ) : (
              !isLoading &&
              !isError && (
                <Typography>
                  No experience data available for this applicant.
                </Typography>
              )
            )}
          </Stack>
        </Grid>
      </Stack>

      <Box
        onClick={handleViewJobDescription}
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "#F8FAFC",
          borderTop: "1px solid #E2E8F0",
          py: 2,
          px: 3,
          textAlign: "center",
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: "#F1F5F9",
          },
          marginTop: "auto",
        }}
      >
        <Typography
          color="primary"
          sx={{
            fontWeight: 500,
            fontSize: "0.875rem",
            lineHeight: 1,
          }}
        >
          View full job description
        </Typography>
      </Box>
    </Box>
  );
}
