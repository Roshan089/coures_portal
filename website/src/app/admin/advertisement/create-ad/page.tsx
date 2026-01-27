"use client";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArrowBack } from "@mui/icons-material";
import AppIconButton from "@/components/common/AppIconButton";
import { useAppDispatch } from "@/store/hooks";
import { createAds, updateAd } from "@/store/features/ads/adsSlice";
import {
  useCreateAdMutation,
  useGetAdQuery,
  useUpdateAdMutation,
} from "@/store/api/advertisementApiSlice";
import CustomDatePicker from "@/components/common/CustomDatePicker/CustomDatePicker";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/shared/constants";
import { AdsFormValues, adsValidationSchema } from "@/yup/adsValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/common/AppInput/AppInput";
import CustomDropdown from "@/components/common/AppDropdown/AppDropdown";
import AboutTextField from "@/components/common/AppTextField/AppTextFeild";

interface CreateNewBannerFormProps {
  onClose: () => void;
}

export default function CreateNewBannerForm({}: CreateNewBannerFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdsFormValues>({
    resolver: yupResolver(adsValidationSchema),
  });

  const route = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Modify the query to ensure it runs properly
  const { data: adData, isLoading: isAdLoading } = useGetAdQuery(
    id ?? "skip", // Use null coalescing to handle empty string
    {
      skip: !id || id === "skip", // Skip only if no id or if id is 'skip'
    }
  );

  const dispatch = useAppDispatch();
  const [createAd] = useCreateAdMutation();
  const [updateAd] = useUpdateAdMutation();

  // Pre-populate form if editing
  useEffect(() => {
    if (adData) {
      setValue("bannerName", adData.bannerName);
      setValue("bannerCode", adData.bannerCode);
      setValue("bannerDescription", adData.bannerDescription);
      setValue("startDate", adData.startDate);
      setValue("endDate", adData.endDate);
      setValue("imageUrl", adData.imageUrl);
      setValue("adsLocationType", adData.adsLocationType);
      setValue("redirectUrl", adData.redirectUrl);
      setValue("embedCode", adData.embedCode);
    }
  }, [adData, setValue]);

  const onSubmit = async (data: AdsFormValues) => {
    try {
      if (id) {
        // Update existing ad
        const response = await updateAd({
          adId: id,
          updatedData: data,
        }).unwrap();
      } else {
        // Create new ad
        const response = await createAd(data).unwrap();
        dispatch(createAds(response));
      }
      route.push(ADMIN_ROUTES.ADS);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };
<h2 style={{ textAlign: "center", color: "#333" }}>🚀 Simple Form</h2>

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" fontWeight="bold">
            {id ? "Edit Banner" : "Create New Banner"}
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Controller
            name="bannerName"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Banner Name"
                error={!!errors.bannerName}
                helperText={errors.bannerName?.message}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="bannerCode"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Banner Code"
                error={!!errors.bannerCode}
                helperText={errors.bannerCode?.message}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="bannerDescription"
            control={control}
            render={({ field }) => (
              <AboutTextField
                bgcolor="#f5f5f5"
                lable="Banner Description"
                {...field} // Spread the field props (value, onChange, etc.)
                error={!!errors.bannerDescription}
                helperText={errors.bannerDescription?.message}
              />
            )}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="body1"
              mb={1}
              fontWeight={500}
              sx={{ font: "12px" }}
            >
              Banner Start Date / Time
            </Typography>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                  {...field}
                  label="Start Date"
                  value={watch("startDate")}
                  onChange={(date) => setValue("startDate", date)}
                  error={!!errors.startDate}
                  required
                />
              )}
            />
            {errors.startDate && (
              <Typography color="error">Start Date is required</Typography>
            )}
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} sx={{ height: "20px" }}>
            <Typography
              variant="body1"
              mb={1}
              fontWeight={500}
              sx={{ font: "12px" }}
            >
              Banner End Date / Time
            </Typography>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                  {...field}
                  label="End Date"
                  value={watch("endDate")}
                  onChange={(date) => setValue("endDate", date)}
                  error={!!errors.endDate}
                  required
                />
              )}
            />
            {errors.endDate && (
              <Typography color="error">End Date is required</Typography>
            )}
          </Grid>
        </Grid>

        <Box mb={2}>
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Image URL"
                error={!!errors.imageUrl}
                helperText={errors.imageUrl?.message}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="adsLocationType"
            control={control}
            render={({ field }) => (
              <CustomDropdown
                bgcolor="#f5f5f5"
                value={String(field.value) || "Select Location"}
                onChange={(value) => field.onChange(value)}
                options={["applicant", "website", "company"]}
                label="adsLocationType"
                error={!!errors.adsLocationType}
                helperText={errors.adsLocationType?.message}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="redirectUrl"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label=" Select Banner Re-Direction Link"
                placeholder="logileads.com/xycompany/job101.html"
                error={!!errors.redirectUrl}
                helperText={errors.redirectUrl?.message}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="embedCode"
            control={control}
            render={({ field }) => (
              <AboutTextField
                bgcolor="#f5f5f5"
                lable="Banner embedCode"
                {...field} // Spread the field props (value, onChange, etc.)
                error={!!errors.bannerDescription}
                helperText={errors.bannerDescription?.message}
              />
            )}
          />
        </Box>

        <Box
          display="flex"
          gap={2}
          justifyContent="flex-end"
          sx={{ flexWrap: "wrap", mt: 3 }}
        >
          <AppIconButton
            variant="outlined"
            onClick={() => route.back()}
            sx={{ textTransform: "none", px: 3, py: 1, borderRadius: "8px" }}
          >
            Cancel
          </AppIconButton>
          <AppIconButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", px: 3, py: 1, borderRadius: "8px" }}
          >
            {id ? "Update" : "Save"}
          </AppIconButton>
        </Box>
      </Box>
    </Box>
  );
}
