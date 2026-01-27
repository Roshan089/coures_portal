"use client";
import { Typography, Button } from "@mui/material";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { getDefaultMRTOptions } from "@/utils/defaultMRTOptions";
import DownloadFormatDialog from "@/app/admin/company/company-overview/popovers/DownloadFormatDialog";

type Invoice = {
  id: string;
  invoiceDate: string;
  totalAmount: string;
  paymentMethod: string;
  status: string;
};

const data: Invoice[] = Array(8).fill({
  id: "E0800TAU12",
  invoiceDate: "8/19/2024",
  totalAmount: "$3000.00",
  paymentMethod: "Credit",
  status: "Completed",
});

export default function BillingAndLicenseTable() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"Excel" | "PDF" | null>(
    null
  );

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedFormat(null);
  };

  const handleFormatSelect = (format: "Excel" | "PDF") => {
    setSelectedFormat(format);
  };

  const handleDownload = () => {
    console.log(`Downloading in ${selectedFormat} format`);
    handleClose();
  };

  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "invoiceDate",
        header: "Invoice Date",
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <Typography
            sx={{
              color: "#6B7280",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {row.original.status}
          </Typography>
        ),
      },
      {
        accessorKey: "download",
        header: "Download",
        Cell: () => (
          <Button
            onClick={(e) => handleDownloadClick(e)}
            sx={{
              color: "#3B82F6",
              textTransform: "none",
              p: 0,
              minWidth: "auto",
              textDecoration: "underline",
              "&:hover": {
                background: "none",
              },
            }}
          >
            Download Invoice
          </Button>
        ),
      },
    ],
    []
  );

  const defaultMRTOptions = getDefaultMRTOptions<Invoice>();

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data,
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableSorting: false,
    enablePagination: false,
    initialState: {
      ...defaultMRTOptions.initialState,
      showColumnFilters: false,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <DownloadFormatDialog
        open={openDialog}
        onClose={handleClose}
        selectedFormat={selectedFormat}
        onFormatSelect={handleFormatSelect}
        onDownload={handleDownload}
      />
    </>
  );
}
