import {
  SubscriptionPlan,
  CompanyPlanResponse,
  ApplicantPlanResponse,
  RecruitmentAgencyPlanResponse,
} from "@/shared/types/SubscriptionPlans";
import { SUBSCRIPTION_PLANS_API_CONSTANT } from "@/shared/constants/api/SubscriptionPlans";
import { apiSlice } from "./apiSlice";

type PlanResponseType =
  | CompanyPlanResponse
  | ApplicantPlanResponse
  | RecruitmentAgencyPlanResponse;

export const subscriptionPlansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postSubscriptionPlans: builder.mutation<void, SubscriptionPlan>({
      query: (formData) => ({
        url: `${SUBSCRIPTION_PLANS_API_CONSTANT.postSubscriptionPlans}`,
        method: "POST",
        body: formData,
      }),
    }),
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => ({
        url: `${SUBSCRIPTION_PLANS_API_CONSTANT.getSubscriptionPlans}`,
        method: "GET",
      }),
    }),
    getSubscriptionPlanById: builder.query<SubscriptionPlan, string>({
      query: (bundleId) => ({
        url: `${SUBSCRIPTION_PLANS_API_CONSTANT.getSubscriptionPlanById(
          bundleId
        )}`,
        method: "GET",
      }),
    }),
    getFeatures: builder.query<PlanResponseType[], string>({
      query: (userType) => ({
        url: `${SUBSCRIPTION_PLANS_API_CONSTANT.getFeatures(userType)}`,
        method: "GET",
      }),
    }),
    putSubscriptionPlans: builder.mutation({
      query: ({ bundleId, updatedData }) => ({
        url: `${SUBSCRIPTION_PLANS_API_CONSTANT.putSubscriptionPlans(
          bundleId
        )}`,
        method: "PATCH",
        body: updatedData,
      }),
    }),
    deleteSubscriptionPlans: builder.mutation({
      query: ({ bundleId }) => ({
        url: `${SUBSCRIPTION_PLANS_API_CONSTANT.deleteSubscriptionPlans(
          bundleId
        )}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  usePostSubscriptionPlansMutation,
  useGetSubscriptionPlansQuery,
  useGetFeaturesQuery,
  usePutSubscriptionPlansMutation,
  useDeleteSubscriptionPlansMutation,
  useGetSubscriptionPlanByIdQuery,
} = subscriptionPlansApiSlice;
