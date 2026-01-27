import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { AppIconButton } from "@/components";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  colour: string; // <-- Added color prop
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonText,
  colour,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "16px",
        p: { xs: "0 24px", md: 3 },
        borderColor: "grey.200",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minWidth: 0,
        height: "450px",
        justifyContent: "start-flex",
        width: "100%",
        maxWidth: { xs: "90%", sm: "70%", md: "100%" },
        gap: 2,
      }}
    >
      <Box sx={{ mb: 1, width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 500,
            fontSize: { xs: "20px", md: "18px" },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            mb: 3,
            fontWeight: 600,
            fontSize: { xs: "36px", md: "32px" },
          }}
        >
          {price}
        </Typography>
        <AppIconButton
          title={buttonText}
          type="submit"
          bgcolor={colour}
          sx={{
            textTransform: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            fontSize: "1rem",
            width: "100%",
            "&:hover": {
              backgroundColor: "#7C3AED", // Optional: Adjust hover effect
            },
          }}
        >
          {buttonText}
        </AppIconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          alignItems: "flex-start",
          px: { xs: 3, md: 2 },
          overflow: "hidden",
        }}
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            <CheckIcon
              sx={{
                color: colour, // <-- Use color for icon as well if needed
                flexShrink: 0,
                fontSize: { xs: "18px", md: "16px" },
                mt: 0.2,
              }}
            />
            <Typography
              sx={{
                textAlign: "left",
                fontSize: { xs: "14px", md: "12px" },
                color: "#4B5563",
                lineHeight: { xs: 1.4, md: 1.3 },
                flex: 1,
                wordBreak: "break-word",
              }}
            >
              {feature}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PricingCard;
