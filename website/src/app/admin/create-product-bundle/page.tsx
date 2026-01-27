"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, IconButton, TextField, Typography, styled } from "@mui/material";

import { DurationPlans } from "@/components/Admin/ProductBundle/DurationPlans";
import { PricingForm } from "@/components/Admin/ProductBundle/PricingForm";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import { ADMIN_ROUTES } from "@/shared/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateBundleDetails } from "@/components/Admin/ProductBundle/CreateBundleDetails";
const StepButton = styled(Box)<{ active?: boolean }>(({ active }) => ({
  flex: 1,
  padding: "12px 24px",
  backgroundColor: active ? "white" : "transparent",
  color: active ? "#1E293B" : "white",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontWeight: 500,
  textAlign: "center",
}));

const FormContainer = styled(Box)({
  width: "100%",
  padding: "24px",
});

export const FormSection = styled(Box)({
  marginBottom: "32px",
});

export const InputLabel = styled(Typography)({
  color: "#64748B",
  marginBottom: "8px",
  fontSize: "1rem",
});

export const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
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
});

interface CreateBundleFormProps {
  onClose: () => void;
}

export function CreateBundleForm({ onClose }: CreateBundleFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<
    "create" | "pricing" | "duration"
  >("create");

  const handleNext = () => {
    if (activeStep === "create") setActiveStep("pricing");
    else if (activeStep === "pricing") setActiveStep("duration");
  };

  const handleBack = () => {
    if (activeStep === "pricing") setActiveStep("create");
    else if (activeStep === "duration") setActiveStep("pricing");
  };
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Licensing",
        onClick: () => router.push(ADMIN_ROUTES.LICENSING),
      },
      { label: "Product Bundle Creation" },
    ]);
  }, [setBreadcrumbs, router]);
  const renderStepContent = () => {
    switch (activeStep) {
      case "create":
        return <CreateBundleDetails onNext={handleNext} />;
      case "pricing":
        return <PricingForm onBack={handleBack} onNext={handleNext} />;
      case "duration":
        return <DurationPlans />;
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#64748B",
            "&:hover": {
              bgcolor: "rgba(100, 116, 139, 0.1)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: "#1E293B" }}>
          Product Bundle Creation
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          bgcolor: "#536485",
          p: 1,
          borderRadius: "12px",
          width: "100%",
        }}
      >
        <StepButton
          active={activeStep === "create"}
          onClick={() => setActiveStep("create")}
        >
          Create Bundle
        </StepButton>
        <StepButton
          active={activeStep === "pricing"}
          onClick={() => setActiveStep("pricing")}
        >
          Pricing
        </StepButton>
        <StepButton
          active={activeStep === "duration"}
          onClick={() => setActiveStep("duration")}
        >
          Duration
        </StepButton>
      </Box>

      {renderStepContent()}
    </FormContainer>
  );
}

export default CreateBundleForm;
