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
const JobApplication: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Job Postings" },
      {
        label: "View job postings",
        onClick: () => router.push(COMPANY_ROUTES.ALL_JOBS),
      },
      { label: "Job Applications" },
    ]);
  }, [setBreadcrumbs, router]);

  // Get jobId from URL search params
  const jobId = searchParams.get("jobId");

  // Redirect if no jobId is provided
  useEffect(() => {
    if (!jobId) {
      router.push(COMPANY_ROUTES.DASHBOARD);
    }
  }, [jobId, router]);

  const dispatch = useDispatch();
  const { data: jobDetails } = useGetJobByIdQuery(jobId ?? "");

  // Add delete job mutation hook
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  // Fetch data using RTK Query
  const {
    data,
    isLoading,
    isError,
    refetch: refetchApplicants,
  } = useGetApplicationDetailsQuery(jobId ?? "");

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
      const applicantsWithName = data.map((applicant: TJobApplication) => ({
        ...applicant,
        name: `${applicant.applicant.firstName} ${applicant.applicant.lastName}`,
        // Ensure the name is set correctly
      }));

      console.log("Data fetched:", applicantsWithName);

      dispatch(setApplicants(applicantsWithName));
    }
  }, [data, dispatch]);

  // Add this effect to refetch data when component mounts
  useEffect(() => {
    refetchApplicants();
  }, []);

  if (!jobId) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading applicants.</div>;

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
    console.log("Selected applicant:", applicant); // Add this log to check
    setSelectedApplicant(applicant);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setSelectedTab(newValue);

  const handleBackClick = () => setSelectedApplicant(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value.toLowerCase());

  const handleViewJobDescription = () => {
    if (jobId) {
      router.push(`${COMPANY_ROUTES.JOB_DESCRIPTION}?id=${jobId}`);
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
      await deleteJob(jobId).unwrap();
      setShowCloseDialog(false);
      router.push(COMPANY_ROUTES.ALL_JOBS);
    } catch (error) {
      console.error("Error closing job:", error);
    }
  };

  return (
    <Grid>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 2,
          paddingX: 2,
        }}
      >
        <Typography variant="h4">Applicants List</Typography>
        <Stack direction={"row"} spacing={2}>
          <AppIconButton
            onClick={handleViewJobDescription}
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
              padding: "6px 35px",
              fontSize: "1rem",
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
          background: "linear-gradient(to right, #0066CC, #003399)",
          color: "white",
          position: "relative",
          py: { xs: 3, md: 4 },
        }}
      >
        {/* Left side - Job info */}
        <Box
          sx={{
            maxWidth: "1400px",
            margin: "0 auto",
            pl: { xs: 2, md: 4 },
            pr: { xs: 2, sm: "220px", md: "400px" },
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                mb: 1,
              }}
            >
              {formatDate(jobDetails?.createdAt ?? "", defaultFormat)}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 500,
                mb: 1,
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              {jobDetails?.title}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ opacity: 0.8 }}
            >
              <Typography>
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
              <Typography>{jobDetails?.jobType}</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Right side - Stats */}
        <Box
          sx={{
            position: { xs: "relative", sm: "absolute" },
            right: 0,
            top: { xs: "auto", sm: "50%" },
            transform: { xs: "none", sm: "translateY(-50%)" },
            bgcolor: "#FFFFFFA3",
            borderRadius: { xs: "16px", sm: "16px 0 0 16px" },
            px: { xs: 3, sm: 4, md: 6 },
            py: 2,
            display: "flex",
            gap: { xs: 3, sm: 4, md: 6 },
            minWidth: "fit-content",
            mx: { xs: 2, sm: 0 },
            mt: { xs: 3, sm: 0 },
          }}
        >
          <Stack alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: "#1E293B",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              {counts.all}
            </Typography>
            <Typography
              sx={{
                color: "#64748B",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Applications
            </Typography>
          </Stack>

          <Divider
            orientation="vertical"
            sx={{ bgcolor: "#64748B" }}
            flexItem
          />

          <Stack alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: "#1E293B",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              {counts.shortlisted}
            </Typography>
            <Typography
              sx={{
                color: "#64748B",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Shortlisted
            </Typography>
          </Stack>

          <Divider
            orientation="vertical"
            sx={{ bgcolor: "#64748B" }}
            flexItem
          />

          <Stack alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: "#1E293B",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              {counts.rejected}
            </Typography>
            <Typography
              sx={{
                color: "#64748B",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Rejected
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          px: 2,
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            minWidth: 100,
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
          mx: 3,
          p: 3,
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
    </Grid>
  );
};

export default JobApplication;
