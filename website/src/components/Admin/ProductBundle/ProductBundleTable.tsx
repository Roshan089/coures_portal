"use client";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { DeleteSuccessDialog } from "./DeleteSuccessDialog";

import { AppIconButton } from "@/components/common";
import CustomPricing from "./CustomPricing";

import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/shared/constants";
import {
  useDeleteSubscriptionPlansMutation,
  useGetSubscriptionPlansQuery,
} from "@/store/api/subscriptionPlans";

interface BundleData {
  name: string;
  description: string;
  userLicense: string;
  annualDiscount: string;
  actions: string;
  id?: string;
}

const createData = (
  name: string,
  description: string,
  userLicense: string,
  annualDiscount: string
): BundleData => {
  return { name, description, userLicense, annualDiscount, actions: "" };
};

const TabButton = styled(Box)<{ active?: boolean }>(({ active }) => ({
  width: "50%",
  padding: "12px",
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: active ? "#536485" : "white",
  color: active ? "white" : "black",
  transition: "all 0.3s ease",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
  "&:last-child": {
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
}));

const TabContainer = styled(Box)({
  display: "flex",
  width: "100%",
  backgroundColor: "white",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "24px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
});

export default function ProductBundleTable() {
  const { data: subscriptionPlans, refetch } = useGetSubscriptionPlansQuery();
  const [deleteSubscriptionPlan] = useDeleteSubscriptionPlansMutation();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<BundleData | null>(null);
  const [showCustomPricing, setShowCustomPricing] = useState(false);

  // Filter and transform the subscription plans
  const filteredPlans =
    subscriptionPlans?.filter((plan) => plan.billingCycle === selectedTab) ||
    [];

  const bundleRows: BundleData[] = filteredPlans.map((plan) =>
    createData(
      plan.bundleName,
      plan.bundleDescription,
      `$${plan.features.RecruitmentAgency.price}`,
      `${plan.annualDiscount}%`
    )
  );

  const handleDeleteClick = (bundle: BundleData) => {
    // Find the subscription plan that matches this bundle
    const planToDelete = subscriptionPlans?.find(
      (plan) => plan.bundleName === bundle.name
    );
    setSelectedBundle({ ...bundle, id: planToDelete?.id }); // Add id to selected bundle
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBundle?.id) {
      try {
        await deleteSubscriptionPlan({ bundleId: selectedBundle.id });
        setDeleteDialogOpen(false);
        setSuccessDialogOpen(true);
        refetch(); // Refresh the table data
      } catch (error) {
    
        // Optionally handle error state
      }
    }
  };

  const handleClose = () => {
    setSuccessDialogOpen(false);
    setSelectedBundle(null);
  };

  const handleEditClick = (bundle: BundleData) => {
    // Find the subscription plan that matches this bundle
    const planToEdit = subscriptionPlans?.find(
      (plan) => plan.bundleName === bundle.name
    );

    if (planToEdit?.id) {

      // Make sure this route matches your Next.js pages structure
      router.push(`${ADMIN_ROUTES.CREATE_PRODUCT_BUNDLE}?id=${planToEdit.id}`);
    }
  };

  if (showCustomPricing) {
    return <CustomPricing />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          All Product Bundles
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <AppIconButton
            variant="contained"
            color="primary"
            onClick={() => setShowCustomPricing(true)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 1,
            }}
          >
            Send Custom Pricing
          </AppIconButton>
          <AppIconButton
            variant="contained"
            color="primary"
            onClick={() => router.push(ADMIN_ROUTES.CREATE_PRODUCT_BUNDLE)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 1,
            }}
          >
            Create Bundle
          </AppIconButton>
        </Box>
      </Box>

      <TabContainer>
        <TabButton
          active={selectedTab === "monthly"}
          onClick={() => setSelectedTab("monthly")}
        >
          Monthly
        </TabButton>
        <TabButton
          active={selectedTab === "yearly"}
          onClick={() => setSelectedTab("yearly")}
        >
          Annually
        </TabButton>
      </TabContainer>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#00AFF01A" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: "40%" }}>
                Bundle Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: "20%" }}>
                User License
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: "20%" }}>
                Annual Discount
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: "20%" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bundleRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div>
                    <div style={{ fontWeight: 500 }}>{row.name}</div>
                    <div style={{ color: "#64748B", fontSize: "0.875rem" }}>
                      {row.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">{row.userLicense}</TableCell>
                <TableCell align="center">{row.annualDiscount}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      sx={{ color: "#64748B" }}
                      onClick={() => handleEditClick(row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "#EF4444" }}
                      onClick={() => handleDeleteClick(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        bundleName={selectedBundle?.name}
      />

      <DeleteSuccessDialog
        open={successDialogOpen}
        onClose={handleClose}
        bundleName={selectedBundle?.name}
      />
    </>
  );
}
