"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useGetFeaturesQuery } from "@/store/api/subscriptionPlans";
import PricingCard from "@/components/company/BillingAndLicense/CompanyPlansComponents/CompanyPlansCardComponent";
import CustomPlanCard from "@/components/company/BillingAndLicense/CompanyPlansComponents/CompanyPlansCustomCard";
import { CompanyPlanResponse } from "@/shared/types/SubscriptionPlans";
import { formatDate } from "@/utils/date";

export default function DurationPlans() {
  const { data: subscriptionPlans, isLoading } = useGetFeaturesQuery(
    "agency"
  ) as {
    data: CompanyPlanResponse[] | undefined;
    isLoading: boolean;
  };

  console.log("subscriptionPlans", subscriptionPlans);

  const getFeatures = (plan: CompanyPlanResponse): string[] => [
    `Up to ${
      plan.features.max_jobs === "unlimited"
        ? "unlimited"
        : plan.features.max_jobs
    } jobs`,
    `Up to ${plan.features.max_users} users`,
  ];

  const getPlanColor = (planName: string): string => {
    switch (planName.toLowerCase()) {
      case "basic":
        return "#49A0E8";
      case "pro":
        return "#8B7EFF";
      case "enterprise":
        return "#FFBA60";
      default:
        return "#49A0E8";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
          <Stack direction="row" gap={2}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1E293B",
                  width: "100px",
                  fontWeight: 1000,
                }}
              >
                Plan Type:
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#1E293B", fontWeight: 1000 }}
              >
                {subscriptionPlans?.[0]?.billingCycle}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ color: "#64748B", width: "140px" }}>
                Bundle Start date-
              </Typography>
              <Typography sx={{ color: "#64748B" }}>
                {formatDate(subscriptionPlans?.[0]?.bundleStartDate || "")}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ width: "100%", maxWidth: "1000px" }}>
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
                {subscriptionPlans?.map((plan: CompanyPlanResponse) => (
                  <PricingCard
                    key={plan.id}
                    subscriptionId={plan.id}
                    title={plan.bundleName}
                    price={plan.features.price}
                    billingCycle={plan.billingCycle}
                    features={getFeatures(plan)}
                    buttonText="Get Started"
                    colour={getPlanColor(plan.bundleName)}
                    isLoading={isLoading}
                    onSelectPlan={() => {
                      console.log("Selected plan:", plan);
                    }}
                  />
                ))}
              </Box>
              <CustomPlanCard />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
