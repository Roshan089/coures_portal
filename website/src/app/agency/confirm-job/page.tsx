"use client";
import { Box, IconButton, Typography, Stack, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { useCreateJobDetailsMutation } from "@/store/api/jobApiSlice";
import { clearJobPreview } from "@/store/features/jobPreview/jobPreviewSlice";
import { useState, useEffect } from "react";
import { JobSuccessDialog } from "@/components/company/JobSuccessDialog";
import RichTextDisplay from "@/components/common/RichTextDisplay/index";
import { AppIconButton } from "@/components";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
const ConfirmJobSetting = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const jobPreview = useSelector(
    (state: RootState) => state.jobPreview.jobData
  );

  const [createJobDetails, { isLoading }] = useCreateJobDetailsMutation();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Redirect if no preview data
  useEffect(() => {
    if (!jobPreview) {
      router.push(AGENCY_ROUTES.CREATE_JOB);
    }
  }, [jobPreview, router]);

  const handleEditClick = () => {
    router.push(AGENCY_ROUTES.CREATE_JOB);
  };

  const handleConfirmClick = async () => {
    if (!jobPreview) return;

    const payload = { ...jobPreview };

    try {
      const response = await createJobDetails(payload).unwrap();
      if (response) {
        setShowSuccessDialog(true);
      }
    } catch (err) {
      console.error("Error submitting job details:", err);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    dispatch(clearJobPreview());
  };

  if (!jobPreview) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "#F0F9FF" }}>
        {/* Header Section - Now outside the main container */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            px: { xs: 2, md: 4 },
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "1400px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => router.back()}
                sx={{
                  color: "text.primary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" fontWeight={500}>
                Confirm Job Setting
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Job Info Section - Updated with dynamic data */}
        <Box sx={{ width: "100%", py: 1 }}>
          <Box
            sx={{
              maxWidth: "1400px",
              margin: "0 auto",
              px: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 4,
              }}
            >
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", gap: 1, color: "text.secondary" }}>
                  <Typography>
                    {" "}
                    {jobPreview.createdAt
                      ? new Date(jobPreview.createdAt).toLocaleDateString()
                      : "recently"}
                  </Typography>
                </Box>

                <Typography variant="h4" fontWeight={600}>
                  {jobPreview.title}
                </Typography>

                <Box sx={{ display: "flex", gap: 10 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#F97316" }} />
                    <Typography>{jobPreview.city}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon sx={{ color: "#F97316" }} />
                    <Typography>{jobPreview.jobType}</Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Vertical Divider - Centered and Darker */}
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  mr: 4, // Added margin for centering
                  borderColor: "#000000", // Darker color
                  borderRightWidth: 2,
                }}
              />

              {/* Right Stack - Updated with dynamic data */}
              <Stack direction={"row"} sx={{ flex: 1 }}>
                <Box
                  sx={{
                    paddingTop: 2,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 4,
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Experience
                    </Typography>
                    <Typography variant="body1">
                      {jobPreview.minExperience}-{jobPreview.maxExperience}{" "}
                      years
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Work level
                    </Typography>
                    <Typography variant="body1">
                      {jobPreview.workLevel}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Salary
                    </Typography>
                    <Typography variant="body1">
                      {jobPreview.minSalary} - {jobPreview.maxSalary}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Content Section - Updated with dynamic data */}
        <Box sx={{ bgcolor: "white", width: "100%", py: 4 }}>
          <Box
            sx={{ maxWidth: "1400px", margin: "0 auto", px: { xs: 2, md: 4 } }}
          >
            {/* About the job */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                About the job
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  mb: 6,
                  whiteSpace: "pre-wrap", // Preserve line breaks
                }}
              >
                <RichTextDisplay content={jobPreview.description} />
              </Typography>
            </Box>

            {/* Skills Required - Updated with dynamic data */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 3, textAlign: "left" }}
              >
                Skills Required
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "flex-start",
                }}
              >
                {jobPreview.skillsRequired?.filter((skill): skill is string => skill !== undefined).map((skill) => (
                  <Box
                    key={skill}
                    sx={{
                      bgcolor: "#F0F9FF",
                      px: 3,
                      py: 1.5,
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      color: "#334155",
                    }}
                  >
                    {skill}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <AppIconButton
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  padding: "5px 3rem",
                  fontSize: "1rem",
                  color: "white",
                  bgcolor: "#475569",
                  ":hover": { bgcolor: "#334155" },
                }}
                onClick={handleEditClick}
              >
                Edit
              </AppIconButton>

              <AppIconButton
                variant="contained"
                sx={{
                  bgcolor: "#475569",
                  color: "white",
                  px: 8,
                  py: 1.5,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#334155" },
                }}
                onClick={handleConfirmClick}
                disabled={isLoading}
              >
                {isLoading ? "Confirming..." : "Confirm"}
              </AppIconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <JobSuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleDialogClose}
        route={AGENCY_ROUTES.DASHBOARD}
      />
    </>
  );
};

export default ConfirmJobSetting;
