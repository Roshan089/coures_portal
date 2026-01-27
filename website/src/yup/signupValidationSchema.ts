import { UserType } from "@/shared/enum/user-type";
import * as yup from "yup";

export const signupValidationSchema = yup.object({
  emailOrPhone: yup
    .string()
    .test(
      "email-or-phone",
      "Please enter a valid email or phone number",
      (value) => {
        if (!value) return false; // Return false if value is undefined or empty
        // Check if value is a valid email or 10-digit phone number
        return (
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
          /^[0-9]{10}$/.test(value)
        );
      }
    )
    .required("Email or phone is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup
    .string()
    .oneOf(
      [UserType.hr, UserType.applicant, UserType.agency],
      "Role must be 'admin' or 'user'"
    )
    .required("Role is required"),
});

// Define the type for signup form values
export type SignupFormValues = yup.InferType<typeof signupValidationSchema>;
