// Import necessary modules
import { APPLICANT_PROFILE_API_CONSTANT } from "@/shared/constants/api/ApplicantProfile";
import { apiSlice } from "./apiSlice";
import { ApplicantProfileState } from "@/shared/types/ApplicantProfileState";
import { updateApplicantProfileState } from "@/shared/types/updateApplicantProfileState";

type TUpdateApplication = {
  applicantId: string;
  updateData: updateApplicantProfileState;
};

// Inject endpoints into the existing apiSlice
export const applicantProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitApplicantProfile: builder.mutation({
      query: (formData: ApplicantProfileState) => ({
        url: `${APPLICANT_PROFILE_API_CONSTANT.profile}`,
        method: "POST",
        body: formData,
      }),
    }),
    getApplicantExperience: builder.query({
      query: (applicantId) => ({
        url: `${APPLICANT_PROFILE_API_CONSTANT.getIndividualApplicant(
          applicantId
        )}`, // Use the applicant experience endpoint
        method: "GET",
      }),
    }),
    updateApplicantProfile: builder.mutation<any, TUpdateApplication>({
      query: (builder) => {
        console.log("builder data ", builder.applicantId);
        return {
          url: APPLICANT_PROFILE_API_CONSTANT.updatedApplicantProfile(
            builder.applicantId
          ),
          method: "PATCH",
          body: builder.updateData,
        };
      },
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useSubmitApplicantProfileMutation,
  useGetApplicantExperienceQuery,
  useUpdateApplicantProfileMutation,
} = applicantProfileApiSlice;

export default applicantProfileApiSlice;
