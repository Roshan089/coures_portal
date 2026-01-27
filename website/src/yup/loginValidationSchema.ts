import * as yup from "yup";

// Define the yup validation schema for login
export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Use yup's infer method to generate the TypeScript interface from the schema
export type LoginFormValues = yup.InferType<typeof loginValidationSchema>;
