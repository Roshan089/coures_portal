import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { AppIconButton } from "@/components";
import {
  useCreateOrderMutation,
  useVerifySignatureMutation,
} from "@/store/api/razorpayApiSlice";
import Script from "next/script";
declare global {
  interface Window {
    Razorpay: any;
  }
}
interface PricingCardProps {
  subscriptionId: string;
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
  buttonText: string;
  colour: string; // <-- Added color prop
  isLoading?: boolean;
  onSelectPlan?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  subscriptionId,   
  title,
  price,
  billingCycle,
  features,
  buttonText,
  colour,
  isLoading,
}) => {
  const [createOrder] = useCreateOrderMutation();
  const [verifySignature] = useVerifySignatureMutation();
  
  const handleOnlinePayment = async () => {
    try {
      // Check if Razorpay key is configured
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      if (!razorpayKey) {
        console.error("Razorpay key is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY in your environment variables.");
        alert("Payment configuration error. Please contact support.");
        return;
      }

      console.log("Creating order with amount:", price);
      const response = await createOrder({
        amount: price,
        currency: "INR",
      }).unwrap();

      console.log("Order created:", response);

      const options = {
        key: razorpayKey,
        amount: response.amount || 100,
        currency: response.currency,
        name: "Dygus",
        description: `Payment for ${title} plan`,
        order_id: response.id,
        handler: async function (paymentResponse: any) {
          try {
            console.log("Payment successful:", paymentResponse);
            await verifySignature({
              razorpayOrderId: response.id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              subscriptionId: subscriptionId,
              amount: response.amount.toString(),
            });
            alert("Payment successful! Your subscription has been activated.");
          } catch (error) {
            console.error("Failed to verify payment:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User Name", // You can get this from user context
          email: "user@example.com", // You can get this from user context
        },
        theme: {
          color: "#FF853E",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled");
          },
        },
      };
      
      console.log("Initializing Razorpay with options:", options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Failed to create payment:", error);
      alert("Payment initialization failed. Please try again or contact support.");
    }
  };
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
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
          opacity: isLoading ? 0.7 : 1,
          pointerEvents: isLoading ? "none" : "auto",
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
            {price} {billingCycle === "monthly" ? "/mo" : "/yr"}
          </Typography>
          <AppIconButton
            title={buttonText}
            type="submit"
            bgcolor={colour}
            onClick={handleOnlinePayment}
            disabled={isLoading}
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
    </>
  );
};

export default PricingCard;
