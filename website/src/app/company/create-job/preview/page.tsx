// pages/jobDetails.tsx
"use client";
import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const JobDetails = () => {
  const jobPreview = useSelector(
    (state: RootState) => state.jobPreview.jobData
  );

  return (
    <Container maxWidth="lg" sx={{ height: "100%" }}>
      <Box sx={{ paddingTop: "32px" }}>
        {/* Title Section */}
        <Typography
          variant="h4"
          sx={{
            marginBottom: "24px",
            fontSize: { xs: "1.5rem", sm: "2rem" }, // Adjust font size for different screen sizes
          }}
        >
          Confirm Job Settings
        </Typography>

        {/* Preview Section */}
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Preview
        </Typography>

        <Box p={30} sx={{ border: "1px solid #e0e0e0", padding: "16px" }}>
          <Grid p={3}>
            <Grid
              container
              spacing={3}
              sx={{
                height: "100%",
                border: "solid",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Column 1: Static labels (aligned to flex-end) */}
              <Grid
                sx={{
                  py: "2px",
                  display: "flex",
                  flexDirection: "column",
                  border: "solid",
                  alignItems: "flex-end",
                  width: { xs: "50%", sm: "15%" },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Job Title
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Company
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Workplace Type
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Experience
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Job Location
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Skills Required
                </Typography>
              </Grid>

              {/* Column 2: Values (aligned to flex-start) */}
              <Grid
                sx={{
                  border: "solid",

                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  width: { xs: "100%", sm: "50%" },
                }}
              >
                <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                  Lorem Ipsum
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                  Lorem Ipsum
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                  Lorem Ipsum
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                  Lorem Ipsum
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                  {jobPreview?.city && jobPreview?.state
                    ? `${jobPreview.city}, ${jobPreview.state}`
                    : jobPreview?.jobLocation || "Location not specified"}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                  Lorem Ipsum
                </Typography>
              </Grid>
            </Grid>

            {/* Message Section */}
            <Box sx={{ marginTop: "32px" }}>
              <Typography variant="body1">
                Thank you for your interest in the Logistics Specialist position
                at XYZ Pvt Ltd in Bengaluru, Karnataka, India.
                <br />
                Unfortunately, XYZ Pvt Ltd did not select your application to
                move forward in the hiring process.
              </Typography>
            </Box>

            {/* Footer Section */}
            <Box sx={{ marginTop: "32px", textAlign: "right" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Regards,
                <br />
                XYZ Pvt Ltd
              </Typography>
            </Box>
          </Grid>
        </Box>

        {/* Next Button */}
        <Box sx={{ marginTop: "32px", textAlign: "right" }}>
          <Button variant="contained" color="primary">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default JobDetails;
