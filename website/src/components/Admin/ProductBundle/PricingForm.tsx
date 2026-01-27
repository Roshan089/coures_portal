"use client";

import {
  Box,
  Typography,
  TextField,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { AppIconButton } from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSubscriptionPlans } from "@/store/features/subscriptionPlans/subscriptionPlans";

const InputLabel = styled(Typography)({
  color: "#64748B",
  marginBottom: "8px",
  fontSize: "1rem",
});

const StyledTextField = styled(TextField)({
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

const StyledAccordion = styled(Accordion)({
  boxShadow: "none",
  borderRadius: "12px !important",
  border: "1px solid #E2E8F0",
  marginBottom: "16px",
  "&:before": {
    display: "none",
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-content": {
    margin: "12px 0",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#64748B",
  },
});

interface PricingFormProps {
  onNext: () => void;
}

interface Features {
  RecruitmentAgency: {
    price: number;
    max_users: number;
    max_companies: number;
    max_jobs: number;
  };
  Company: {
    price: number;
    max_users: number;
    max_jobs: number;
  };
  Applicant: {
    price: number;
    max_applications: number;
  };
}

interface InputGridProps {
  type: "recruitment" | "company" | "applicants";
  formData: Features;
  onInputChange: (section: string, field: string, value: string) => void;
}

const InputGrid = ({ type, formData, onInputChange }: InputGridProps) => {
  const renderFields = () => {
    switch (type) {
      case "recruitment":
        return (
          <>
            <Box>
              <InputLabel>Price</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.RecruitmentAgency.price}
                onChange={(e) =>
                  onInputChange("RecruitmentAgency", "price", e.target.value)
                }
              />
            </Box>
            <Box>
              <InputLabel>Max Users</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.RecruitmentAgency.max_users}
                onChange={(e) =>
                  onInputChange(
                    "RecruitmentAgency",
                    "max_users",
                    e.target.value
                  )
                }
              />
            </Box>
            <Box>
              <InputLabel>Max Companies</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.RecruitmentAgency.max_companies}
                onChange={(e) =>
                  onInputChange(
                    "RecruitmentAgency",
                    "max_companies",
                    e.target.value
                  )
                }
              />
            </Box>
            <Box>
              <InputLabel>Max Jobs</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.RecruitmentAgency.max_jobs}
                onChange={(e) =>
                  onInputChange("RecruitmentAgency", "max_jobs", e.target.value)
                }
              />
            </Box>
          </>
        );
      case "company":
        return (
          <>
            <Box>
              <InputLabel>Price</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.Company.price}
                onChange={(e) =>
                  onInputChange("Company", "price", e.target.value)
                }
              />
            </Box>
            <Box>
              <InputLabel>Max Users</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.Company.max_users}
                onChange={(e) =>
                  onInputChange("Company", "max_users", e.target.value)
                }
              />
            </Box>
            <Box>
              <InputLabel>Max Jobs</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.Company.max_jobs}
                onChange={(e) =>
                  onInputChange("Company", "max_jobs", e.target.value)
                }
              />
            </Box>
          </>
        );
      case "applicants":
        return (
          <>
            <Box>
              <InputLabel>Price</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.Applicant.price}
                onChange={(e) =>
                  onInputChange("Applicant", "price", e.target.value)
                }
              />
            </Box>
            <Box>
              <InputLabel>Max Applications</InputLabel>
              <StyledTextField
                fullWidth
                size="small"
                type="number"
                value={formData.Applicant.max_applications}
                onChange={(e) =>
                  onInputChange("Applicant", "max_applications", e.target.value)
                }
              />
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 3,
        py: 2,
      }}
    >
      {renderFields()}
    </Box>
  );
};

export function PricingForm({ onNext }: PricingFormProps) {
  const dispatch = useDispatch();
  const currentPlan = useSelector(
    (state: RootState) => state.subscriptionPlans.subscriptionPlans
  );

  const [formData, setFormData] = useState<Features>({
    RecruitmentAgency: {
      price: currentPlan?.features?.RecruitmentAgency?.price ?? 100,
      max_users: currentPlan?.features?.RecruitmentAgency?.max_users ?? 5,
      max_companies:
        currentPlan?.features?.RecruitmentAgency?.max_companies ?? 10,
      max_jobs: currentPlan?.features?.RecruitmentAgency?.max_jobs ?? 20,
    },
    Company: {
      price: currentPlan?.features?.Company?.price ?? 50,
      max_users: currentPlan?.features?.Company?.max_users ?? 3,
      max_jobs: currentPlan?.features?.Company?.max_jobs ?? 5,
    },
    Applicant: {
      price: currentPlan?.features?.Applicant?.price ?? 10,
      max_applications:
        currentPlan?.features?.Applicant?.max_applications ?? 50,
    },
  });

  const [expanded, setExpanded] = useState<string | false>("recruitment");

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof Features],
        [field]: Number(value),
      },
    }));
  };

  const handleNext = () => {
    if (currentPlan) {
      dispatch(
        setSubscriptionPlans({
          ...currentPlan,
          features: formData,
        })
      );
    }
    onNext();
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <Paper sx={{ p: 4, borderRadius: "12px", width: "100%" }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 4, color: "#1E293B" }}>
            Set prices for user profiles
          </Typography>

          <StyledAccordion
            expanded={expanded === "recruitment"}
            onChange={handleAccordionChange("recruitment")}
          >
            <StyledAccordionSummary
              expandIcon={
                expanded === "recruitment" ? <RemoveIcon /> : <AddIcon />
              }
            >
              <Typography sx={{ fontWeight: 500, color: "#1E293B" }}>
                Recruitment Agency
              </Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
              <InputGrid
                type="recruitment"
                formData={formData}
                onInputChange={handleInputChange}
              />
            </AccordionDetails>
          </StyledAccordion>

          <StyledAccordion
            expanded={expanded === "company"}
            onChange={handleAccordionChange("company")}
          >
            <StyledAccordionSummary
              expandIcon={expanded === "company" ? <RemoveIcon /> : <AddIcon />}
            >
              <Typography sx={{ fontWeight: 500, color: "#1E293B" }}>
                Company
              </Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
              <InputGrid
                type="company"
                formData={formData}
                onInputChange={handleInputChange}
              />
            </AccordionDetails>
          </StyledAccordion>

          <StyledAccordion
            expanded={expanded === "applicants"}
            onChange={handleAccordionChange("applicants")}
          >
            <StyledAccordionSummary
              expandIcon={
                expanded === "applicants" ? <RemoveIcon /> : <AddIcon />
              }
            >
              <Typography sx={{ fontWeight: 500, color: "#1E293B" }}>
                Applicants
              </Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
              <InputGrid
                type="applicants"
                formData={formData}
                onInputChange={handleInputChange}
              />
            </AccordionDetails>
          </StyledAccordion>
        </Box>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <AppIconButton
          title="Next"
          color="primary"
          onClick={handleNext}
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
    </>
  );
}
