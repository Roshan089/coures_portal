"use client";
import { AppIconButton } from "@/components";
import CustomDropdown from "@/components/common/AppDropdown/AppDropdown";
import InputField from "@/components/common/AppInput/AppInput";
import AboutTextField from "@/components/common/AppTextField/AppTextFeild";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'

import { CompanyCreationHooray } from "@/components/company/CompanyCreationHooray";
import {
  useGetCompanyProfileQuery,
  useSubmitCompanyProfileMutation,
  useUpdateCompanyProfileMutation,
} from "@/store/api/companyApiSlice"; // Correct import for the mutation hook
import { setAuthState, updateUserType } from "@/store/features/auth/authSlice";
import { RootState } from "@/store/store";

import { useDispatch, useSelector } from "react-redux";
import { companySizes, companyTypes } from "./createData";
import {
  CreateValidationSchema,
  FormValues,
} from "@/yup/createValidationSchema";
import { COMPANY_ROUTES } from "@/shared/constants";

const CreateCompanyProfile: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(CreateValidationSchema),
  });

  // Fetch existing company profile data
  const { data: existingProfile, isLoading: isProfileLoading } =
    useGetCompanyProfileQuery(currentUser.user?.userType?.id);

  // Mutations for creating and updating company profile
  const [submitCompanyProfile] = useSubmitCompanyProfileMutation();
  const [updateCompanyProfile] = useUpdateCompanyProfileMutation();
  const dispatch = useDispatch();
  const [showHooray, setShowHooray] = useState(false);
  const router = useRouter()

  const companySizeMap = {
    "10": "10+",
    "50": "50+",
    "100": "100+",
    10: "10+",
    50: "50+",
    100: "100+",
    "10+": "10+",
    "50+": "50+",
    "100+": "100+"
  };

  // Populate form with existing data if available
  useEffect(() => {
    if (existingProfile) {
      reset({
        name: existingProfile.name,
        website: existingProfile.website,
        companySize: companySizeMap[existingProfile.companySize] || "10+", // <-- fix here
        companyType: existingProfile.companyType,
        imageUrl: existingProfile.imageUrl,
        logoUrl: existingProfile.logoUrl,
        description: existingProfile.description,
        location: existingProfile.location,
        agreement: false,
      });
    }
  }, [existingProfile, reset]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submission started with data: ", data);

    try {
      const transformedData = {
        ...data,
        companySize: parseInt(data.companySize.replace("+", ""), 10),
        imageUrl: data.imageUrl || "https://placehold.co/600x400",
        logoUrl: data.logoUrl || "https://placehold.co/600x400",
      };

      let response;
      try {
        if (existingProfile) {
          response = await updateCompanyProfile({
            companyId: existingProfile.id,
            updatedData: transformedData,
          }).unwrap();
        } else {
          response = await submitCompanyProfile(transformedData).unwrap();
        }
      } catch (error) {
        console.error("Error during profile submission: ", error);
      }

      console.log("saved data response ", response);

      if (response) {
        dispatch(updateUserType(response));
      }
      if (response && !existingProfile?.id) {
        dispatch(setAuthState(true));
      }

      setShowHooray(true); // Show success modal
      
      // Add navigation after successful creation
      if (response && !existingProfile?.id) {
        router.push(COMPANY_ROUTES.DASHBOARD)
      }
    } catch (error) {
      console.error("Error occurred during form submission: ", error);
    }
  };

  if (isProfileLoading) {
    return <Typography>Loading....</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Main Container */}
      <Box
        sx={{
          width: "100%",
          padding: "0.5rem",
          maxWidth: "1100px",
          borderRadius: "8px",
          overflowY: "hidden",
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            textAlign: "start",
            fontWeight: "500",
            fontSize: "28px",
          }}
        >
          {existingProfile ? "Edit Company Profile" : "Create Company Profile"}
        </Typography>

        {/* Upload Section */}
        <Box
          sx={{
            mb: 4,
            height: "11rem",
            display: "flex",
            justifyContent: "s",
            alignItems: "center",
            backgroundColor: "info.main",
            borderRadius: "12px",
            padding: "10px 20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              FlexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "150px",
              height: "10rem",
              backgroundColor: "#ABE8FF",
              borderRadius: "50%",
              flexDirection: "column",
            }}
          >
            <img
              src="https://dummyimage.com/150x150/cccccc/000000&text=Logo"
              alt="Dummy Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <img
            src="https://dummyimage.com/500x150/cccccc/000000&text=Cover+Image"
            alt="Dummy Cover Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            spacing={12}
            sx={{
              height: "100%", // Ensure parent has full height
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack items in a column on mobile, and row on larger screens
            }}
          >
            {/* Left part of the form */}
            <Grid
              size={6}
              spacing={40}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginRight: "10rem",
              }}
            >
              {/* Form inputs */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Company Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Website URL"
                    error={!!errors.website}
                    helperText={errors.website?.message}
                  />
                )}
              />
              <Controller
                name="companySize"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    value={field.value} // String value for the dropdown
                    onChange={(value) => field.onChange(value)} // No conversion needed here
                    options={companySizes}
                    label="Company Size"
                    error={!!errors.companySize}
                    helperText={errors.companySize?.message}
                  />
                )}
              />

              <Controller
                name="companyType"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    value={String(field.value)} // Keep it as string for companyType
                    onChange={(value) => field.onChange(value)}
                    options={companyTypes}
                    label="Company Type"
                    error={!!errors.companyType}
                    helperText={errors.companyType?.message}
                  />
                )}
              />
            </Grid>

            {/* Right part of the form */}
            <Grid
              size={6}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginRight: "2rem",

                justifyContent: {
                  xs: "center", // Center vertically on small screens
                  sm: "flex-start", // Align to the top on larger screens
                },
                alignItems: {
                  xs: "center", // Center horizontally on small screens
                  sm: "flex-start", // Align to the left on larger screens
                },
                width: "100%",
              }}
            >
              {/* About */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AboutTextField
                    {...field}
                    lable="About"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />

              {/* Location */}
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Location"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Agreement Section */}
          <FormControlLabel
            control={
              <Controller
                name="agreement"
                control={control}
                render={({ field }) => <Checkbox {...field} />}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                I confirm that I am an authorized representative of this
                organization and have the authority to create and manage this
                page on its behalf. Both the organization and I agree to comply
                with the additional terms applicable to Pages.
              </Typography>
            }
            sx={{ mt: 3, alignItems: "flex-start" }}
          />

          {/* Show error message for agreement */}
          {errors.agreement && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.agreement.message}
            </Typography>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 4,
            }}
          >
            <AppIconButton
              type="submit"
              color="secondary.main"
              sx={{
                textTransform: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "1rem",
              }}
            >
              {existingProfile ? "Update Profile" : "Create Profile"}
            </AppIconButton>

            
          </Box>
        </form>
      </Box>

      <CompanyCreationHooray
        isOpen={showHooray}
        onClose={() => {
          setShowHooray(false)
          
        }}
      />
    </Box>
  );
};

export default CreateCompanyProfile;
