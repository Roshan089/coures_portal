"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetStudentEmisQuery, usePayEmiMutation, useVerifyEmiPaymentMutation } from "@/store/api/paymentApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { EmiRecord } from "@/store/api/paymentApiSlice";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusColor(status: string, dueDate: string) {
  if (status === "paid") return "bg-green-100 text-green-800";
  if (status === "overdue") return "bg-red-100 text-red-800";
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (due < today) return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

function getStatusText(status: string, dueDate: string) {
  if (status === "paid") return "Paid";
  if (status === "overdue") return "Overdue";
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (due < today) return "Overdue";
  return "Pending";
}

export default function StudentEmiCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string | undefined;
  const isAuthenticated = useIsAuthenticated();
  const { data: emis = [], isLoading, refetch } = useGetStudentEmisQuery(undefined, {
    skip: !isAuthenticated || !courseId,
  });
  const [payEmi] = usePayEmiMutation();
  const [verifyEmiPayment] = useVerifyEmiPaymentMutation();
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const courseEmis = courseId
    ? emis.filter((e) => e.order?.course?.id === courseId)
    : [];
  const courseTitle = courseEmis[0]?.order?.course?.title ?? "Course";
  const pendingEmis = courseEmis.filter((e) => e.status !== "paid");
  const paidEmis = courseEmis.filter((e) => e.status === "paid").sort(
    (a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime()
  );
  const sortedPending = [...pendingEmis].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  const handlePayEmi = async (emi: EmiRecord) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }
    setProcessingPayment(emi.id);
    try {
      const orderData = await payEmi({ emiId: emi.id }).unwrap();
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Course Portal",
        description: `EMI Installment ${emi.installmentNumber} - ${emi.order.course.title}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await verifyEmiPayment({
              orderId: orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              emiId: emi.id,
              razorpayOrderId: orderData.razorpayOrderId,
            }).unwrap();
            toast.success(`Installment ${emi.installmentNumber} paid successfully!`);
            setProcessingPayment(null);
            refetch();
          } catch (error: any) {
            toast.error(error?.data?.message || "Payment verification failed");
            setProcessingPayment(null);
          }
        },
        theme: { color: "#242D3D" },
        modal: {
          ondismiss: function () {
            setProcessingPayment(null);
            toast.info("Payment cancelled");
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setProcessingPayment(null);
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create payment order");
      setProcessingPayment(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/student/emis" className="text-sm font-medium text-[#242D3D] hover:underline">
          ← Back to EMI Payments
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{courseTitle}</h1>
        <p className="mt-1 text-gray-600">
          All installments for this course — pending and paid
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            <strong className="text-gray-900">{paidEmis.length}</strong> paid
          </span>
          <span>
            <strong className="text-gray-900">{pendingEmis.length}</strong> pending
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : courseEmis.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center">
          <p className="text-gray-600">No EMI installments found for this course.</p>
          <Link
            href="/student/emis"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] transition-colors"
          >
            Back to EMI Payments
          </Link>
        </div>
      ) : (
        <>
          {sortedPending.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending — Pay Now</h2>
              <div className="space-y-4">
                {sortedPending.map((emi) => (
                  <div
                    key={emi.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium text-gray-900">Installment {emi.installmentNumber}</span>
                          <span>Due: {formatDate(String(emi.dueDate))}</span>
                          <span className="font-semibold text-gray-900">₹{parseFloat(emi.amount).toFixed(2)}</span>
                        </div>
                        <span
                          className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            emi.status,
                            String(emi.dueDate),
                          )}`}
                        >
                          {getStatusText(emi.status, String(emi.dueDate))}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePayEmi(emi)}
                        disabled={processingPayment === emi.id}
                        className="px-6 py-2.5 bg-[#242D3D] text-white font-medium rounded-lg hover:bg-[#1a222c] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {processingPayment === emi.id ? "Processing..." : `Pay ₹${parseFloat(emi.amount).toFixed(2)}`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Paid Installments</h2>
            {paidEmis.length === 0 ? (
              <p className="text-gray-500 text-sm">No paid installments yet.</p>
            ) : (
              <div className="space-y-4">
                {paidEmis.map((emi) => (
                  <div
                    key={emi.id}
                    className="rounded-xl border border-gray-200 bg-gray-50/50 p-6"
                  >
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Installment {emi.installmentNumber}</span>
                      <span>Paid: {emi.paidAt ? formatDate(String(emi.paidAt)) : "N/A"}</span>
                      <span className="font-semibold text-gray-900">₹{parseFloat(emi.amount).toFixed(2)}</span>
                    </div>
                    <span className="inline-flex mt-3 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
