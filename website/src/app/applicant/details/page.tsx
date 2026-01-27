"use client";
import { useEffect } from "react";

import { Box, Stack, Typography, Button, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppIconButton } from "@/components";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import Image from "next/image";
import BACKGROUND from "../../../components/company/background.png";
import ExperienceTimeline from "../../../components/common/CompanyExperienceTimeline/ExperienceTimeline";
import { useGetApplicantExperienceQuery } from "@/store/api/applicantProfileApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { APPLICANT_ROUTES } from "@/shared/constants";

const JobDetailsPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const ApplicantId = currentUser.user.userType.id;

  const { data: userDetails, refetch } =
    useGetApplicantExperienceQuery(ApplicantId);
  useEffect(() => {
    refetch();
  }, [userDetails, ApplicantId]);
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([{ label: "Profile" }]);
  }, [setBreadcrumbs]);
  const router = useRouter();

  // Update the function to use router
  function handleCloseJobClick(): void {
    router.push(APPLICANT_ROUTES.ALL_JOBS);
  }

  const experience = userDetails?.experiences;
  return (
    <Grid>
      {/* Header Box with Back Button and Job Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 2,
          paddingX: { xs: 2, sm: 5 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Stack direction={"row"}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
          >
            Job details
          </Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{
            mt: { xs: 0, sm: 1 },
            background: "#536485",
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={handleCloseJobClick}
        >
          Explore job
        </Button>
      </Box>
      <Grid
        sx={{
          justifyContent: "center",
          paddingX: { xs: 2, sm: 5 },
          width: { xs: "100%", sm: "97.5%" },
          paddingBottom: 3,
        }}
      >
        <Box
          sx={{
            height: { xs: "calc(100vh - 100px)", sm: "100vh" },
            overflowY: "auto",
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
        >
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              margin: { xs: 1, sm: 2 },
            }}
          >
            <Stack spacing={{ xs: 6, sm: 8 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  // Adjust the height for better layout
                }}
              >
                <Image src={BACKGROUND} alt="background" layout="fill" />
                <Avatar
                  src="/avatar.jpg"
                  sx={{
                    width: 100,
                    height: 100,

                    right: -8,
                    bottom: -50,
                  }}
                />
              </Box>
              <Grid sx={{ justifyItems: "left", px: { xs: 1, sm: 2 } }}>
                <Typography
                  variant="h4"
                  sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
                >
                  {userDetails?.firstName} {userDetails?.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {userDetails?.city}, {userDetails?.state},{" "}
                  {userDetails?.country}
                </Typography>
                <Stack spacing={3}>
                  <Typography variant="subtitle1" color="text.secondary">
                    {userDetails?.summary}
                  </Typography>
                  <Stack direction={"row"} spacing={2}>
                    <AppIconButton
                      title="Edit Profile"
                      type="button"
                      bgcolor="#536485"
                      color="white"
                      onClick={() => router.push("/applicant/create-profile")}
                      sx={{
                        textTransform: "none",
                        borderRadius: "4px",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        mt: 1,
                        ":hover": { backgroundColor: "#3f4b63" },
                      }}
                    >
                      Edit Profile
                    </AppIconButton>
                  </Stack>
                </Stack>
                <Typography variant="h4" sx={{ mt: 2 }}>
                  About
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {userDetails?.biography}
                </Typography>

                <Typography variant="h5" sx={{ mt: 4 }}>
                  Experience
                </Typography>
                <ExperienceTimeline experiences={experience} />
              </Grid>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default JobDetailsPage;
