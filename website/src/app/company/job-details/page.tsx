"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { AppIconButton } from "@/components";

import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { COMPANY_ROUTES } from "@/shared/constants/routes/company.routes";
import { usePatchApplicationStatusMutation } from "@/store/api/applicationDetailsApiSlice";
import { RejectConfirmationDialog } from "@/components/company/ApplicantStatusDialogBox/RejectConfirmationDialog";
import { RejectedSuccessDialog } from "@/components/company/ApplicantStatusDialogBox/RejectedSuccessDialog";
import { AcceptedSuccessDialog } from "@/components/company/ApplicantStatusDialogBox/AcceptedSuccessDialog";
import { ShortlistedSuccessDialog } from "@/components/company/ApplicantStatusDialogBox/ShortlistedSuccessDialog";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import ExperienceTimeline from "@/components/common/CompanyExperienceTimeline/ExperienceTimeline";
import { useGetApplicantExperienceQuery } from "@/store/api/applicantProfileApiSlice";

const JobDetails = () => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  const applicantData = useSelector(
    (state: RootState) => state.applicantDetails.selectedApplicant
  );
  console.log("applicantData", applicantData);
  const [updateStatus, { isLoading }] = usePatchApplicationStatusMutation();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRejectedSuccessDialogOpen, setIsRejectedSuccessDialogOpen] =
    useState(false);
  const [isAcceptedSuccessDialogOpen, setIsAcceptedSuccessDialogOpen] =
    useState(false);
  const [isShortlistedSuccessDialogOpen, setIsShortlistedSuccessDialogOpen] =
    useState(false);
  const [currentStatus, setCurrentStatus] = useState(applicantData ? applicantData.status : "");

  const {
    data: applicantExperience,
    isLoading: isExperienceLoading,
    isError: isExperienceError
  } = useGetApplicantExperienceQuery(applicantData?.applicant.id);

  console.log("applicantData", applicantData);
  useEffect(() => {
    setBreadcrumbs([
      { label: "Job Postings" },
      {
        label: "View job postings",
        onClick: () => router.push(COMPANY_ROUTES.ALL_JOBS),
      },
      { label: "Job Applications", onClick: () => router.back() },
      { label: "Job Details" },
    ]);
    if (!applicantData) {
      router.push(COMPANY_ROUTES.JOB_APPLICATION);
    }
  }, [applicantData, router, setBreadcrumbs]);
  if (!applicantData) {
    return null;
  }

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus({
        jobId: applicantData.jobId,
        applicantId: applicantData.applicantId,
        status: status,
      }).unwrap();

      setCurrentStatus(status); // <-- update local state
      applicantData.status = status;
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
  };

  const handleRejectSuccess = () => {
    setIsRejectedSuccessDialogOpen(true);
  };

  const handleSuccessClose = () => {
    setIsRejectedSuccessDialogOpen(false);
  };

  const handleAcceptClick = async () => {
    try {
      await handleStatusUpdate("Accepted");
      setIsAcceptedSuccessDialogOpen(true);
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
  };

  const handleAcceptedSuccessClose = () => {
    setIsAcceptedSuccessDialogOpen(false);
  };

  const handleShortlistClick = async () => {
    try {
      await handleStatusUpdate("Shortlisted");
      setIsShortlistedSuccessDialogOpen(true);
    } catch (error) {
      console.error("Failed to shortlist application:", error);
    }
  };

  const handleShortlistedSuccessClose = () => {
    setIsShortlistedSuccessDialogOpen(false);
  };

  return (
    <>
      <Grid
        sx={{
          paddingLeft: { md: 8, xs: 1 },
          width: { md: "90%", xs: "100%" },
          height: "calc(100vh - 200px)",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" paddingY={3}>
          Job Details
        </Typography>
        <Card
          sx={{
            boxShadow: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              padding: 5,
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
                paddingLeft: 2,
              },
              "&::-webkit-scrollbar-track": {
                background: "lightgrey",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "grey",
                borderRadius: "8px",
              },
            }}
          >
            <Grid container justifyContent="space-between">
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={applicantData.applicant.profileUrl}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {applicantData.applicant.firstName}{" "}
                      {applicantData.applicant.lastName}
                    </Typography>
                     
                  </Box>
                </Stack>
                <Box pl={2}>
                  {/* <Typography>Email ID: {applicantData.applicant.}</Typography> */}
                  

                 
                </Box>
              </Stack>
              <Stack
                spacing={1}
                alignItems="flex-end"
                sx={{
                  paddingY: 2,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              >
                <AppIconButton
                  type="button"
                  sx={{
                    width: "100%",
                    paddingY: 2,
                    border: "1px solid black",
                    textTransform: "none",
                    borderRadius: "4px",
                    padding: "10px 35px",
                    fontSize: "1rem",
                    ":hover": { backgroundColor: "#333" },
                  }}
                  onClick={() =>
                    router.push(
                      `${COMPANY_ROUTES.CANDIDATE_MESSAGING}?receiverId=${applicantData.applicant.userId}`
                    )
                  }
                >
                  Message Applicant
                </AppIconButton>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#56BF80" }}
                    onClick={handleAcceptClick}
                    disabled={isLoading}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#FFB53E" }}
                    onClick={handleShortlistClick}
                    disabled={isLoading}
                  >
                    Shortlist
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#FB5B5B" }}
                    onClick={handleRejectClick}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                </Stack>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Current Status: <b>{currentStatus}</b>
                </Typography>
              </Stack>
            </Grid>

            <Box
              mt={4}
              sx={{
                maxHeight: "calc(100% - 200px)",
                overflowY: "auto",
              }}
            >
              
              <Typography variant="body1" paragraph>
                {applicantData.applicant.biography}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Experience
              </Typography>
              
              {isExperienceLoading && <Typography>Loading experience data...</Typography>}

              {isExperienceError && (
                <Typography color="error">
                  Error loading experience data.
                </Typography>
              )}

              {applicantExperience?.experiences && 
               applicantExperience.experiences.length > 0 ? (
                <ExperienceTimeline experiences={applicantExperience.experiences} />
              ) : (
                !isExperienceLoading &&
                !isExperienceError && (
                  <Typography>
                    No experience data available for this applicant.
                  </Typography>
                )
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <RejectConfirmationDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onSuccess={handleRejectSuccess}
        jobId={applicantData.jobId}
        applicantId={applicantData.applicantId}
      />

      <RejectedSuccessDialog
        isOpen={isRejectedSuccessDialogOpen}
        onClose={handleSuccessClose}
      />

      <AcceptedSuccessDialog
        isOpen={isAcceptedSuccessDialogOpen}
        onClose={handleAcceptedSuccessClose}
      />

      <ShortlistedSuccessDialog
        isOpen={isShortlistedSuccessDialogOpen}
        onClose={handleShortlistedSuccessClose}
      />
    </>
  );
};

export default JobDetails;
