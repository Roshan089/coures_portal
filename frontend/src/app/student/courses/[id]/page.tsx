"use client";

import { useState, useEffect } from "react";
import { useGetCourseQuery } from "@/store/api/courseApiSlice";
import { useGetVideosByCourseQuery } from "@/store/api/courseApiSlice";
import { useCreateOrderMutation, useVerifyPaymentMutation } from "@/store/api/paymentApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function StudentCourseDetailPage() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAppSelector((s) => s.auth.currentUser?.user);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [accessDenialMessage, setAccessDenialMessage] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'emi'>('full');

  const { data: course, isLoading, isError, error } = useGetCourseQuery(id!, { skip: !id || !isAuthenticated });
  const { 
    data: videos = [], 
    isLoading: videosLoading, 
    error: videosError 
  } = useGetVideosByCourseQuery(id!, {
    skip: !id || !isAuthenticated || !course?.isPublished,
  });

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const coursePrice = course?.price ? parseFloat(course.price) : 0;
  const isPaidCourse = coursePrice > 0;
  

  useEffect(() => {
    if (course) {
      if (!isPaidCourse) {
        setHasAccess(true);
        setAccessDenialMessage(null);
      } else {
        if (videosError) {
          const err = videosError as { status?: number; data?: { statusCode?: number; message?: string } };
          if (err?.status === 403 || err?.data?.statusCode === 403) {
            setHasAccess(false);
            setAccessDenialMessage(err?.data?.message ?? null);
          }
        } else if (!videosLoading && videos.length >= 0) {
          setHasAccess(true);
          setAccessDenialMessage(null);
        }
      }
    }
  }, [course, isPaidCourse, videos, videosError, videosLoading]);

  useEffect(() => {
    if (course && isPaidCourse && hasAccess === null) {
      const checkAccess = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/course/${id}/videos`,
            {
              headers: {
                Authorization: localStorage.getItem("currentUser")
                  ? JSON.parse(localStorage.getItem("currentUser")!).accessToken
                  : "",
              },
            }
          );
          if (response.status === 403) {
            setHasAccess(false);
            try {
              const body = await response.json();
              setAccessDenialMessage(body?.message ?? null);
            } catch {
              setAccessDenialMessage(null);
            }
          } else if (response.ok) {
            setHasAccess(true);
            setAccessDenialMessage(null);
          }
        } catch {
          setHasAccess(false);
        }
      };
      const timer = setTimeout(checkAccess, 500);
      return () => clearTimeout(timer);
    }
  }, [course, isPaidCourse, hasAccess, id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Reset payment method when course changes
    setPaymentMethod('full');
  }, [course?.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadRazorpayScript();
    }
  }, []);

  const handlePurchase = async () => {
    if (!id || !course) return;

    setProcessingPayment(true);
    try {
      const orderData = await createOrder({ 
        courseId: id,
        useEmi: paymentMethod === 'emi' && course.emiAllowed ? true : undefined,
      }).unwrap();

      const isEmi = paymentMethod === 'emi' && course.emiAllowed && course.emiCount;
      const description = isEmi 
        ? `Purchase: ${course.title} (EMI - First Installment of ${course.emiCount})`
        : `Purchase: ${course.title}`;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Course Portal",
        description: description,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }).unwrap();

            toast.success("Payment successful! Course access granted.");
            setHasAccess(true);
            setTimeout(() => {
              router.refresh();
            }, 1000);
          } catch (error: any) {
            toast.error(error?.data?.message || "Payment verification failed");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.email?.split("@")[0] || "Student",
          email: user?.email || "student@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#242D3D",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setProcessingPayment(false);
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create order");
      setProcessingPayment(false);
    }
  };

  if (!isAuthenticated || (user?.role && user.role !== "student")) {
    if (typeof window !== "undefined") router.replace("/auth/login");
    return null;
  }

  if (!id) {
    router.replace("/student/courses");
    return null;
  }

  if (isLoading || !course) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading course…</p>
      </div>
    );
  }

  if (isError) {
    const errorStatus = (error as any)?.status;
    if (errorStatus === 403) {
      return (
        <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
          <p className="text-red-600">You don't have access to this course. Please purchase it first.</p>
          <Link href="/student/courses" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
            Back to Courses
          </Link>
        </div>
      );
    }
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
        <p className="text-red-600">Course not found.</p>
        <Link href="/student/courses" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course.isPublished) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
        <p className="text-gray-600">This course is not available yet.</p>
        <Link href="/student/courses" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-6">
        <Link href="/student/courses" className="text-sm font-medium text-[#242D3D] hover:underline">
          ← Back to Courses
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              {course.teacher && (
                <p className="mt-2 text-sm text-gray-500">by {course.teacher.name}</p>
              )}
              {course.description && (
                <p className="mt-4 text-gray-600 whitespace-pre-wrap">{course.description}</p>
              )}
            </div>
            {(isPaidCourse || course?.price) && (
              <div className="ml-6 text-right">
                {isPaidCourse ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900">₹{coursePrice.toFixed(2)}</div>
                    {course.emiAllowed && course.emiCount && (
                      <div className="text-xs text-gray-500 mt-1">
                        EMI: {course.emiCount} installments
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-lg font-semibold text-green-600">Free</div>
                )}
              </div>
            )}
          </div>

          {mounted && isPaidCourse ? (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {hasAccess === true ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ You have access to this course
                </span>
              ) : hasAccess === false ? (
                <>
                  {accessDenialMessage && (accessDenialMessage.includes("suspended") || accessDenialMessage.includes("revoked")) ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                      <p className="text-sm font-medium">Access restricted</p>
                      <p className="mt-1 text-sm">{accessDenialMessage}</p>
                      <p className="mt-2 text-xs text-amber-700">
                        If you have overdue EMI payments, pay them from <Link href="/student/emis" className="underline font-medium">EMI Payments</Link> to restore access.
                      </p>
                    </div>
                  ) : (
                    <>
                  <p className="text-sm text-gray-600 mb-4">
                    Purchase this course to access all videos and content.
                  </p>
                  
                  {course.emiAllowed && course.emiCount ? (
                    <div className="mb-4 space-y-3">
                      <p className="text-sm font-medium text-gray-700">Choose payment method:</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setPaymentMethod('full')}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                            paymentMethod === 'full'
                              ? 'border-[#242D3D] bg-[#242D3D] text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-medium">Full Payment</div>
                          <div className="text-sm opacity-90">₹{coursePrice.toFixed(2)}</div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('emi')}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                            paymentMethod === 'emi'
                              ? 'border-[#242D3D] bg-[#242D3D] text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-medium">EMI</div>
                          <div className="text-sm opacity-90">
                            {course.emiCount} × ₹{(coursePrice / course.emiCount).toFixed(2)}
                          </div>
                        </button>
                      </div>
                      {paymentMethod === 'emi' && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <strong>EMI Plan:</strong> Pay ₹{(coursePrice / course.emiCount).toFixed(2)} per month for {course.emiCount} months
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <button
                    onClick={handlePurchase}
                    disabled={processingPayment}
                    className="w-full px-6 py-3 bg-[#242D3D] text-white font-medium rounded-lg hover:bg-[#1a222c] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingPayment 
                      ? "Processing..." 
                      : paymentMethod === 'emi' && course.emiAllowed && course.emiCount
                        ? `Pay ₹${(coursePrice / course.emiCount).toFixed(2)}/month × ${course.emiCount} months`
                        : `Buy Now - ₹${coursePrice.toFixed(2)}`
                    }
                  </button>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">Checking access...</p>
              )}
            </div>
          ) : mounted && (course?.price === "0" || coursePrice === 0) ? (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Free Course
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Videos / links (read-only) */}
      {mounted && (!isPaidCourse || hasAccess === true) && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Videos & links</h2>
          {videosLoading && <p className="text-gray-500 text-sm">Loading…</p>}
          {!videosLoading && videos.length === 0 && (
            <p className="text-gray-500 text-sm">No videos or links in this course yet.</p>
          )}
          {!videosLoading && videos.length > 0 && (
            <ul className="space-y-3">
              {videos.map((video, index) => (
                <li key={video.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-[#242D3D]/20 transition-colors">
                  <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                  <h3 className="font-medium text-gray-900 mt-0.5">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                  )}
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] transition-colors"
                  >
                    Open link →
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

    </div>
  );
}
