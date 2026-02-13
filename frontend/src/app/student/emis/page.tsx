"use client";

import { useState, useEffect } from "react";
import { useGetStudentEmisQuery, usePayEmiMutation, useVerifyEmiPaymentMutation } from "@/store/api/paymentApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function StudentEmisPage() {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const { data: emis = [], isLoading, refetch } = useGetStudentEmisQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [payEmi] = usePayEmiMutation();
  const [verifyEmiPayment] = useVerifyEmiPaymentMutation();
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

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

  const handlePayEmi = async (emi: any) => {
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
        theme: {
          color: "#242D3D",
        },
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === "paid") return "bg-green-100 text-green-800";
    if (status === "overdue") return "bg-red-100 text-red-800";
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (status: string, dueDate: string) => {
    if (status === "paid") return "Paid";
    if (status === "overdue") return "Overdue";
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today) return "Overdue";
    return "Pending";
  };

  const pendingEmis = emis.filter((emi) => emi.status === "pending" || emi.status === "overdue");
  const paidEmis = emis.filter((emi) => emi.status === "paid");

  // Group by order (course) for summary cards
  const orderIds = [...new Set(emis.map((e) => e.orderId))];
  const summaryByOrder = orderIds.map((orderId) => {
    const orderEmis = emis.filter((e) => e.orderId === orderId);
    const paid = orderEmis.filter((e) => e.status === "paid");
    const pending = orderEmis.filter((e) => e.status !== "paid");
    const nextDue = pending.length > 0
      ? pending.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
      : null;
    const courseTitle = orderEmis[0]?.order?.course?.title ?? "Course";
    const totalCount = orderEmis.length;
    return {
      orderId,
      courseTitle,
      paidCount: paid.length,
      totalCount,
      remainingCount: pending.length,
      nextDue,
      pendingEmis: pending,
      paidEmis: paid,
    };
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-6">
        <Link href="/student/courses" className="text-sm font-medium text-[#242D3D] hover:underline">
          ← Back to Courses
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">EMI Payments</h1>
        <p className="mt-1 text-gray-600">View remaining installments, due dates, and pay when due</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : emis.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center">
          <p className="text-gray-600">You don't have any EMI installments.</p>
          <p className="text-sm text-gray-500 mt-1">Purchase a course with EMI to see installments here.</p>
          <Link
            href="/student/courses"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          {/* Summary by course */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">By Course</h2>
            <div className="space-y-4">
              {summaryByOrder.map((summary) => (
                <div
                  key={summary.orderId}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900">{summary.courseTitle}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-600">
                      <strong className="text-gray-900">{summary.paidCount}</strong> of {summary.totalCount} paid
                    </span>
                    <span className="text-gray-600">
                      <strong className="text-gray-900">{summary.remainingCount}</strong> remaining
                    </span>
                    {summary.nextDue && (
                      <span className="text-amber-700">
                        Next due: <strong>{formatDate(summary.nextDue.dueDate)}</strong> — ₹{parseFloat(summary.nextDue.amount).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {pendingEmis.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending — Pay Now</h2>
              <div className="space-y-4">
                {pendingEmis.map((emi) => (
                  <div
                    key={emi.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{emi.order?.course?.title ?? "Course"}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>Installment {emi.installmentNumber}</span>
                          <span>•</span>
                          <span>Due: {formatDate(String(emi.dueDate))}</span>
                          <span>•</span>
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

          {paidEmis.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paid Installments</h2>
              <div className="space-y-4">
                {paidEmis.map((emi) => (
                  <div
                    key={emi.id}
                    className="rounded-xl border border-gray-200 bg-gray-50/50 p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{emi.order?.course?.title ?? "Course"}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>Installment {emi.installmentNumber}</span>
                          <span>•</span>
                          <span>Paid: {emi.paidAt ? formatDate(String(emi.paidAt)) : "N/A"}</span>
                          <span>•</span>
                          <span className="font-semibold text-gray-900">₹{parseFloat(emi.amount).toFixed(2)}</span>
                        </div>
                        <span className="inline-flex mt-3 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
