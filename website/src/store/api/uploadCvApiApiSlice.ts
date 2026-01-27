import { uploadCv } from "@/shared/types/uploadCv";
import { apiSlice } from "./apiSlice";
import { UPLOAD_CV_API_CONSTANT } from "@/shared/constants/api/uploadCv";

export const companyAboutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadCv: builder.mutation<unknown, uploadCv>({
      query: (formData) => ({
        url: UPLOAD_CV_API_CONSTANT.setUploadCv, // Correct POST URL
        method: "POST",
        body: formData,
      }),
    }),
    patchUploadCv: builder.mutation<
      unknown,
      { id: string; formData: uploadCv }
    >({
      query: ({ id, formData }) => ({
        url: UPLOAD_CV_API_CONSTANT.updateUploadCv.replace("{id}", id), // Replace {id} with actual ID
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const { useUploadCvMutation, usePatchUploadCvMutation } =
  companyAboutApiSlice;

export default companyAboutApiSlice;
