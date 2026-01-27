import {
  Box,
  Checkbox,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import { useState, memo } from "react";

interface FilterState {
  sortByRecent: boolean;
  jobRole: string;
  location: string;
  date: Date | null;
  minExperience: string;
  maxExperience: string;
}

const initialFilterState: FilterState = {
  sortByRecent: false,
  jobRole: "",
  location: "",
  date: null,
  minExperience: "",
  maxExperience: "",
};

interface FilterMenuProps {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
}

const FilterMenu = memo(function FilterMenu({
  isOpen,
  anchorEl,
  onClose,
  onFilterChange,
}: FilterMenuProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters(initialFilterState);
    onFilterChange(initialFilterState);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      keepMounted
      disablePortal
      sx={{
        "& .MuiPaper-root": {
          width: "320px",
          maxWidth: "calc(100vw - 32px)",
          p: 1,
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          mt: 0.5,
        },
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
        },
      }}
    >
      <Box>
        <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleClearFilters}
            sx={{
              textTransform: "none",
              color: "#475569",
              "&:hover": {
                backgroundColor: "rgba(71, 85, 105, 0.08)",
              },
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Most Recent Filter */}
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: "1.1rem", fontWeight: 500 }}
            >
              Filter by Most recent
            </Typography>
            <Checkbox
              checked={filters.sortByRecent}
              onChange={(e) => updateFilter("sortByRecent", e.target.checked)}
            />
          </Box>
        </Box>

        {/* Job Role Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontSize: "1rem", fontWeight: 500 }}
          >
            Job role
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Logistic Manager"
            size="small"
            value={filters.jobRole}
            onChange={(e) => updateFilter("jobRole", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        {/* Experience Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontSize: "1rem", fontWeight: 500 }}
          >
            Experience Range
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Select
              fullWidth
              size="small"
              value={filters.minExperience}
              onChange={(e) => {
                const minValue = e.target.value as string;
                // Allow update if max is empty or min is less than max
                if (
                  !filters.maxExperience ||
                  parseInt(minValue) <= parseInt(filters.maxExperience)
                ) {
                  updateFilter("minExperience", minValue);
                }
              }}
              displayEmpty
              sx={{ flex: 1, borderRadius: "8px" }}
            >
              <MenuItem value="">Min</MenuItem>
              {[...Array(11)].map((_, i) => (
                <MenuItem key={i} value={i.toString()}>
                  {i} years
                </MenuItem>
              ))}
            </Select>
            <Select
              fullWidth
              size="small"
              value={filters.maxExperience}
              onChange={(e) => {
                const maxValue = e.target.value as string;
                // Allow update if min is empty or max is greater than min
                if (
                  !filters.minExperience ||
                  parseInt(maxValue) >= parseInt(filters.minExperience)
                ) {
                  updateFilter("maxExperience", maxValue);
                }
              }}
              displayEmpty
              sx={{ flex: 1, borderRadius: "8px" }}
            >
              <MenuItem value="">Max</MenuItem>
              {[...Array(16)].map((_, i) => (
                <MenuItem key={i} value={(i + 1).toString()}>
                  {i + 1} years
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Location Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontSize: "1rem", fontWeight: 500 }}
          >
            Location
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Mumbai"
            size="small"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        {/* Date Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontSize: "1rem", fontWeight: 500 }}
          >
            Filter by Date
          </Typography>
          <TextField
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
            value={filters.date ? filters.date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              updateFilter("date", date);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        {/* Apply Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              width: "100%",
              textTransform: "none",
              backgroundColor: "#475569",
              borderRadius: "8px",
              py: 1,
              "&:hover": {
                backgroundColor: "#364152",
              },
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Menu>
  );
});

export default FilterMenu;
