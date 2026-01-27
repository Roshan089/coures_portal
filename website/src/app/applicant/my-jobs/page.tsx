"use client";

import JobPostingList from "@/components/applicant/JobPostingList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import {
  useGetApplicationDetailsQuery,
  useGetPendingApplicationsQuery,
  useGetSavedApplicationsQuery,
} from "@/store/api/applicationDetailsApiSlice";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { TJobs } from "@/shared/types/jobType";
import JobPostingDetails from "@/components/applicant/JobpostingDetails";
import ApplyPopover from "../job-listing/PopoverCv";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState("Rejected");
  const [selectedJob, setSelectedJob] = useState<TJobs | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:1200px)");

  const tabs = ["Saved", "Accepted", "Pending", "Rejected"];
  // const { setBreadcrumbs } = useBreadcrumbs();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const ApplicantId = currentUser.user.userType.id;

  const {
    data: pendingJobs,
    isLoading: isPendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = useGetPendingApplicationsQuery({
    applicantId: ApplicantId,
    status: activeTab,
  });

  const { data: savedApplication, refetch: refetchSaved } =
    useGetSavedApplicationsQuery({
      applicantId: ApplicantId,
    });
     // Popover state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { setBreadcrumbs } = useBreadcrumbs();

  const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  

  const savedJobs =
    savedApplication?.map((application) => application.job) || [];

  useEffect(() => {
    // Refetch both pending and saved applications when component mounts or activeTab changes
    refetchPending();
    refetchSaved();
  }, [activeTab]);

  useEffect(() => {
    setBreadcrumbs([{ label: "Jobs" }, { label: "My jobs" }]);
  }, [setBreadcrumbs]);

  const jobs =
    activeTab === "Saved"
      ? savedJobs
      : pendingJobs?.map((application) => application.job) || [];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleJobClick = (job: TJobs) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSelectedJob(null);
  };
  const displayedJobs =
    searchTerm.trim() === ""
      ? jobs
      : jobs.filter(
          (job: TJobs) =>
            (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.experience
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())) ??
            false
        );

  // Filter jobs based on search term

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Grid container justifyContent={"space-around"}>
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          px: { xs: 2, md: 4 },
          pb: 6,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 400,
            pl: { xs: 1 },
            pt: 4,
          }}
        >
          My Jobs
        </Typography>

        <Box
          sx={{
            display: { xs: 'grid', sm: 'flex' },
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'none' },
            gap: 2,
            mb: 2,
            px: { xs: 1 },
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => handleTabClick(tab)}
              sx={{
                minWidth: "100px",
                py: 1,
                px: 2,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                backgroundColor: activeTab === tab ? "#EA7516" : "transparent",
                color: activeTab === tab ? "white" : "#475569",
                border: "1px solid #475569",
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            height: "800px",
            display: "flex",
            gap: 2,
            width: "100%",
            mb: 4,
          }}
        >
          {isSmallScreen ? (
            selectedJob ? (
              <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
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
                <JobPostingDetails isMobile={true} selectedJob={selectedJob} handleApplyClick={handleApplyClick} />
                {/* <MyJobsDetails
                  isMobile={true}
                  selectedApplicant={selectedJob}
                /> */}
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: "100%" }}>
                <JobPostingList
                  jobs={displayedJobs}
                  onJobClick={handleJobClick}
                  searchTerm={searchTerm}
                  onSearch={handleSearch}
                />
              </Box>
            )
          ) : (
            <>
              <Box sx={{ width: "40%", height: "100%" }}>
                <JobPostingList
                  jobs={displayedJobs}
                  onJobClick={handleJobClick}
                  searchTerm={searchTerm}
                  onSearch={handleSearch}
                />
              </Box>
              <Box sx={{ width: "60%", height: "100%" }}>
                <JobPostingDetails
                  isMobile={true}
                  selectedJob={selectedJob || displayedJobs[0]}
                  handleApplyClick={handleApplyClick}
                  activeTab={activeTab}
                />
                    <ApplyPopover
        selectedJob={selectedJob || displayedJobs[0]}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
              </Box>
            </>
          )}
        </Box>
      </Stack>
    </Grid>
  );
}
