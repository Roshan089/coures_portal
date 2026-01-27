"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  usePostSubscriptionPlansMutation,
  usePutSubscriptionPlansMutation,
} from "@/store/api/subscriptionPlans";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_ROUTES } from "@/shared/constants";
import CustomPlanCard from "./AdminPlansComponents/AdminPlansCustomCard";
import PricingCard from "./AdminPlansComponents/AdminPlansCardComponent";
import { AppIconButton } from "@/components/common";

export function DurationPlans() {
  const subscriptionPlan = useSelector(
    (state: RootState) => state.subscriptionPlans.subscriptionPlans
  );
  const [postSubscriptionPlans] = usePostSubscriptionPlansMutation();
  const [putSubscriptionPlans] = usePutSubscriptionPlansMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bundleId = searchParams.get("id");

  const handleSave = async () => {
    try {
      if (subscriptionPlan) {
        if (bundleId) {
          await putSubscriptionPlans({
            bundleId,
            updatedData: subscriptionPlan,
          }).unwrap();
        } else {
          await postSubscriptionPlans(subscriptionPlan).unwrap();
        }
        router.push(ADMIN_ROUTES.PRODUCT_BUNDLE);
      }
    } catch (error) {
      console.error("Error saving subscription plan:", error);
    }
  };

  const planCards = subscriptionPlan?.features
    ? [
        {
          title: "Recruitment Agency",
          price: `$${subscriptionPlan.features.RecruitmentAgency.price}`,
          features: [
            `${subscriptionPlan.features.RecruitmentAgency.max_users} Users`,
            `${subscriptionPlan.features.RecruitmentAgency.max_companies} Companies`,
            `${subscriptionPlan.features.RecruitmentAgency.max_jobs} Jobs`,
          ],
          buttonText: "Get Started",
          colour: "#49A0E8",
        },
        {
          title: "Company",
          price: `$${subscriptionPlan.features.Company.price}`,
          features: [
            `${subscriptionPlan.features.Company.max_users} Users`,
            `${subscriptionPlan.features.Company.max_jobs} Jobs`,
          ],
          buttonText: "Get Started",
          colour: "#8B7EFF",
        },
        {
          title: "Applicant",
          price: `$${subscriptionPlan.features.Applicant.price}`,
          features: [
            `${subscriptionPlan.features.Applicant.max_applications} Applications`,
          ],
          buttonText: "Contact Us",
          colour: "#FFBA60",
        },
      ]
    : [];

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, color: "#1E293B" }}>
        Confirm All Details
      </Typography>
      <Box
        sx={{
          p: { xs: 2, sm: 4, md: 2 },
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#00AFF01A",
          minHeight: "100vh",
          width: "100%",
          borderRadius: "12px",
          overflowX: "hidden",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 2, color: "#1E293B" }}>
            Product Bundle Summary
          </Typography>

          <Typography sx={{ mb: 2, color: "#1E293B" }}>
            The preview below outlines the features of the Product for all
            existing customers. Please check and confirm if all the details are
            accurate to your liking.
          </Typography>
          <Stack direction="row" gap={2}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{
                  color: "#1E293B",
                  width: "100px",
                  fontWeight: 1000,
                }}
              >
                Plan Type:
              </Typography>
              <Typography sx={{ color: "#1E293B", fontWeight: 1000 }}>
                {subscriptionPlan?.billingCycle || "-"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ color: "#64748B", width: "140px" }}>
                Bundle Start date-
              </Typography>
              <Typography sx={{ color: "#64748B" }}>
                {subscriptionPlan?.bundleStartDate || "-"}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex", md: "grid" },
                  flexDirection: { xs: "column", sm: "column", md: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  width: "100%",
                  overflow: "hidden",
                  gap: 4,
                }}
              >
                {planCards.map((plan, index) => (
                  <PricingCard key={index} {...plan} />
                ))}
              </Box>
              {/* Custom Plan and Save Button Container */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <CustomPlanCard />
                <AppIconButton
                  color="primary"
                  onClick={handleSave}
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
                  Save
                </AppIconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
