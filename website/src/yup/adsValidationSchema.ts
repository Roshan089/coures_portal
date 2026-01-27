import * as yup from "yup";

export const adsValidationSchema = yup.object().shape({
  bannerName: yup.string().required("Banner Name is required"),
  bannerCode: yup.string().required("Banner Code is required"),
  bannerDescription: yup.string().required("Description is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
  imageUrl: yup
    .string()
    .url("Invalid URL format")
    .required("Image URL is required"),
  adsLocationType: yup.string().required("Location is required"),
  redirectUrl: yup
    .string()
    .url("Invalid URL format")
    .required("Redirect URL is required"),
  embedCode: yup.string().required("Embed Code is required"),
});

export type AdsFormValues = yup.InferType<typeof adsValidationSchema>;
