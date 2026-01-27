"use client";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";

// Ensure this path is correct

import { AppIconButton } from "../common";
import { useRouter } from "next/navigation";
import RichTextDisplay from "../common/RichTextDisplay";
import { TJobs } from "@/shared/types/jobType";
import { getStatusColor } from "@/utils/statusColor";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ApplicationDetailsProps {
  selectedJob: TJobs;
  isMobile: boolean;
  handleBackClick?: () => void;
  handleApplyClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  activeTab?: string;
}

export function JobPostingDetails({
  selectedJob,
  isMobile,
  handleBackClick,
  handleApplyClick,
  activeTab,
}: ApplicationDetailsProps) {
  if (!selectedJob) {
    return (
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please select a job to view details
        </Typography>
      </Box>
    );
  }

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const currentApplicantId=currentUser.user.userType.id
 
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`/applicant/job-details?jobId=${selectedJob.id}`);
  };
  const applicantApplication = selectedJob?.application?.find(
    (app) => app.applicantId === currentApplicantId
  );
  const applicationStatus = applicantApplication?.status;
  console.log("applicationStatus",selectedJob);
  
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "100%",
        overflowY: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "background.paper",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "8px",
          "&:hover": {
            background: "#666",
          },
        },
      }}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "center" },
            width: "100%",
            gap: { xs: 2, sm: 0 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
              width: { xs: "100%", sm: "auto" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {selectedJob?.title}
          </Typography>
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            {(applicationStatus|| (activeTab
            )
            ) ? (
              <Chip
                label={applicationStatus || activeTab}
                size="small"
                sx={{
                  bgcolor: getStatusColor(applicationStatus || activeTab || ''),
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
                  width: { xs: "100%", md: "auto" },
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
        </Box>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {selectedJob?.title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.15rem", sm: "1.5rem" },
          }}
        >
          {selectedJob?.minSalary && selectedJob?.maxSalary
            ? `${selectedJob.minSalary}-${selectedJob.maxSalary} per month`
            : selectedJob?.minSalary
            ? `Starting from ${selectedJob.minSalary} per month`
            : selectedJob?.maxSalary
            ? `Up to ${selectedJob.maxSalary} per month`
            : ""}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            "& .MuiChip-root": {
              width: { xs: "100%", sm: "auto" },
            },
          }}
        >
          <Chip
            label={selectedJob?.jobType}
            sx={{
              bgcolor: "primary.50",
              color: "primary.main",
              borderRadius: "24px",
              height: "32px",
              fontSize: "0.95rem",
              "& .MuiChip-label": {
                px: 2,
              },
            }}
          />
          <Chip
            label={`${selectedJob?.minExperience} - ${selectedJob?.maxExperience} years`}
            sx={{
              bgcolor: "primary.50",
              color: "primary.main",
              borderRadius: "24px",
              height: "32px",
              fontSize: "0.95rem",
              "& .MuiChip-label": {
                px: 2,
              },
            }}
          />
        </Stack>
        <Divider sx={{ border: "1px solid #ddd" }}></Divider>
        <RichTextDisplay content={selectedJob?.description} />
        <Button
          onClick={handleNavigate}
          sx={{
            mt: { xs: 1, sm: 2 },
            p: { xs: 2, sm: 3 },
            bgcolor: "#F8FAFC",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            width: { xs: "100%", sm: "auto" },
            transition: "background 0.2s, color 0.2s",
            ":hover": {
              bgcolor: "primary.main",
              color: "white",
              "& .MuiTypography-root": {
                color: "white",
              },
            },
          }}
        >
          <Typography
            color="primary"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              transition: "color 0.2s",
            }}
          >
            View full job description
          </Typography>
        </Button>
      </Stack>
    </Box>
  );
}

export default JobPostingDetails;
