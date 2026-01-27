"use client";

import { Stack, TextField, Box, Typography, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HomeIcon from "@mui/icons-material/Home";
import { TJobs } from "@/shared/types/jobType";
import { getStatusColor } from "@/utils/statusColor";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface JobPostingListProps {
  jobs: TJobs[];
  onJobClick: (job: TJobs) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function JobPostingList({
  jobs,
  onJobClick,
  searchTerm,
  onSearch,
}: JobPostingListProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };
  
  const { currentUser } = useSelector((state: RootState) => state.auth);
 const currentApplicantId=currentUser.user.userType.id


  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "100%",
        overflowY: "auto",
        p: { xs: 2, sm: 2, md: 3, lg: 4 },
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
      <Stack spacing={{ xs: 1, sm: 2 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search jobs..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ mb: { xs: 1, sm: 2 } }}
        />

        {/* Jobs List */}
        <Stack spacing={{ xs: 1, sm: 2 }}>
          {jobs?.map((job) => (
            <Box
              key={job.id}
              onClick={() => onJobClick(job)}
              sx={{
                cursor: "pointer",
                p: { xs: 1.5, sm: 2 },
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                width: "100%",
                bgcolor: "white",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Stack spacing={{ xs: 1, sm: 2 }} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                    borderBottom: "1px solid #E2E8F0",
                    pb: { xs: 1, sm: 2 },
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      fontWeight: 500,
                    }}
                  >
                    {job.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: { xs: "0.813rem", sm: "0.875rem" },
                      ml: { xs: 0, sm: "auto" },
                    }}
                  >
                    {job.jobType}
                  </Typography>
                </Box>

                <Stack spacing={{ xs: 1, sm: 2 }} sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "column",
                        lg: "row",
                      },
                      justifyContent: "space-between",
                      gap: { xs: 1, sm: 2 },
                      alignItems: { xs: "flex-start", md: "flex-start" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                          md: "column",
                        },
                        gap: { xs: 1, sm: 2 },
                        width: { xs: "100%", md: "auto" },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <HomeIcon
                          sx={{
                            color: "#F97316",
                            fontSize: { xs: "1.25rem", sm: "1.5rem" },
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#64748B",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {job.jobType}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarMonthIcon
                          sx={{
                            color: "#F97316",
                            fontSize: { xs: "1.25rem", sm: "1.5rem" },
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#64748B",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {`${job.minExperience} - ${job.maxExperience} years`}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOnIcon
                          sx={{
                            color: "#F97316",
                            fontSize: { xs: "1.25rem", sm: "1.5rem" },
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#64748B",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {job.city}
                        </Typography>
                      </Box>
                    </Box>

                    {(() => {
  const applicantApp = job.application?.find(
    (app) => app.applicantId === currentApplicantId
  );
  return applicantApp?.status ? (
    <Box
      sx={{
        width: { xs: "100%", md: "auto" },
        display: "flex",
        justifyContent: { xs: "flex-start", md: "flex-end" },
        mt: { xs: 1, md: 0 },
        alignSelf: "flex-start",
      }}
    >
      <Chip
        label={applicantApp.status}
        size="small"
        sx={{
          bgcolor: getStatusColor(applicantApp.status),
          color: "black",
          borderRadius: "12px",
          padding: { xs: "8px 0", sm: "10px 0" },
          width: { xs: "100%", md: "auto" },
          "& .MuiChip-label": {
            px: { xs: 1, sm: 2 },
            fontSize: { xs: "0.813rem", sm: "0.875rem" },
          },
        }}
      />
    </Box>
  ) : null;
})()}

                  </Box>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default JobPostingList;
