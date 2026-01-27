"use client";

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

export default function CustomPricing() {
  return (
    <Box
      sx={{
        padding: { xs: "16px", sm: "24px", md: "32px" },
        backgroundColor: "white",
        borderRadius: { xs: "8px", sm: "12px", md: "16px" },
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        width: "100%",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        Set Discounts for Individual
      </Typography>

      <Box
        component="form"
        sx={{
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box
            sx={{
              flex: { md: 2 },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Client Email ID
            </Typography>
            <TextField
              fullWidth
              placeholder="Client345@gmail.com"
              variant="outlined"
              size="medium"
            />
          </Box>

          <Box
            sx={{
              flex: { md: 1 },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Discount
            </Typography>
            <Select defaultValue="5" fullWidth size="medium">
              <MenuItem value="5">5%</MenuItem>
              <MenuItem value="10">10%</MenuItem>
              <MenuItem value="15">15%</MenuItem>
              <MenuItem value="20">20%</MenuItem>
            </Select>
          </Box>

          <Box
            sx={{
              flex: { md: 1 },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Plan
            </Typography>
            <Select defaultValue="pro" fullWidth size="medium">
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="pro">Pro</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </Select>
          </Box>

          <Box
            sx={{
              flex: { md: 1 },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Period of time
            </Typography>
            <TextField
              fullWidth
              defaultValue="1 month"
              variant="outlined"
              size="medium"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          sx={{
            width: { xs: "100%", sm: "200px" },
            backgroundColor: "#536485",
            color: "white",
            padding: { xs: "8px 16px", sm: "10px 20px", md: "12px 24px" },
            textTransform: "none",
            borderRadius: "8px",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            "&:hover": {
              backgroundColor: "#3f4b63",
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
