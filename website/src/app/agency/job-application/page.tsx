"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Divider,
  Tab,
  Tabs,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AppIconButton } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setApplicants } from "@/store/features/applicationJobDetails/applicationJobDetails";
import ApplicantDetails from "../../../components/company/ApplicationDetails";
import ApplicationList from "../../../components/company/ApplicationList";
import { TJobApplication } from "@/shared/types/jobApplications";
import { useGetJobByIdQuery } from "@/store/api/jobApiSlice";
import { useGetApplicationDetailsQuery } from "@/store/api/applicationDetailsApiSlice";
import { useDeleteJobMutation } from "@/store/api/jobApiSlice";
import { CloseJobDialog } from "@/components/company/CloseJobDialog";
import { COMPANY_ROUTES } from "@/shared/constants/routes/company.routes";
import { formatDate } from "@/utils/date";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
import { performanceMonitor } from "@/utils/performance";

const JobApplication: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    setBreadcrumbs([
      { label: "Job Postings" },
      {
        label: "View Clients",
        onClick: () => router.push(AGENCY_ROUTES.ALL_CLIENTS),
      },
      { label: "Job Applications" },
    ]);
  }, [setBreadcrumbs, router]);

  // Get jobId from URL search params
  const jobId = searchParams.get("jobId");

  // Redirect if no jobId is provided
  useEffect(() => {
    if (!jobId) {
      router.push(AGENCY_ROUTES.DASHBOARD);
    }
  }, [jobId, router]);

  const dispatch = useDispatch();
  
  // Optimize API calls with conditional fetching
  const { data: jobDetails, isLoading: jobDetailsLoading } = useGetJobByIdQuery(jobId ?? "", {
    skip: !jobId
  });

  // Add delete job mutation hook
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  // Fetch data using RTK Query with optimized settings
  const {
    data,
    isLoading,
    isError,
    refetch: refetchApplicants,
  } = useGetApplicationDetailsQuery(jobId ?? "", {
    skip: !jobId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false, // Prevent unnecessary refetches
  });

  // Access the Redux state for applicants
  const applicants = useSelector(
    (state: RootState) => state.applicants.applicants
  );
  
  // Local states
  const [selectedApplicant, setSelectedApplicant] =
    useState<TJobApplication | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useMediaQuery("(max-width:1267px)");
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const defaultFormat = "DD-MM-YYYY";
  
  // Update Redux state with fetched applicants
  useEffect(() => {
    if (data) {
      performanceMonitor.measureSync('Process Applicants Data', () => {
        const applicantsWithName = data.map((applicant: TJobApplication) => ({
          ...applicant,
          name: `${applicant.applicant.firstName} ${applicant.applicant.lastName}`,
        }));

        console.log("Data fetched:", applicantsWithName);
        dispatch(setApplicants(applicantsWithName));
      });
    }
  }, [data, dispatch]);

  // Add this effect to refetch data when component mounts
  useEffect(() => {
    if (jobId) {
      performanceMonitor.measureAsync('Initial Data Load', async () => {
        await refetchApplicants();
      });
    }
  }, [jobId]); // Only refetch when jobId changes

  // Show loading state with better UX
  if (!jobId) return null;
  
  if (isLoading || jobDetailsLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Loading job applications...
        </Typography>
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="error">
          Error loading applicants. Please try again.
        </Typography>
        <AppIconButton
          onClick={() => refetchApplicants()}
          sx={{ mt: 2 }}
        >
          Retry
        </AppIconButton>
      </Box>
    );
  }

  // Filter applicants based on status and search term
  const getFilteredApplicants = () => {
    let filtered = applicants;

    // Filter by status based on selected tab
    switch (selectedTab) {
      case 0: // All
        break;
      case 1: // Accepted
        filtered = filtered.filter(
          (app) => app.status.toUpperCase() === "ACCEPTED"
        );
        break;
      case 2: // Shortlisted
        filtered = filtered.filter(
          (app) => app.status.toUpperCase() === "SHORTLISTED"
        );
        break;
      case 3: // Rejected
        filtered = filtered.filter(
          (app) => app.status.toUpperCase() === "REJECTED"
        );
        break;
      default:
        break;
    }

    // Then filter by search term
    return filtered.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleApplicantClick = (applicant: TJobApplication) => {
    console.log("Selected applicant:", applicant);
    setSelectedApplicant(applicant);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setSelectedTab(newValue);

  const handleBackClick = () => setSelectedApplicant(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value.toLowerCase());

  const handleViewJobDescription = () => {
    if (jobId) {
      performanceMonitor.measureAsync('Navigate to Job Description', async () => {
        router.push(`${AGENCY_ROUTES.JOB_DESCRIPTION}?id=${jobId}`);
      });
    }
  };

  // Get counts for each status
  const getCounts = () => {
    return {
      all: applicants.length,
      accepted: applicants.filter(
        (app) => app.status.toUpperCase() === "ACCEPTED"
      ).length,
      shortlisted: applicants.filter(
        (app) => app.status.toUpperCase() === "SHORTLISTED"
      ).length,
      rejected: applicants.filter(
        (app) => app.status.toUpperCase() === "REJECTED"
      ).length,
    };
  };

  const counts = getCounts();

  // Modify handleCloseJob to show dialog first
  const handleCloseJob = async () => {
    setShowCloseDialog(true);
  };

  // Add new handler for actual job closing
  const handleConfirmClose = async () => {
    if (!jobId) return;

    try {
      await performanceMonitor.measureAsync('Close Job', async () => {
        await deleteJob(jobId).unwrap();
      });
      setShowCloseDialog(false);
      router.push(AGENCY_ROUTES.ALL_JOBS);
    } catch (error) {
      console.error("Error closing job:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", minWidth: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 2,
          paddingX: { xs: 1, sm: 2 },
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
            width: { xs: "100%", sm: "auto" },
            textAlign: { xs: "center", sm: "left" },
            mb: { xs: 1, sm: 0 }
          }}
        >
          Applicants List
        </Typography>
        <Stack 
          direction={"row"} 
          spacing={{ xs: 1, sm: 2 }}
          sx={{ 
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "center", sm: "flex-end" }
          }}
        >
          <AppIconButton
            onClick={handleViewJobDescription}
            type="button"
            sx={{
              border: "1px solid black",
              textTransform: "none",
              borderRadius: "4px",
              padding: { xs: "4px 20px", sm: "6px 35px" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              ":hover": { backgroundColor: "#333" },
            }}
          >
            View Job Description
          </AppIconButton>
          <AppIconButton
            onClick={handleCloseJob}
            disabled={isDeleting}
            type="button"
            sx={{
              border: "1px solid black",
              textTransform: "none",
              borderRadius: "4px",
              padding: { xs: "4px 20px", sm: "6px 35px" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              ":hover": { backgroundColor: "#333" },
            }}
          >
            Close Job
          </AppIconButton>
        </Stack>
      </Box>

      {/* Updated Job Summary */}
      <Box
        sx={{
          width: "100%",
          minWidth: "100%",
          background: "linear-gradient(to right, #0066CC, #003399)",
          color: "white",
          position: "relative",
          py: { xs: 2, sm: 3, md: 4 },
          overflow: "hidden",
        }}
      >
        {/* Container for better responsive control */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "1200px", lg: "1400px" },
            margin: "0 auto",
            position: "relative",
            px: { xs: 0, sm: 3, md: 4 },
          }}
        >
          {/* Left side - Job info */}
          <Box
            sx={{
              pr: { 
                xs: 1, 
                sm: "200px", 
                md: "300px", 
                lg: "350px" 
              },
              pl: { xs: 1, sm: 0 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Stack spacing={{ xs: 0.5, sm: 1, md: 1.5 }}>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.8,
                  fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                }}
              >
                {formatDate(jobDetails?.createdAt ?? "", defaultFormat)}
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 500,
                  fontSize: { 
                    xs: "1rem", 
                    sm: "1.5rem", 
                    md: "2rem", 
                    lg: "2.5rem",
                    xl: "3rem"
                  },
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.2 },
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                {jobDetails?.title}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.5, sm: 1, md: 2 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ 
                  opacity: 0.8,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
                    lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                  }}
                >
                  {jobDetails?.state}, {jobDetails?.city}
                </Typography>
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    width: "4px",
                    height: "4px",
                    bgcolor: "white",
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
                    lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                  }}
                >
                  {jobDetails?.jobType}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Right side - Stats */}
          <Box
            sx={{
              position: { xs: "relative", sm: "absolute" },
              right: { xs: "auto", sm: 0 },
              top: { xs: "auto", sm: "50%" },
              transform: { xs: "none", sm: "translateY(-50%)" },
              bgcolor: "#FFFFFFA3",
              borderRadius: { xs: "8px", sm: "12px 0 0 12px" },
              px: { xs: 1, sm: 2, md: 3, lg: 4 },
              py: { xs: 1, sm: 1.5, md: 2 },
              display: "flex",
              gap: { xs: 0.25, sm: 1, md: 1.5, lg: 2 },
              minWidth: { xs: "auto", sm: "180px", md: "220px", lg: "280px" },
              maxWidth: { xs: "100%", sm: "auto" },
              mx: { xs: 1, sm: 0 },
              mt: { xs: 2, sm: 0 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              justifyContent: { xs: "space-around", sm: "flex-start" },
              zIndex: 2,
              width: { xs: "calc(100% - 16px)", sm: "auto" },
              alignItems: "center",
            }}
          >
            <Stack alignItems="center" sx={{ 
              minWidth: { xs: "40px", sm: "60px", md: "70px", lg: "80px" },
              flex: { xs: "1 1 auto", sm: "none" }
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  color: "#1E293B",
                  fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem", lg: "1.5rem" },
                  lineHeight: { xs: 1.1, sm: 1.2 },
                }}
              >
                {counts.all}
              </Typography>
              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.7rem", lg: "0.75rem" },
                  lineHeight: { xs: 1.1, sm: 1.2 },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Applications
              </Typography>
            </Stack>

            <Divider
              orientation="vertical"
              sx={{ 
                bgcolor: "#64748B",
                display: { xs: "none", sm: "block" },
                height: { sm: "30px", md: "35px", lg: "40px" },
                alignSelf: "center",
              }}
              flexItem
            />

            <Stack alignItems="center" sx={{ 
              minWidth: { xs: "40px", sm: "60px", md: "70px", lg: "80px" },
              flex: { xs: "1 1 auto", sm: "none" }
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  color: "#1E293B",
                  fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem", lg: "1.5rem" },
                  lineHeight: { xs: 1.1, sm: 1.2 },
                }}
              >
                {counts.shortlisted}
              </Typography>
              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.7rem", lg: "0.75rem" },
                  lineHeight: { xs: 1.1, sm: 1.2 },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Shortlisted
              </Typography>
            </Stack>

            <Divider
              orientation="vertical"
              sx={{ 
                bgcolor: "#64748B",
                display: { xs: "none", sm: "block" },
                height: { sm: "30px", md: "35px", lg: "40px" },
                alignSelf: "center",
              }}
              flexItem
            />

            <Stack alignItems="center" sx={{ 
              minWidth: { xs: "40px", sm: "60px", md: "70px", lg: "80px" },
              flex: { xs: "1 1 auto", sm: "none" }
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  color: "#1E293B",
                  fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem", lg: "1.5rem" },
                  lineHeight: { xs: 1.1, sm: 1.2 },
                }}
              >
                {counts.rejected}
              </Typography>
              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.7rem", lg: "0.75rem" },
                  lineHeight: { xs: 1.1, sm: 1.2 },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Rejected
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          px: { xs: 1, sm: 2 },
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            fontWeight: 500,
            minWidth: { xs: 60, sm: 80, md: 100 },
          },
        }}
      >
        <Tab label={`All (${counts.all})`} />
        <Tab label={`Accepted (${counts.accepted})`} />
        <Tab label={`Shortlisted (${counts.shortlisted})`} />
        <Tab label={`Rejected (${counts.rejected})`} />
      </Tabs>

      {/* Application List and Applicant Details Container */}
      <Box
        sx={{
          height: "600px",
          mt: 3,
          mb: 4,
          mx: { xs: 1, sm: 3 },
          p: { xs: 1, sm: 2, md: 3 },
          boxShadow:
            "0px 2px 8px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "white",
          border: "1px solid #eee",
        }}
      >
        <Stack
          spacing={2}
          direction={isMobile ? "column" : "row"}
          sx={{
            height: "100%",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            selectedApplicant ? (
              <ApplicantDetails
                selectedApplicant={selectedApplicant}
                handleBackClick={handleBackClick}
                isMobile
              />
            ) : (
              <ApplicationList
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                filteredApplicants={getFilteredApplicants()}
                handleListItemClick={handleApplicantClick}
              />
            )
          ) : (
            <>
              <Box
                sx={{
                  width: "40%",
                  height: "100%",
                  borderRight: "1px solid #eee",
                  overflow: "auto",
                }}
              >
                <ApplicationList
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                  filteredApplicants={getFilteredApplicants()}
                  handleListItemClick={handleApplicantClick}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  height: "100%",
                  overflow: "auto",
                }}
              >
                {selectedApplicant ? (
                  <ApplicantDetails
                    selectedApplicant={selectedApplicant}
                    handleBackClick={handleBackClick}
                    isMobile={false}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Typography color="text.secondary">
                      Select an applicant to view details
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Stack>
      </Box>

      {/* Add the dialog */}
      <CloseJobDialog
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={handleConfirmClose}
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default JobApplication;
