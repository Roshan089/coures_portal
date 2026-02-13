"use client";

import { useState, useEffect } from "react";
import { useCreateOrderMutation, useVerifyPaymentMutation } from "@/store/api/paymentApiSlice";
import { useGetCoursesQuery } from "@/store/api/courseApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function TestPaymentPage() {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { data: courses = [] } = useGetCoursesQuery(undefined, { skip: !isAuthenticated });
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.replace("/auth/login");
    return null;
  }

  const handlePayment = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    setLoading(true);
    try {
      const orderData = await createOrder({ courseId: selectedCourseId }).unwrap();
      
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Course Portal",
        description: "Course Purchase",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }).unwrap();
            
            toast.success("Payment successful! Course access granted.");
            setTimeout(() => {
              router.push(`/student/courses/${selectedCourseId}`);
            }, 2000);
          } catch (error: any) {
            toast.error(error?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setLoading(false);
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create order");
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadRazorpayScript();
    }
  }, []);

  const paidCourses = courses.filter((c) => parseFloat(c.price || "0") > 0);

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Payment</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course to Purchase
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">-- Select a course --</option>
            {paidCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} - ₹{parseFloat(course.price || "0").toFixed(2)}
              </option>
            ))}
          </select>
          {paidCourses.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              No paid courses available. Create a course with price &gt; 0 first.
            </p>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={!selectedCourseId || loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Test Card Details:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✅ Success: <code className="bg-blue-100 px-1 rounded">4111 1111 1111 1111</code></li>
            <li>❌ Failure: <code className="bg-blue-100 px-1 rounded">4000 0000 0000 0002</code></li>
            <li>CVV: Any 3 digits | Expiry: Any future date | OTP: Any 6 digits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
