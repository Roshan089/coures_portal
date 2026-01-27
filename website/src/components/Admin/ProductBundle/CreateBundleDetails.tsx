import {
  Box,
  InputLabel,
  Paper,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { AppIconButton } from "@/components/common";

import { SubscriptionPlan } from "@/shared/types/SubscriptionPlans";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  bundleDetailsSchema,
  BundleDetailsFormValues,
} from "@/yup/bundleDetailsSchema";
import { setSubscriptionPlans } from "@/store/features/subscriptionPlans/subscriptionPlans";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useGetSubscriptionPlanByIdQuery } from "@/store/api/subscriptionPlans";
import { useEffect } from "react";

interface CreateBundleDetailsProps {
  onNext: (data: Partial<SubscriptionPlan>) => void;
}

export function CreateBundleDetails({ onNext }: CreateBundleDetailsProps) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const bundleId = searchParams.get("id");

  // Use the query to fetch bundle data if ID exists
  const { data: bundleData } = useGetSubscriptionPlanByIdQuery(bundleId ?? "", {
    skip: !bundleId, // Skip the query if there's no ID
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BundleDetailsFormValues>({
    defaultValues: bundleData || {
      bundleName: "",
      bundleDescription: "",
      bundleStartDate: "",
      billingCycle: "monthly",
      features: {
        RecruitmentAgency: {
          price: 100,
          max_users: 5,
          max_companies: 10,
          max_jobs: 20,
        },
        Company: {
          price: 50,
          max_users: 3,
          max_jobs: 5,
        },
        Applicant: {
          price: 10,
          max_applications: 50,
        },
      },
      annualDiscount: 0,
      isCustom: true,
      isActive: true,
    },
    resolver: yupResolver(bundleDetailsSchema),
    values: bundleData, // Update form when data is fetched
  });

  useEffect(() => {
    if (bundleData) {
      // Extract only the date part from the datetime string
      const formattedData = {
        ...bundleData,
        bundleStartDate: bundleData.bundleStartDate
          ? bundleData.bundleStartDate.split(" ")[0] // This will get only "2025-02-25"
          : "",
      };
      reset(formattedData);
    }
  }, [bundleData, reset]);

  const onSubmit = async (data: BundleDetailsFormValues) => {
    let payload;

    if (bundleId) {
      // If bundleId exists, it's an update operation
      payload = {
        ...data,
        id: bundleId,
        bundleStartDate: data.bundleStartDate,
        isCustom: true,
        isActive: true,
      };
    } else {
      // If no bundleId, it's a create operation - omit the id field
      payload = {
        ...data,
        bundleStartDate: data.bundleStartDate,
        isCustom: true,
        isActive: true,
      };
    }

    dispatch(setSubscriptionPlans(payload));
    onNext(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper sx={{ p: 4, borderRadius: "12px", width: "100%" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 4, color: "#1E293B" }}>
            Product Bundle Details
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Controller
              name="bundleName"
              control={control}
              render={({ field }) => (
                <Box>
                  <InputLabel sx={{ color: "#64748B", mb: 1 }}>
                    Bundle Name
                  </InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter bundle name"
                    size="small"
                    error={!!errors.bundleName}
                    helperText={errors.bundleName?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#E2E8F0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#CBD5E1",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#536485",
                        },
                      },
                    }}
                  />
                </Box>
              )}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Controller
              name="bundleDescription"
              control={control}
              render={({ field }) => (
                <Box>
                  <InputLabel sx={{ color: "#64748B", mb: 1 }}>
                    Description
                  </InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Enter description"
                    error={!!errors.bundleDescription}
                    helperText={errors.bundleDescription?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#E2E8F0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#CBD5E1",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#536485",
                        },
                      },
                    }}
                  />
                </Box>
              )}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Controller
              name="billingCycle"
              control={control}
              render={({ field }) => (
                <Box>
                  <InputLabel sx={{ color: "#64748B", mb: 1 }}>
                    Billing Cycle
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select 
                      {...field} 
                      size="small" 
                      error={!!errors.billingCycle}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "white",
                          borderRadius: "8px",
                          "& fieldset": {
                            borderColor: "#E2E8F0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#CBD5E1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#536485",
                          },
                        },
                      }}
                    >
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Controller
              name="bundleStartDate"
              control={control}
              render={({ field }) => (
                <Box>
                  <InputLabel sx={{ color: "#64748B", mb: 1 }}>
                    Bundle Start Date
                  </InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    size="small"
                    error={!!errors.bundleStartDate}
                    helperText={errors.bundleStartDate?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#E2E8F0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#CBD5E1",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#536485",
                        },
                      },
                    }}
                  />
                </Box>
              )}
            />
          </Box>
        </Box>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <AppIconButton
          title="Submit"
          type="submit"
          color="primary"
          sx={{
            textTransform: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            fontSize: "1rem",
            width: "200px",
            "&:hover": {
              backgroundColor: "#7C3AED",
            },
          }}
        >
          Next
        </AppIconButton>
      </Box>
    </form>
  );
}
