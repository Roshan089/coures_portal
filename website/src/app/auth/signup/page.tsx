"use client";

import img from "@/assets/login/login.webp";
import CustomDropdown from "@/components/common/AppDropdown/AppDropdown";
import InputField from "@/components/common/AppInput/AppInput";
import { useIncompleteRedirect } from "@/hooks/useIncompleteRedirect";
import { UserType } from "@/shared/enum/user-type";
import { useSignUpMutation } from "@/store/api/userApiSlice";
import { loginSuccess } from "@/store/features/auth/authSlice";
import {
  SignupFormValues,
  signupValidationSchema,
} from "@/yup/signupValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false); // State to handle loading
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [apiError, setApiError] = useState<string>(""); // State to handle API errors
  const redirectToIncomplete = useIncompleteRedirect(); // Call the hook and get the redirect function
  const [signUp] = useSignUpMutation();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<SignupFormValues>({
    defaultValues: {
      role: UserType.applicant,
    },
    resolver: yupResolver(signupValidationSchema),
    mode: "onChange", // Enable real-time validation
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setApiError(""); // Clear any previous API errors
    console.log(data);

    const { emailOrPhone, password, role } = data;
    console.log(emailOrPhone);

    try {
      const response = await signUp({
        email: emailOrPhone,
        password: password,
        type: role,
      }).unwrap();
      console.log("response", response);
      dispatch(
        loginSuccess({ currentUser: { ...response }, isAuthenticated: false })
      );

      redirectToIncomplete(role); // Use the returned function with the role

      console.log(" response from api ", response);
    } catch (error: any) {
      console.error(
        error?.data?.message || "Something went wrong. Please try again."
      );
      
      // Handle duplicate email error
      if (error?.status === 409 || error?.data?.message?.includes("already exists")) {
        setError("emailOrPhone", {
          type: "manual",
          message: "This email is already registered. Please use a different email or try logging in.",
        });
        setApiError("This email is already registered. Please use a different email or try logging in.");
      } else {
        setApiError(error?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid sx={{ height: "100vh", minHeight: "100vh" }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left Section - Hidden on mobile */}
        <Grid
          xs={0}
          md={6}
          sx={{
            height: "100%",
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#f4f4f4",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={img}
            alt="Sign Up illustration"
            layout="fill"
            objectFit="cover"
          />
        </Grid>

        {/* Right Section - Full width on mobile, half on desktop */}
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "white",
            px: { xs: "1.5rem", sm: "2rem", md: "3rem" },
            py: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            mb={{ xs: "1.5rem", md: "2rem" }}
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
              textAlign: "center",
            }}
          >
            SIGN UP
          </Typography>
          
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
              maxWidth: "28rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Email or Phone Field */}
            <Controller
              name="emailOrPhone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Email"
                  error={!!errors.emailOrPhone}
                  helperText="" // No error text below email field
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password} // Check if error exists
                  helperText={errors.password?.message} // Pass error message to helperText
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmPassword} // Check if error exists
                  helperText={errors.confirmPassword?.message} // Pass error message to helperText
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* Role Selection Field */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  options={[
                    UserType.hr,
                    UserType.applicant,
                    UserType.agency,
                  ]}
                  label="Signing up as"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                />
              )}
            />

            {/* Buttons */}
            <Box textAlign="center" width="100%">
              {/* API Error Display - Above the button */}
              {apiError && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#d32f2f",
                    fontWeight: "500",
                    textAlign: "center",
                    fontSize: { xs: "0.625rem", sm: "0.75rem" },
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 1,
                  }}
                >
                  {apiError}
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  width: "100%",
                  height: { xs: "2.75rem", sm: "3rem" },
                  mt: { xs: "1.5rem", sm: "2rem" },
                  background: "#000000CC",
                  color: "white",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: "500",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#000000" },
                  "&:disabled": {
                    backgroundColor: "#cccccc",
                    color: "#666666",
                  },
                }}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
