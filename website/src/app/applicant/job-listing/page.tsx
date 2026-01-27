"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Box,
  Stack,
  useMediaQuery,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import JobPostingDetails from "../../../components/applicant/JobpostingDetails";
import JobPostingList from "../../../components/applicant/JobPostingList";
import AppBanner from "@/components/common/AppBanner/AppBanner";
import TopCompanies from "@/components/applicant/TopCompanies";
import ApplyPopover from "./PopoverCv";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { TJobs } from "@/shared/types/jobType";
import { useGetJobsListQuery } from "@/store/api/jobApiSlice";
import FilterIcon from "@/components/common/FilterIcon";
import FilterMenu from "@/components/company/FilterMenu";
const Home = () => {
  const { data: getJobsList, isLoading, error } = useGetJobsListQuery();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [filters, setFilters] = useState({
    sortByRecent: false,
    jobRole: "",
    location: "",
    date: null,
    minExperience: "",
    maxExperience: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams = useMemo(() => {
    const filterObj: any = {};

    if (filters.jobRole) {
      filterObj.title = filters.jobRole
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    if (filters.location) {
      filterObj.city = filters.location
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    if (filters.minExperience) filterObj.minExperience = filters.minExperience;
    if (filters.maxExperience) filterObj.maxExperience = filters.maxExperience;

    const query: any = {};

    // Add filters if present
    if (Object.keys(filterObj).length > 0) {
      query.filter = JSON.stringify(filterObj);
    }

    // Add sort if present
    if (filters.sortByRecent) {
      query.sort = "createdAt:desc";
    }

    // Add date filter if present
    if (filters.date) {
      query.sort = `createdAt:${filters.date.toISOString().split("T")[0]}`;
    }

    // Add search if present
    if (searchTerm.trim()) {
      query.search = searchTerm;
    }

    return { query };
  }, [filters, searchTerm]);

  // Use the query params in the API call
  const { data: jobsList } = useGetJobsListQuery(queryParams);


  

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    handleFilterClose();
  };

  // Trigger this effect when getJobsList is updated
  useEffect(
    () => setBreadcrumbs([{ label: "Jobs" }, { label: "All jobs" }]),
    [setBreadcrumbs]
  );
  const [selectedJob, setSelectedJob] = useState<TJobs | null>(null);
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  // State for managing popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); // Opens the popover when Apply is clicked
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleJobClick = (job: TJobs) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSelectedJob(null);
  };

  if (isLoading) {
    return <CircularProgress />; // Show a loading spinner while data is being fetched
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error loading jobs. Please try again later.
      </Typography>
    );
  }

  if (!getJobsList || getJobsList.rows.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary">
        No job listings available at the moment.
      </Typography>
    );
  }

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
        <Grid display={"flex"} justifyContent={"center"} paddingY={2}>
          <AppBanner />
        </Grid>

        <Box sx={{ width: "auto", height: "auto", py: 3 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              pl: { xs: 1 },
            }}
          >
            Top Companies
          </Typography>
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                pb: 1, // Add padding bottom to show scrollbar
                minWidth: "min-content", // Ensures content doesn't wrap
              }}
            >
              <TopCompanies data={getJobsList?.rows} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              pl: { xs: 1 },
            }}
          >
            Latest Jobs posts
          </Typography>
          <Box
            onClick={handleFilterClick}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              px: 2,
            }}
          >
            <FilterIcon />
          </Box>
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
          <FilterMenu
            isOpen={Boolean(filterAnchorEl)}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
            onFilterChange={handleFilterChange}
          />
          {isSmallScreen ? (
            selectedJob ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  pt: { xs: 5, sm: 6 }, // Add top padding to prevent overlap with back button
                }}
              >
                <IconButton
                  onClick={handleBackClick}
                  sx={{
                    position: "absolute",
                    top: { xs: 8, sm: 12 }, // Adjusted top position
                    left: { xs: 8, sm: 12 }, // Adjusted left position
                    zIndex: 2, // Increased z-index
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    width: { xs: 35, sm: 40 }, // Explicit width
                    height: { xs: 35, sm: 40 }, // Explicit height
                    "&:hover": {
                      bgcolor: "background.paper",
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <JobPostingDetails
                    isMobile={true}
                    handleBackClick={handleBackClick}
                    selectedJob={selectedJob}
                    handleApplyClick={handleApplyClick}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: "100%" }}>
                <JobPostingList
                  jobs={jobsList?.rows || []}
                  onJobClick={handleJobClick}
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </Box>
            )
          ) : (
            <>
              <Box sx={{ width: "40%", height: "100%" }}>
                <JobPostingList
                  jobs={jobsList?.rows || []}
                  onJobClick={handleJobClick}
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </Box>
              <Box sx={{ width: "60%", height: "100%" }}>
                {selectedJob && (
                  <JobPostingDetails
                    isMobile={false}
                    handleBackClick={handleBackClick}
                    handleApplyClick={handleApplyClick}
                    selectedJob={selectedJob}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Stack>

      <ApplyPopover
        selectedJob={selectedJob}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </Grid>
  );
};

export default Home;
