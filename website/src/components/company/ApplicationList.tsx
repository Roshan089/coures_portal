import React from "react";
import { Stack, TextField, Box, Avatar, Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AppIconButton } from "../common";
// Assuming useFetch hook is in "@/hooks/useFetch"

import { TJobApplication } from "@/shared/types/jobApplications";
import { formatDate } from "@/utils/date";

// Add status color mapping
const statusColorMap: Record<string, { color: string; background: string }> = {
  PENDING: { color: '#16A34A', background: '#DCFCE7' },
  ACCEPTED: { color: '#2563EB', background: '#DBEAFE' },
  REJECTED: { color: '#DC2626', background: '#FEE2E2' },
  SHORTLISTED: { color: '#CA8A04', background: '#FEF9C3' },
}

interface ApplicantListProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  filteredApplicants: TJobApplication[];
  handleListItemClick: (applicant: TJobApplication) => void;
}
const defaultFormat = "DD-MM-YYYY";
const ApplicationList: React.FC<ApplicantListProps> = ({
  searchTerm,
  handleSearchChange,
  filteredApplicants,
  handleListItemClick,
}) => {
  const getStatusStyle = (status: string) => {
    const statusKey = status.toUpperCase()
    return statusColorMap[statusKey] || { color: 'grey', background: '#F3F4F6' }
  }

  return (
    <Grid
      sx={{
        paddingX: 2,
        overflowY: "auto",
        height: "100%",
        "&::-webkit-scrollbar": {
          width: "8px",
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
      width={"100%"}
    >
      <Stack>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search applicants..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ marginBottom: 2, paddingX: 1 }}
        />

        {filteredApplicants.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 2,
              textAlign: 'center',
              border: '1px dashed #D1D9E9',
              borderRadius: '8px',
              height: 'calc(100vh - 140px)',
              minHeight: '400px',
              m: 1,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              No Applicants Yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              There are currently no applications for this position
            </Typography>
          </Box>
        ) : (
          filteredApplicants.map((applicant) => (
            <Box
              key={applicant.id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #D1D9E9",
                borderRadius: "8px",
              }}
            >
              <Stack 
                direction="row" 
                spacing={2} 
                paddingBottom={1}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={applicant.applicant.profileUrl}
                    sx={{ width: 56, height: 56, mb: 1 }}
                  />
                  <Stack>
                    <Typography variant="h6">{applicant.name}</Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      {applicant.applicant.location}
                    </Typography> */}
                  </Stack>
                </Stack>
                
                <Chip
                  label={applicant.status}
                  sx={{
                    height: '24px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    ...getStatusStyle(applicant.status),
                    '& .MuiChip-label': {
                      px: 2,
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Applied on {formatDate(applicant.createdAt, defaultFormat)}
                </Typography>
                <AppIconButton
                  onClick={() => handleListItemClick(applicant)}
                  type="button"
                  sx={{
                    width: "100%",
                    border: "1px solid black",
                    textTransform: "none",
                    borderRadius: "4px",
                    padding: "6px 35px",
                    fontSize: "1rem",
                    ":hover": { backgroundColor: "#333" },
                  }}
                >
                  Review application
                </AppIconButton>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Grid>
  );
};

export default ApplicationList;
