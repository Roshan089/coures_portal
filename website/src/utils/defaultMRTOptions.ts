import { type MRT_RowData, type MRT_TableOptions } from "material-react-table";

export const getDefaultMRTOptions = <TData extends MRT_RowData>(): Partial<
  MRT_TableOptions<TData>
> => ({
  enableGlobalFilter: false,
  enableRowPinning: false,
  initialState: { showColumnFilters: false },
  manualFiltering: false,
  manualPagination: false,
  manualSorting: false,
  enableColumnActions: false,
  enableColumnFilters: false,
  enableDensityToggle: false,
  enableSorting: false,
  enablePagination: false,
  muiTableHeadRowProps: {
    sx: {
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "rgba(0, 175, 240, 0.1)", // Light blue header background
      color: "#333", // Darker font color
      textAlign: "center",
      alignContent: "center",
      alignItems: "center",
      padding: "10px",
      border: "1px solid #ddd", // Border between header cells
    },
  },
  muiTableHeadCellProps: {
    sx: {
      fontSize: "1rem",
      fontWeight: "bold",
      textAlign: "center", // Ensures text is centered
      justifyContent: "center", // Centers content horizontally
      alignItems: "center", // Centers content vertically
      padding: "10px",
      marginX: "auto",
    },
  },
  muiTableBodyCellProps: {
    sx: {
      fontSize: "0.95rem",
      color: "#555", // Slightly lighter font color
      textAlign: "center",
      padding: "10px",
      border: "1px solid #ddd", // Border for cells
    },
  },
  muiTableContainerProps: {
    sx: {
      overflow: "auto",
      backgroundColor: "#fff", // White background for the table container
      borderRadius: "8px",
    },
  },
  muiTableBodyRowProps: {
    sx: {
      "&:nth-of-type(odd)": {
        backgroundColor: "#f9f9f9", // Alternating row background color
      },
      "&:nth-of-type(even)": {
        backgroundColor: "#ffffff", // Default background for even rows
      },
      "&:hover": {
        backgroundColor: "#e3f2fd", // Hover effect for rows
      },
    },
  },
  muiTablePaperProps: {
    sx: {
      //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for the table
      borderRadius: "8px",
    },
  },
  defaultColumn: {
    // muiTableHeadCellProps: {
    //   sx: {
    //     textAlign: "center",
    //   },
    // },
    muiTableBodyCellProps: {
      sx: { textAlign: "left" },
    },
  },
});
