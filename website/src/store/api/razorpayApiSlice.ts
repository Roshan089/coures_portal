import { RAZAORPAY_API_CONSTANT } from "@/shared/constants/api/razorpay";
import { apiSlice } from "./apiSlice";

export type TCreateOrder = {
  amount: number;
  currency: string;
};

export type TRazorpayApiResponse = {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: string;
  receipt: any;
  status: string;
};

export type TVerifySignature = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  subscriptionId: string;
  amount: string;
};

export const razorpayApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<TRazorpayApiResponse, TCreateOrder>({
      query: (body) => ({
        url: RAZAORPAY_API_CONSTANT.createOrder,
        method: "POST",
        body,
      }),
    }),
    verifySignature: builder.mutation({
      query: (body: TVerifySignature) => ({
        url: RAZAORPAY_API_CONSTANT.verifySignature,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifySignatureMutation } =
  razorpayApi;
