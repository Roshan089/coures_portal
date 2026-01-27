"use client";
import { Box, Typography } from "@mui/material";
import PricingCard from "../../../components/common/PlansComponents/PlansCardComponent";
import CustomPlanCard from "../../../components/common/PlansComponents/PlansCustomCard";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { useEffect } from "react";
import { useGetFeaturesQuery } from "@/store/api/subscriptionPlans";
import { ApplicantPlanResponse } from "@/shared/types/SubscriptionPlans";

const Plans = () => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { data: applicantPlans, isLoading } = useGetFeaturesQuery(
    "applicant"
  ) as {
    data: ApplicantPlanResponse[];
    isLoading: boolean;
  };

  useEffect(() => {
    setBreadcrumbs([{ label: "Plans" }]);
  }, [setBreadcrumbs]);

  const getFeatures = (plan: ApplicantPlanResponse): string[] => [
    `Up to ${plan.features.max_applications} job applications`,
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

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4, md: 2 },
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1000px" }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="body2"
            sx={{ color: "#6B7280", fontSize: "14px", mb: 1 }}
          >
            Billing
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "24px", md: "30px" },
              fontWeight: 500,
              color: "#111827",
            }}
          >
            Plans & Pricing
          </Typography>
        </Box>
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
            {applicantPlans?.map((plan: ApplicantPlanResponse) => (
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
  );
};

export default Plans;
