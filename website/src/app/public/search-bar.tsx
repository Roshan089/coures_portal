"use client";

import {
  Box,
  TextField,
  InputBase,
  Button,
  styled,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Custom styled search input
const SearchInput = styled(InputBase)(({ theme }) => ({
  color: "#8b96a5",
  width: "100%",
  "& .MuiInputBase-input": {
    paddingLeft: "45px",
    fontSize: "16px",
    height: "48px",
    "&::placeholder": {
      color: "#8b96a5",
      opacity: 1,
    },
  },
}));

// Custom styled select button
const SelectButton = styled(Button)(({ theme }) => ({
  color: "#8b96a5",
  textTransform: "none",
  fontSize: "16px",
  padding: "12px 20px",
  borderRadius: 0,
  justifyContent: "space-between",
  "& .MuiButton-endIcon": {
    marginLeft: "auto",
  },
}));

export function SearchBar() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Main search box with inputs */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            borderRadius: "4px",
            border: "1px solid black",
            overflow: "hidden",
            gap: 1,
            flex: 1,
          }}
        >
          {/* Search Input with Icon */}
          <Box
            sx={{
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon
              sx={{
                color: "#f4511e",
                position: "absolute",
                left: "12px",
                fontSize: "28px",
              }}
            />
            <SearchInput placeholder="Search Jobs" sx={{ ml: 1 }} />
          </Box>

          {/* Divider */}
          <Divider
            orientation="vertical"
            sx={{
              height: "30px",
              bgcolor: "rgba(255, 255, 255, 0.1)",
            }}
          />

          {/* Location Dropdown */}
          <SelectButton
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              minWidth: "140px",
            }}
          >
            Location
          </SelectButton>

          {/* Divider */}
          <Divider
            orientation="vertical"
            sx={{
              height: "30px",
              bgcolor: "rgba(255, 255, 255, 0.1)",
            }}
          />

          {/* Experience Dropdown */}
          <SelectButton
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              minWidth: "140px",
            }}
          >
            Experience
          </SelectButton>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#42588a",
              height: "48px",
              minWidth: "120px",
              textTransform: "none",
              fontSize: "16px",
              borderRadius: "4px",
              "&:hover": {
                bgcolor: "#364873",
              },
            }}
          >
            Search
          </Button>
        </Box>

        {/* Search Button */}
      </Box>
    </Box>
  );
}
