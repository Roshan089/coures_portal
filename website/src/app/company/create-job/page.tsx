"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  jobDetailsFormSchema,
  jobDetailsFormValues,
} from "@/yup/jobDetailSchema"; // Import schema and type
import {
  Box,
  TextField,
  Chip,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Correct import for Grid2
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import CustomDropdown from "@/components/common/AppDropdown/AppDropdown";
import { useGetStateListQuery } from "@/store/api/utilsApiSlice";
import { jobTypes } from "./JobData";
import { AppIconButton } from "@/components";
import InputField from "@/components/common/AppInput/AppInput";

import Tiptap from "@/components/common/Tiptap";

import { useDispatch, useSelector } from "react-redux";
import { setJobPreview } from "@/store/features/jobPreview/jobPreviewSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { stripHtml } from "@/utils/stripHtml";
import { COMPANY_ROUTES } from "@/shared/constants/routes/company.routes";
import { State } from "@/shared/types/StateType";
import { useGetCityListQuery } from "@/store/api/utilsApiSlice";
import { City, CityListResponse } from "@/shared/types/CityType";
const india = "IN";
const JobDetailsForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const jobPreview = useSelector(
    (state: RootState) => state.jobPreview.jobData
  );
  const CompanyId = useSelector(
    (state: RootState) => state.auth.currentUser.user.userType.id
  );
  const userId = useSelector(
    (state: RootState) => state.auth.currentUser.user.id
  );
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<jobDetailsFormValues>({
    defaultValues: jobPreview || {
      title: "",
      companyId: CompanyId,
      userId: userId,
      minExperience: 0,
      maxExperience: 0,
      minSalary: 0,
      maxSalary: 0,
      state: "",
      city: "",
      jobType: "",
      workLevel: "",
      status: "Active",
      skillsRequired: [],
      description: "",
      qualificationFilter: false,
    },
    resolver: yupResolver(jobDetailsFormSchema),
  });
  const [stateCodeMap, setStateCodeMap] = useState<{ [key: string]: string }>(
    {}
  );
  const { setBreadcrumbs } = useBreadcrumbs();
  const { data: getStateList } = useGetStateListQuery(india);

  // Update stateCodeMap when state list is loaded
  useEffect(() => {
    if (getStateList) {
      const mapping = getStateList.reduce((acc, state: State) => {
        acc[state.name] = state.isoCode;
        return acc;
      }, {} as { [key: string]: string });
      setStateCodeMap(mapping);
    }
  }, [getStateList]);
  useEffect(() => {
    setBreadcrumbs([
      { label: "Job Postings" },
      { label: "Add New job Posting" },
    ]);
  }, [setBreadcrumbs]);
  const selectedStateName = watch("state");
  const selectedStateCode = selectedStateName
    ? stateCodeMap[selectedStateName]
    : "";

  const { data: getCityList } = useGetCityListQuery(
    {
      stateCode: selectedStateCode,
      countryCode: india,
    },
    {
      skip: !selectedStateCode,
    }
  );

  const [inputValue, setInputValue] = useState<string>("");
  const [minSalaryFocused, setMinSalaryFocused] = useState(false);
  const [maxSalaryFocused, setMaxSalaryFocused] = useState(false);

  const handleAddSkill = (skill: string) => {
    const currentSkills = watch("skillsRequired") || [];
    if (skill.trim() && !currentSkills.includes(skill)) {
      setValue("skillsRequired", [...currentSkills, skill.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = watch("skillsRequired") || [];
    setValue(
      "skillsRequired",
      currentSkills.filter((s) => s !== skill)
    );
  };

  const onSubmit = async (data: jobDetailsFormValues) => {
    const payload = {
      ...data,
      status: "Active",
      description: data.description,
    };

    // Just save to preview and navigate, don't call API yet
    dispatch(setJobPreview(payload));
    router.push(COMPANY_ROUTES.CONFIRM_JOB_SETTING);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "hidden",
        paddingBottom: 5,
      }}
    >
      <Grid
        sx={{
          paddingTop: 2,
          px: 2,
          width: { xs: "100%", sm: "100%", md: "80%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Enter Job Details
        </Typography>

        <Grid container spacing={2} sx={{ flexDirection: "column" }}>
          {/* Main container for two columns */}
          <Grid
            container
            spacing={2}
            paddingRight={2}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              mb: 2,
            }}
          >
            {/* Left Column - Job Role and Salary */}
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Job Role */}
              <Box>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Job Role"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Box>

              {/* Salary Range */}
              <Box>
                <Typography variant="subtitle1">Salary range</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Controller
                    name="minSalary"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        value={minSalaryFocused && field.value === 0 ? "" : field.value.toString()}

                        label="Min"
                        placeholder="Enter minimum salary"
                        fullWidth
                        error={!!errors.minSalary}
                        helperText={errors.minSalary?.message}
                        onFocus={() => setMinSalaryFocused(true)}
                        onBlur={() => setMinSalaryFocused(false)}

                      />
                    )}
                  />
                  <Controller
                    name="maxSalary"
                    control={control}
                    render={({ field }) => (
                        <InputField
                        {...field}
                        value={maxSalaryFocused && field.value === 0 ? "" : field.value.toString()}

                        label="Max"
                        placeholder="Enter maximum salary"
                        fullWidth
                        error={!!errors.maxSalary}
                        helperText={errors.maxSalary?.message}
                        onFocus={() => setMaxSalaryFocused(true)}
                        onBlur={() => setMaxSalaryFocused(false)}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Job Type and Experience */}
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Job Type */}
              <Box>
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <CustomDropdown
                      {...field}
                      label="Job Type"
                      options={jobTypes}
                      error={!!errors.jobType}
                      helperText={errors.jobType?.message}
                    />
                  )}
                />
              </Box>

              {/* Experience */}
              <Box>
                <Typography variant="subtitle1">Experience</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Controller
                    name="minExperience"
                    control={control}
                    render={({ field }) => (
                      <CustomDropdown
                        {...field}
                        label="Min"
                        options={[
                          ...Array.from({ length: 50 }, (_, i) => `${i}`),
                        ]}
                        error={!!errors.minExperience}
                        helperText={errors.minExperience?.message}
                      />
                    )}
                  />
                  <Controller
                    name="maxExperience"
                    control={control}
                    render={({ field }) => (
                      <CustomDropdown
                        {...field}
                        label="Max"
                        options={[
                          ...Array.from({ length: 50 }, (_, i) => `${i + 1}`),
                        ]}
                        error={!!errors.maxExperience}
                        helperText={errors.maxExperience?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* State, City, and Job Type in one row */}
          <Grid
            container
            spacing={2}
            paddingRight={2}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            {/* State and City Container */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", gap: 1 }}>
              {/* State */}
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    {...field}
                    label="State"
                    options={
                      (getStateList as State[])?.map(
                        (state: State) => state.name
                      ) || []
                    }
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
              {/* City */}
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    {...field}
                    label="City"
                    options={
                      (getCityList as City[])?.map((city: City) => city.name) ||
                      []
                    }
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>

            {/* Work Level in a separate row */}
            <Grid container paddingRight={2} sx={{ width: "100%" }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="workLevel"
                  control={control}
                  render={({ field }) => (
                    <CustomDropdown
                      {...field}
                      label="Work Level"
                      options={["Entry Level", "Mid Level", "Senior Level"]}
                      error={!!errors.workLevel}
                      helperText={errors.workLevel?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Skills */}
          <Grid
            container
            spacing={2}
            sx={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Grid size={12}>
              <Typography>Skills Required</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mt: 1,
                }}
              >
                {(watch("skillsRequired") || [])
                  .filter((skill): skill is string => skill !== undefined)
                  .map((skill: string, index: number) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                    />
                  ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Type a skill"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSkill(inputValue);
                    }
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      border: "1px solid #D1D9E9",
                      borderRadius: "4px",
                      height: "32px",
                      fontSize: "14px",
                      padding: "0 12px",
                      "&:hover": {
                        borderColor: "1px solid #D1D9E9",
                      },
                      "&.Mui-focused": {
                        borderColor: "1px solid #D1D9E9",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
                <AppIconButton
                  title="ADD SKILL"
                  type="button"
                  sx={{
                    color: "black",
                    textTransform: "none",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    ":hover": { backgroundColor: "white" },
                  }}
                  onClick={() => handleAddSkill(inputValue)}
                >
                  Add Skill
                </AppIconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Description */}
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Typography>Description</Typography>

            <Grid
              size={12}
              spacing={2}
              sx={{
                display: "flex",
                borderRadius: "12px",
                boxShadow: "0px 0px 10px 2px rgba(156, 150, 150, 0.1)",
              }}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => {
                  return (
                    <Grid size={12} sx={{ height: "100%", width: "100%" }}>
                      <Tiptap
                        initialContent={field.value}
                        onChange={(content) => {
                          field.onChange(content);
                        }}
                      />
                      {errors.description && (
                        <div style={{ color: "red", marginTop: "8px" }}>
                          {errors.description.message}
                        </div>
                      )}
                    </Grid>
                  );
                }}
              />
            </Grid>

            <Grid>
              {errors.description && (
                <Typography color="red">
                  {errors.description.message}
                </Typography>
              )}
            </Grid>

            {/* Qualification Setting */}
            <Grid container spacing={2}>
              <Grid size={12}>
                <Controller
                  name="qualificationFilter"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Filter out and send rejections to applicants who don't meet must-have qualifications"
                      />
                      {errors.qualificationFilter && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ display: "block", mt: 1 }}
                        >
                          {errors.qualificationFilter.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid size={12} container spacing={2}>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "end",
                }}
              >
                <AppIconButton
                  type="submit"
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    padding: "5px 4rem",
                    fontSize: "1rem",
                    color: "white",
                    bgcolor: "#475569",
                    ":hover": { bgcolor: "#334155" },
                  }}
                >
                  Next
                </AppIconButton>
              </Grid>
            </Grid>

            {/* Display Error */}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetailsForm;
