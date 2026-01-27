"use client";

import { Box, Button, Stack, Typography, Divider, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useRouter } from "next/navigation";
import ApplyPopover from "../job-listing/PopoverCv";
import { useEffect, useState } from "react";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { useSearchParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppIconButton from "@/components/common/AppIconButton";

import { APPLICANT_ROUTES } from "@/shared/constants/routes/applicant.routes";
import { useGetJobByIdQuery } from "@/store/api/jobApiSlice";
import RichTextDisplay from "@/components/common/RichTextDisplay";
import {
  useGetApplicationDetailsQuery,
  usePatchSavedApplicationsMutation,
  usePostApplicationSaveStatusMutation,
} from "@/store/api/applicationDetailsApiSlice";
import { getStatusColor } from "@/utils/statusColor";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function JobDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const { data: job, error, isLoading } = useGetJobByIdQuery(jobId);

  const [postApplicationSaveStatus] = usePostApplicationSaveStatusMutation();
  const [patchSavedApplications] = usePatchSavedApplicationsMutation();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentId = currentUser.user.userType.id;
  const { data: application, isLoading: isPendingLoadings } =
    useGetApplicationDetailsQuery(
      { jobId: job?.id, applicantId: currentId },
      { skip: !job?.id || !currentId }
    );

  const [localApplicantAction, setLocalApplicantAction] = useState<
    string | null
  >(null);

  // Find application for current user
  const currentUserApplication = job?.application?.find(
    (app) => app.applicantId === currentId
  );

  const applicationStatus = currentUserApplication?.status;
  const applicantAction = currentUserApplication?.applicantAction;
  

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

  useEffect(() => {
    if (applicantAction) {
      setLocalApplicantAction(applicantAction);
    }
  }, [applicantAction]); // Update local state when API data changes

  useEffect(() => {
    setBreadcrumbs([
      { label: "Jobs" },
      {
        label: "All Jobs",
        onClick: () => router.push(APPLICANT_ROUTES.ALL_JOBS),
      },
      { label: "Job Details" },
    ]);
  }, [setBreadcrumbs, router]);

  const handleSave = async () => {
    if (!job?.id) return; // Early return if no job id

    try {
      if (!localApplicantAction) {
        const data = {
          jobId: job?.id,
          applicantId: currentId,
        };
        await postApplicationSaveStatus(data).unwrap();
        setLocalApplicantAction("save");
        return;
      }

      // Toggle action between 'save' and 'unsave'
      const newAction = localApplicantAction === "save" ? "unsave" : "save";

      const data = {
        jobId: job?.id,
        applicantId: currentId,
        applicantAction: newAction,
      };

      await patchSavedApplications(data).unwrap();
      setLocalApplicantAction(newAction);
    } catch (error) {
      console.error("Error saving application status:", error);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching job details.</Typography>;
  if (!job) return <Typography>No job found.</Typography>;

  return (
    <Box sx={{ width: "100%", bgcolor: "#F0F9FF" }}>
      <Stack>
        {/* Header Section */}
        <Box sx={{ width: "100%", bgcolor: "white" }}>
          <Box
            sx={{
              maxWidth: "1500px",
              margin: "0 auto",
              px: { xs: 2, md: 1 },
              py: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 2, sm: 1 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ArrowBackIcon
                  sx={{
                    cursor: "pointer",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    "&:hover": { opacity: 0.7 },
                  }}
                  onClick={() => router.back()}
                />
                <Typography
                  variant="h4"
                  fontWeight={500}
                  sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  Job Details
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", md: "row" },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Box>
                  {currentUserApplication?.status ? (
                    <Chip
                      label={applicationStatus}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(applicationStatus || ''),
                        color: "black",
                        borderRadius: "12px",
                        padding: { xs: "10px 0", md: "18px 0" },
                        width: { xs: "100%", sm: "auto" },
                        "& .MuiChip-label": {
                          px: 2,
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  ) : (
                    <AppIconButton
                      title="Apply Now"
                      type="button"
                      bgcolor="primary.main"
                      color="white"
                      onClick={handleApplyClick}
                      sx={{
                        textTransform: "none",
                        borderRadius: "4px",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        width: { xs: "100%", md: "150px" },
                        ":hover": {
                          backgroundColor: "primary.dark",
                          opacity: 0.9,
                        },
                      }}
                    >
                      Apply Now
                    </AppIconButton>
                  )}
                </Box>
                <AppIconButton
                  title="Message"
                  type="button"
                  bgcolor="primary.main"
                  color="white"
                  onClick={() =>
                    router.push(`/applicant/chats?receiverId=${jobId}`)
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "4px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    width: { xs: "100%", md: "150px" },
                    ":hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  Message
                </AppIconButton>

                {!applicationStatus && (
                  <AppIconButton
                    title={
                      localApplicantAction === "save"
                        ? "Unsave Job"
                        : "Save Job"
                    }
                    type="button"
                    bgcolor="primary.main"
                    color="white"
                    onClick={handleSave}
                    endIcon={<BookmarkIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontSize: "1rem",
                      width: { xs: "100%", md: "150px" },
                      minWidth: { md: "150px" },
                      ":hover": { backgroundColor: "primary.dark" },
                    }}
                  >
                    {localApplicantAction === "save"
                      ? "Unsave Job"
                      : "Save Job"}
                  </AppIconButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Job Info Section */}
        <Box>
          <Box
            sx={{
              maxWidth: "1450px",
              margin: "0 auto",
              px: { xs: 2, md: 4 },
              py: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: { xs: 3, md: 4 },
              }}
            >
              {/* Left Stack - Company info */}
              <Stack spacing={2} sx={{ flex: 1, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    color: "text.secondary",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography>{job?.company?.name}</Typography>
                  <Typography>•</Typography>
                  <Typography>
                    {new Date(job?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  fontWeight={600}
                  sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  {job?.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 4, md: 17 },
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#F97316" }} />
                    <Typography>
                      {job?.city}, {job?.state}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon sx={{ color: "#F97316" }} />
                    <Typography>{job?.jobType}</Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Vertical Divider - Hide on mobile */}
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderColor: "#000000",
                  borderRightWidth: 3,
                  display: { xs: "none", md: "block" },
                }}
              />

              {/* Horizontal Divider - Show only on mobile */}
              <Divider
                sx={{
                  borderColor: "#000000",
                  borderBottomWidth: 3,
                  width: "100%",
                  display: { xs: "block", md: "none" },
                }}
              />

              {/* Right Stack - Job details grid */}
              <Stack direction={"row"} sx={{ flex: 1, width: "100%" }}>
                <Box
                  sx={{
                    paddingTop: { xs: 0, md: 2 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: { xs: 2, md: 4 },
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    >
                      Experience
                    </Typography>
                    <Typography variant="body1">
                      {job?.minExperience}-{job?.maxExperience} years
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    >
                      Work level
                    </Typography>
                    <Typography variant="body1">{job?.workLevel}</Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    >
                      Salary
                    </Typography>
                    <Typography variant="body1">
                      {job?.minSalary && job?.maxSalary
                        ? `${job.minSalary}-${job.maxSalary}K`
                        : "Not specified"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Job Description Section */}
        <Box sx={{ bgcolor: "white" }}>
          <Box
            sx={{
              maxWidth: "1450px",
              margin: "0 auto",
              px: { xs: 2, md: 4 },
              py: { xs: 2, md: 6 },
            }}
          >
            <RichTextDisplay content={job.description} />
          </Box>
        </Box>
      </Stack>

      <ApplyPopover
        selectedJob={job}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </Box>
  );
}
