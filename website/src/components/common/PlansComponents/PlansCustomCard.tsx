import { Box, Typography, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useCallback } from "react";

const CustomPlanCard: React.FC = () => {
  const handleContactClick = useCallback(() => {
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}`;
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
        }}
      >
        Custom
      </Typography>
      <Box
        sx={{
          background: "linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%)",
          borderRadius: "16px",
          p: 3,
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          border: "solid",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckIcon />
            <Typography>Includes features of all the above plans.</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckIcon />
            <Typography>
              Adjust the features and tone based on the plans offered and the
              target audience.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={handleContactClick}
          sx={{
            backgroundColor: "white",
            color: "#3B82F6",
            textTransform: "none",
            py: 1.5,
            px: 4,
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Contact Us
        </Button>
      </Box>
    </Box>
  );
};

export default CustomPlanCard;
