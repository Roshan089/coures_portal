"use client";

import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import CompanyDashboardTable from "@/components/company/dashboard/CompanyDashboardTable";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useCallback } from "react";
import { useBreadcrumbs } from "@/hoc/useBreadcrumbs";
import FilterIcon from "@/components/common/FilterIcon";
import FilterMenu from "@/components/company/FilterMenu";

function AllJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setBreadcrumbs } = useBreadcrumbs();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortByRecent: false,
    location: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsFilterOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    setBreadcrumbs([{ label: "Job Postings" }, { label: "View job postings" }]);
  }, [setBreadcrumbs]);

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header */}
        <Typography variant="h4" fontWeight={500} sx={{ mb: 4 }}>
          All Job Posts
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <TextField
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "600px",
              bgcolor: "white",
              "& .MuiOutlinedInput-root": {
                height: "44px",
                "& fieldset": {
                  borderColor: "#E2E8F0",
                },
                "&:hover fieldset": {
                  borderColor: "#CBD5E1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#94A3B8",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box
            onClick={handleFilterClick}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              px: 2,
            }}
          >
            <FilterIcon />
          </Box>
          <FilterMenu
            isOpen={isFilterOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            onFilterChange={handleFilterChange}
          />
        </Box>

        {/* Table */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "8px",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <CompanyDashboardTable searchQuery={searchQuery} filters={filters} />
        </Box>
      </Box>
    </Box>
  );
}

export default AllJobs;
