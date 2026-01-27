"use client";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import JobExperienceForm from "./jobExperience"; // Import the new JobExperienceForm component
import InputField from "@/components/common/AppInput/AppInput"; // Import the custom InputField component
import Grid from "@mui/material/Grid2";
import ProfileCreated from "./ProfileCreated";
import React, { useEffect } from "react";
import { AppIconButton } from "@/components";
import { setApplicantProfile } from "@/store/features/ApplicantProfile/ApplicantProfileSlice";
import {
  useGetApplicantExperienceQuery,
  useSubmitApplicantProfileMutation,
  useUpdateApplicantProfileMutation,
} from "@/store/api/applicantProfileApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  JobExperience,
  ProfileData,
  profileSchema,
} from "@/yup/applicantCreateProfilevalidation";
import { yupResolver } from "@hookform/resolvers/yup";
import AboutTextField from "@/components/common/AppTextField/AppTextFeild";
import CustomDropdown from "@/components/common/AppDropdown/AppDropdown";
import {
  useGetStateListQuery,
  useGetCityListQuery,
} from "@/store/api/utilsApiSlice";
import { State } from "@/shared/types/StateType";
import { useRouter } from "next/navigation";
import { APPLICANT_ROUTES } from "@/shared/constants";
import { RootState } from "@/store/store";
import { setAuthState, updateUserType } from "@/store/features/auth/authSlice";
import DeleteIcon from "@mui/icons-material/Delete";
const india = "IN";
const ProfileForm = () => {
  const { data: getStateList, isLoading } = useGetStateListQuery(india); // undefined if no dynamic params
  const [selectedState, setSelectedState] = React.useState("");
  const { data: getCityList, isLoading: isCityLoading } = useGetCityListQuery({
    stateCode: selectedState,
    countryCode: india,
  });
  const { currentUser } = useSelector((state: RootState) => state.auth);
  useEffect(() => {}, [getStateList]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProfileData>({
    resolver: yupResolver(profileSchema), // Apply Yup for validation
  });

  // Watch the state field to update the city dropdown
  const watchState = watch("state");

  useEffect(() => {
    if (watchState) {
      // Find the state code from state name
      const stateObj = getStateList?.find((state) => state.name === watchState);
      if (stateObj) {
        setSelectedState(stateObj.isoCode);
      }
    }
  }, [watchState, getStateList]);

  const { data: existingProfile, isLoading: isProfileLoading } =
    useGetApplicantExperienceQuery(currentUser.user.userType.id);
  // State to manage the dialog open/close
  const [openDialog, setOpenDialog] = React.useState(false);
  const [experienceForms, setExperienceForms] = React.useState<JobExperience[]>(
    []
  ); // Initially no forms

  // Handle adding a new job experience form
  const handleAddExperience = () => {
    setExperienceForms([
      ...experienceForms,
      {
        title: "",
        employmentType: "Full Time" as
          | "Full Time"
          | "Part Time"
          | "Contract"
          | "Internship",
        company: "",
        state: "",
        city: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrentRole: false,
      },
    ]); // Add a new job experience form with default values
  };

  const handleRemoveExperience = (index: number) => {
    const updatedForms = experienceForms.filter((_, i) => i !== index);
    setExperienceForms(updatedForms);

    // Update the react-hook-form state to match
    const currentExperiences = watch("experiences") || [];
    const updatedExperiences = currentExperiences.filter((_, i) => i !== index);
    setValue("experiences", updatedExperiences);
  };
  const route = useRouter();
  const [
    submitCompanyProfile,
    {
      /*isLoading */
    },
  ] = useSubmitApplicantProfileMutation(); // API mutation hook
  const [updateApplicantProfile] = useUpdateApplicantProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (existingProfile) {
      reset({
        firstName: existingProfile.firstName,
        lastName: existingProfile.lastName,
        state: existingProfile.state,
        currentRole: existingProfile.currentRole,
        biography: existingProfile.biography,
        city: existingProfile.city,
        experiences: existingProfile.experiences || [], // Ensure it's always an array
      });
      // Initialize experienceForms state from existingProfile
      if (
        existingProfile.experiences &&
        existingProfile.experiences.length > 0
      ) {
        setExperienceForms(existingProfile.experiences);
      }
    }
  }, [existingProfile, reset]);
  const onSubmit = async (data: ProfileData) => {
    try {
      let response;

      if (existingProfile) {
        const updatedExperiences = data.experiences
          ? data.experiences.map((exp) => ({
              ...exp,
              employmentType: exp.employmentType as
                | "Full Time"
                | "Part Time"
                | "Contract"
                | "Internship",
              applicantId: existingProfile.id,
            }))
          : [];

        const formattedData = {
          firstName: data.firstName,
          lastName: data.lastName,
          currentRole: data.currentRole,
          country: "IN",
          gender: "male",
          state: data.state,
          city: data.city,
          profileUrl: "profile_url_placeholder",
          backgroundUrl: "background_url_placeholder",
          biography: data.biography,
          experiences: updatedExperiences,
        };

        response = await updateApplicantProfile({
          applicantId: existingProfile.id,
          updateData: formattedData,
        }).unwrap();
        route.push(APPLICANT_ROUTES.PROFILE);
      } else {
        const formattedData = {
          firstName: data.firstName,
          lastName: data.lastName,
          currentRole: data.currentRole,
          country: "IN",
          gender: "male",
          state: data.state,
          city: data.city,
          profileUrl: "profile_url_placeholder",
          backgroundUrl: "background_url_placeholder",
          biography: data.biography,
          experiences: data.experiences
            ? data.experiences.map((exp) => ({
                ...exp,
                employmentType: exp.employmentType as
                  | "Full Time"
                  | "Part Time"
                  | "Contract"
                  | "Internship",
                endDate: exp.endDate || "", // Ensure endDate is always a string
              }))
            : [],
        };

        response = await submitCompanyProfile(formattedData).unwrap();
        dispatch(setApplicantProfile(response));
        route.push(APPLICANT_ROUTES.ALL_JOBS);
      }

      if (response) {
        dispatch(updateUserType(response));
        if (!existingProfile?.id) dispatch(setAuthState(true));
      }
    } catch (error) {
      console.error("Error handling profile submission:", error);
    }
  };

  const handleCloseDialog = () => {
    // Close the dialog
    setOpenDialog(false);
  };

  return (
    <Grid
      py={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        paddingBottom: "5rem",
      }}
    >
      {/* Main Form Wrapper */}
      <Grid
        size={12}
        sx={{
          display: "flex",
          flexDirection: "row",
          width: { xs: "90%", sm: "90%", md: "80%" },
          justifyContent: "center",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* Title Section */}
          <Typography variant="h5" gutterBottom>
            Create Profile
          </Typography>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            {/* First Name and Last Name Section */}
            <Grid
              container
              spacing={{
                xs: 1,
                sm: 8,
                md: "8rem",
              }}
            >
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="First Name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} sx={{}}>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Last Name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Current Role Section */}

            {/* Parent Grid with size 12 */}
            <Grid
              container
              spacing={{
                xs: 1,
                sm: 8,
                md: "8rem",
              }}
            >
              {/* First Child Grid for Current Role and First Application */}
              <Grid
                size={{ xs: 12, sm: 6 }}
                spacing={{
                  xs: 1,
                  sm: 8,
                  md: "8rem",
                }}
                sx={{}}
              >
                <Controller
                  name="currentRole"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Current Role"
                      error={!!errors.currentRole}
                      helperText={errors.currentRole?.message}
                      sx={{ marginTop: 2 }}
                    />
                  )}
                />
                {/* CheckBox for First Application */}
                <FormControlLabel
                  control={<Checkbox />}
                  label="Check if this is your first application."
                  sx={{ marginTop: 2 }}
                />
              </Grid>

              {/* Second Child Grid for Location */}
              <Grid
                container
                size={{ xs: 12, sm: 6 }}
                spacing={{
                  xs: 1,
                  md: "2rem",
                }}
              >
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Controller
                    name="state" // Dynamic field registration
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <CustomDropdown
                        {...field}
                        options={
                          getStateList?.map((state: State) => state.name) || []
                        }
                        label="state"
                        error={!!errors?.state}
                        helperText={errors?.state?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <CustomDropdown
                        {...field}
                        options={getCityList?.map((city) => city.name) || []}
                        label="city"
                        error={!!errors?.city}
                        helperText={errors?.city?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Biography Field */}
            <Grid
              container
              spacing={{
                xs: 1,
                sm: 8,
                md: "8rem",
              }}
            >
              <Grid size={{ xs: 12, sm: 12 }}>
                <Controller
                  name="biography"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <AboutTextField
                      {...field}
                      lable="Biography"
                      error={!!errors.biography}
                      helperText={errors.biography?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Job Experience Section */}
            <Typography variant="h6" sx={{ marginTop: 4 }}>
              Job Experience
            </Typography>

            {/* Dynamically render each JobExperienceForm */}
            {/* Dynamically render each JobExperienceForm */}
            {experienceForms.map((_, index) => (
              <Box key={index}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <AppIconButton
                    variant="submit"
                    bgcolor="white"
                    color="orange"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <DeleteIcon />
                  </AppIconButton>
                </Box>
                <JobExperienceForm
                  index={index}
                  control={control}
                  errors={errors}
                />
              </Box>
            ))}
            {/* Add Button to append another job experience form */}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddExperience}
              sx={{ marginTop: 2 }}
            >
              + Previous Job experience
            </Button>

            {/* Buttons for Saving or Skipping */}
            <Grid sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <AppIconButton
                title="Create"
                type="submit"
                color="seconadry.main"
                sx={{
                  textTransform: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                }}
                disabled={isLoading} // Disable button while API request is in progress
              >
                {isLoading
                  ? "Creating..."
                  : existingProfile
                  ? "Update"
                  : "Create"}
              </AppIconButton>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => route.push(APPLICANT_ROUTES.ALL_JOBS)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'white',
                    borderColor: 'secondary.main',
                  },
                  '&:active': {
                    backgroundColor: 'secondary.dark',
                    color: 'white',
                    borderColor: 'secondary.dark',
                    transform: 'scale(0.98)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Skip
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <ProfileCreated open={openDialog} onClose={handleCloseDialog} />
    </Grid>
  );
};

export default ProfileForm;
