import React, { useEffect, useState } from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import InputField from "@/components/common/AppInput/AppInput";
import CustomDropdown from "@/components/common/AppDropdown/AppDropdown";
import AboutTextField from "@/components/common/AppTextField/AppTextFeild";
import CustomDatePicker from "@/components/common/CustomDatePicker/CustomDatePicker";
import { ProfileData } from "@/yup/applicantCreateProfilevalidation";
import {
  useGetStateListQuery,
  useGetCityListQuery,
} from "@/store/api/utilsApiSlice";
import { State } from "@/shared/types/StateType";

interface JobExperienceFormProps {
  index: number;
  control: Control<ProfileData>;
  errors: FieldErrors<ProfileData>;
}

const JobExperienceForm = ({
  index,
  control,
  errors,
}: JobExperienceFormProps) => {
  const india = "IN";
  const [selectedState, setSelectedState] = useState("");

  const { data: getStateList, isLoading } = useGetStateListQuery(india);
  const { data: getCityList } = useGetCityListQuery({
    stateCode: selectedState,
    countryCode: india,
  });

  // Watch the current position checkbox value and state selection
  const isCurrentPosition = useWatch({
    control,
    name: `experiences.${index}.isCurrentRole`,
    defaultValue: false,
  });

  const watchState = useWatch({
    control,
    name: `experiences.${index}.state`,
    defaultValue: "",
  });

  useEffect(() => {
    if (watchState) {
      // Find the state code from state name
      const stateObj = getStateList?.find((state) => state.name === watchState);
      if (stateObj) {
        setSelectedState(stateObj.isoCode);
      }
    }
  }, [watchState, getStateList]);

  return (
    <Grid sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
            name={`experiences.${index}.title`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputField
                {...field}
                label="Job Role"
                fullWidth
                error={!!errors?.experiences?.[index]?.title}
                helperText={errors?.experiences?.[index]?.title?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`experiences.${index}.employmentType`}
            control={control}
            defaultValue="Full Time"
            render={({ field }) => (
              <CustomDropdown
                {...field}
                options={["Full Time", "Part Time", "Freelancer"]}
                label="Employment Type"
                error={!!errors?.experiences?.[index]?.employmentType}
                helperText={
                  errors?.experiences?.[index]?.employmentType?.message
                }
              />
            )}
          />
        </Grid>
      </Grid>

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
            name={`experiences.${index}.company`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputField
                {...field}
                label="Company"
                fullWidth
                error={!!errors?.experiences?.[index]?.company}
                helperText={errors?.experiences?.[index]?.company?.message}
              />
            )}
          />
          <Controller
            name={`experiences.${index}.isCurrentRole`}
            control={control}
            defaultValue={false}
            render={({ field: { value, onChange, ...field } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => onChange(e.target.checked)}
                    {...field}
                  />
                }
                label="I currently work here"
              />
            )}
          />
        </Grid>

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
              name={`experiences.${index}.state`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  options={
                    getStateList?.map((state: State) => state.name) || []
                  }
                  label="State"
                  error={!!errors?.experiences?.[index]?.state}
                  helperText={errors?.experiences?.[index]?.state?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <Controller
              name={`experiences.${index}.city`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  options={getCityList?.map((city) => city.name) || []}
                  label="City"
                  error={!!errors?.experiences?.[index]?.city}
                  helperText={errors?.experiences?.[index]?.city?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>

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
            name={`experiences.${index}.startDate`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CustomDatePicker
                {...field}
                label="Start Date"
                value={field.value || ""}
                onChange={(date) => field.onChange(date)}
                error={!!errors?.experiences?.[index]?.startDate}
                required
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
  <Controller
    name={`experiences.${index}.endDate`}
    control={control}
    defaultValue=""
    render={({ field: { onChange, value, ...field } }) => {
      useEffect(() => {
        if (isCurrentPosition) {
          const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
          onChange(today);
        }
      }, [isCurrentPosition]);

      return (
        <CustomDatePicker
          {...field}
          label="End Date"
          value={value || ""}
          onChange={(date) => onChange(date)}
          error={!!errors?.experiences?.[index]?.endDate}
          required={!isCurrentPosition}
          disabled={isCurrentPosition}
        />
      );
    }}
  />
</Grid>



      </Grid>

      <Controller
        name={`experiences.${index}.description`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <AboutTextField
            {...field}
            lable="Description"
            error={!!errors?.experiences?.[index]?.description}
            helperText={errors?.experiences?.[index]?.description?.message}
          />
        )}
      />
    </Grid>
  );
};

export default JobExperienceForm;
