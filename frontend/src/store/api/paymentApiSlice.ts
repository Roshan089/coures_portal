import { apiSlice } from "./apiSlice";

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface CreateOrderBody {
  courseId: string;
  useEmi?: boolean;
}

export interface VerifyPaymentBody {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  emiId?: string;
  /** Razorpay order ID from pay-emi response; required when verifying 2nd+ EMI */
  razorpayOrderId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId: string;
  paymentId: string;
  courseAccessId?: string;
  emiId?: string;
  allPaid?: boolean;
}

export interface EmiRecord {
  id: string;
  orderId: string;
  installmentNumber: number;
  dueDate: string;
  amount: string;
  status: string;
  paidAt: string | null;
  order: {
    id: string;
    courseId: string;
    course: {
      id: string;
      title: string;
    };
  };
}

export interface PayEmiBody {
  emiId: string;
}

export interface PayEmiResponse {
  emiId: string;
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderBody>({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentBody>({
      query: (body) => ({
        url: "/payment/verify",
        method: "POST",
        body,
      }),
    }),
    getStudentEmis: builder.query<EmiRecord[], void>({
      query: () => ({
        url: "/payment/emis",
        method: "POST",
      }),
    }),
    payEmi: builder.mutation<PayEmiResponse, PayEmiBody>({
      query: (body) => ({
        url: "/payment/pay-emi",
        method: "POST",
        body,
      }),
    }),
    verifyEmiPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentBody>({
      query: (body) => ({
        url: "/payment/verify-emi",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useVerifyPaymentMutation,
  useGetStudentEmisQuery,
  usePayEmiMutation,
  useVerifyEmiPaymentMutation,
} = paymentApiSlice;
