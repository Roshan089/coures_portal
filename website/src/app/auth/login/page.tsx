"use client";

import img from "@/assets/login/login.webp";
import InputField from "@/components/common/AppInput/AppInput";
import { useIncompleteRedirect } from "@/hooks/useIncompleteRedirect";
import { useLoginMutation } from "@/store/api/authApiSlice";
import { loginSuccess } from "@/store/features/auth/authSlice";
import {
  LoginFormValues,
  loginValidationSchema,
} from "@/yup/loginValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Correct import
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false); // State to handle loading
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const dispatch = useDispatch();
  const router = useRouter();
  const redirectToIncomplete = useIncompleteRedirect(); // Call the hook and get the redirect function

  const [login] = useLoginMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(""); // Reset error message
 
    const email = data.email;
    const password = data.password;

    try {
      const response = await login({ email, password }).unwrap();

      console.log("login response", response);
      if (Object.keys(response.user.userType).length == 0) {
        redirectToIncomplete(response.user.type);
      } else {
        dispatch(
          loginSuccess({
            currentUser: response,
            isAuthenticated: true,
          })
        );
        console.log("login success");
        router.push("/");
      }
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const signup = () => {
    router.push("/auth/signup");
  };

  return (
    <Grid sx={{ height: "100%" }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left Section */}
        <Grid
          sx={{
            height: "100%",
            flex: 1,
            display: { xs: "none", sm: "flex", md: "flex", lg: "flex" },
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#f4f4f4",
            position: "relative", // Required for next/image with layout="fill"
            overflow: "hidden", // Ensures the image does not overflow the grid
            border: "solid red",
            "@media (max-width: 720px)": {
              display: "none", // Hide on screens less than 720px
            },
          }}
        >
          <Image
            src={img}
            alt="Login illustration"
            layout="fill" // Ensures the image fills the parent
            objectFit="cover" // Ensures the image scales properly to cover the container
          />
        </Grid>

        {/* Right Section */}
        <Grid
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "white",
            px: { xs: "1.25rem", md: "2.5rem" },
            py: "2.5rem",
            borderRadius: "0.125rem",
            height: "100%",
            overflow: "auto",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb="1.875rem">
            Log In
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
              maxWidth: "25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email",
                },
              }}
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Password"
                  type="password"
                  error={!!errors.password} // Check if error exists
                  helperText={errors.password?.message} // Pass error message to helperText
                />
              )}
            />

            {/* Error Message */}
            {errorMessage && (
              <Typography
                color="error"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                {errorMessage}
              </Typography>
            )}

            {/* Buttons */}
            <Box textAlign="center" width="100%">
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  width: "100%",
                  height: "2.5rem",
                  mt: "2.5rem",
                  background: "#000000CC",
                  color: "white",
                  "&:hover": { backgroundColor: "#000000" },
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
              <Typography variant="body2" my="1.25rem">
                If you're not an existing user
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  width: "100%",
                  height: "2.5rem",
                  color: "black",
                  borderColor: "#000000CC",
                  "&:hover": { backgroundColor: "#00000011" },
                }}
                onClick={signup}
              >
                Sign Up
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
