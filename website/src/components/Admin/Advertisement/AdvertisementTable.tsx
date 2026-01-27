"use client";
import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { DeleteSuccessDialog } from "./DeleteSuccessDialog";
import AppIconButton from "@/components/common/AppIconButton";
import {
  useDeleteAdMutation,
  useGetAdsQuery,
} from "@/store/api/advertisementApiSlice";
import { getDefaultMRTOptions } from "@/utils/defaultMRTOptions";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";
import { ADMIN_ROUTES } from "@/shared/constants";

// Define the Advertisement type
interface Advertisement {
  id: string;
  bannerCode: string;
  bannerName: string;
  bannerDescription: string;
  duration: string;
  startDate: string;
  endDate: string;
  adsLocationType: string;
}

const AdvertisementTable: React.FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Advertisement | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const { data: allAds, isLoading } = useGetAdsQuery(null);
  const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();

  const defaultMRTOptions = getDefaultMRTOptions<Advertisement>();

  const handleEdit = (id: string) => {
    const path = ADMIN_ROUTES.AD_UPDATE(id);
    router.push(path);
  };

  const handleDeleteClick = (banner: Advertisement) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBanner) {
      try {
        await deleteAd(selectedBanner.id).unwrap();
        setDeleteDialogOpen(false);
        setSuccessDialogOpen(true);
      } catch (error) {
        console.error("Failed to delete ad:", error);
      }
    }
  };

  const handleClose = () => {
    setSuccessDialogOpen(false);
    setSelectedBanner(null);
  };

  const columns = useMemo<MRT_ColumnDef<Advertisement>[]>(
    () => [
      {
        accessorKey: "bannerCode",
        header: "Banner Name & Description",
        Cell: ({ row }) => (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {row.original.bannerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {row.original.bannerDescription}
            </Typography>
          </Box>
        ),
        size: 250,
      },
      {
        accessorKey: "adsLocationType",
        header: "Banner Position",
        size: 250,
      },
      {
        accessorKey: "duration",
        header: "Banner Duration",
        size: 150,
        Cell: ({ row }) => {
          const startDate = new Date(row.original.startDate);
          const endDate = new Date(row.original.endDate);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return <Typography>{diffDays} days</Typography>;
        },
      },
      {
        accessorKey: "startDate",
        header: "Display Start Date",
        size: 200,
        Cell: ({ row }) => (
          <Typography>{formatDate(row.original.startDate)}</Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <IconButton
              onClick={() => handleEdit(row.original.id)}
              size="small"
              sx={{ color: "primary.main" }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteClick(row.original)}
              size="small"
              sx={{ color: "error.main" }}
              disabled={isDeleting}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
        size: 150,
      },
    ],
    [isDeleting] // Include dependencies to avoid stale state issues
  );

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: allAds || [],
    enableTopToolbar: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#00AFF01A",
        fontWeight: "bold",
      },
    },
  });

  if (isCreating) {
    router.push(ADMIN_ROUTES.AD_CREATE);
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Column on small screens, row on larger screens
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2, // Adds spacing between elements on smaller screens
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            textAlign: { xs: "center", sm: "left" }, // Center text on small screens, align left on larger screens
            width: "100%",
          }}
        >
          Advertisement Banner Management
        </Typography>

        <AppIconButton
          variant="contained"
          color="white"
          onClick={() => setIsCreating(true)}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 2, // Slightly increased padding for better touch target
            py: 1,
            fontSize: { xs: "14px", sm: "16px" }, // Smaller font on mobile, larger on bigger screens
            alignSelf: { xs: "center", sm: "flex-end" }, // Center button on mobile, align right on larger screens
          }}
        >
          Create New Banner
        </AppIconButton>
      </Box>

      <Box width="100%">
        <MaterialReactTable table={table} />
      </Box>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        bannerName={selectedBanner?.bannerCode}
      />

      <DeleteSuccessDialog
        open={successDialogOpen}
        onClose={handleClose}
        bannerName={selectedBanner?.bannerCode}
      />
    </>
  );
};

export default AdvertisementTable;
