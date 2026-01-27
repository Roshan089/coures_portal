"use client";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import { useGetJobByIdQuery } from "@/store/api/jobApiSlice";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { ArrowBack } from "@mui/icons-material";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { COMPANY_ROUTES } from "@/shared/constants";
import RichTextDisplay from "@/components/common/RichTextDisplay";
const JobDescription = () => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Job Postings" },
      {
        label: "View job postings",
        onClick: () => router.push(COMPANY_ROUTES.ALL_JOBS),
      },
      { label: "Job Applications", onClick: () => router.back() },
      {
        label: "Job Description",
      },
    ]);
  }, [setBreadcrumbs, router]);
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id"); // Get jobId from URL params

  // If no jobId is provided, redirect to a fallback page or show an error

  const {
    data: jobDetails,
    isLoading,
    error,
  } = useGetJobByIdQuery(jobId || skipToken);

  const handleBackClick = () => {
    router.back(); // Navigates to the previous page
  };
  console.log("details",jobDetails?.company?.name);
  


  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Error loading job details</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#F0F9FF" }}>
      {/* Header Section */}
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

            alignItems: "center",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <ArrowBack onClick={handleBackClick} />
          <Typography variant="h4" fontWeight={500}>
            Job Description
          </Typography>
        </Box>
      </Box>

      {/* Job Info Section */}
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
                  {jobDetails?.company?.name }
                </Typography>
                <Typography>•</Typography>
                <Typography>
                  {jobDetails?.createdAt
                    ? new Date(jobDetails.createdAt).toLocaleDateString()
                    : "recently"}
                </Typography>
              </Box>

              <Typography variant="h4" fontWeight={600}>
                {jobDetails?.title}
              </Typography>

              <Box sx={{ display: "flex", gap: 10 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ color: "#F97316" }} />
                  <Typography>{jobDetails?.city}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WorkIcon sx={{ color: "#F97316" }} />
                  <Typography>{jobDetails?.jobType}</Typography>
                </Box>
              </Box>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mr: 4,
                borderColor: "#000000",
                borderRightWidth: 2,
              }}
            />

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
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Experience
                  </Typography>
                  <Typography variant="body1">
                    {jobDetails?.minExperience}-{jobDetails?.maxExperience}{" "}
                    years
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Work level
                  </Typography>
                  <Typography variant="body1">
                    {jobDetails?.workLevel}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Salary
                  </Typography>
                  <Typography variant="body1">
                    {jobDetails?.minSalary}-{jobDetails?.maxSalary}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ bgcolor: "white", width: "100%", py: 4 }}>
        <Box
          sx={{ maxWidth: "1400px", margin: "0 auto", px: { xs: 2, md: 4 } }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              About the job
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 6 }}>
            {jobDetails?.description
              ? <RichTextDisplay content={jobDetails.description} />
              : <Typography color="error">Description not available.</Typography>
            }
            </Typography>
          </Box>

          {/* Skills Required */}
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
              {jobDetails?.skillsRequired?.map((skill) => (
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
        </Box>
      </Box>
    </Box>
  );
};

export default JobDescription;
