
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Props = {
  sessionId?: string;
};

export default function PaymentSuccess({ sessionId }: Props) {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Please wait while we verify your payment."
  );

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!sessionId || verificationStarted.current) {
      if (!sessionId) {
        setStatus("error");
        setMessage("Payment session ID is missing.");
      }
      return;
    }

    verificationStarted.current = true;

    async function verifyPayment() {
      try {
        const { data } = await authClient.token();
        const token = data?.token;

        if (!token) {
          throw new Error("Please sign in to verify your payment.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Payment verification failed.");
        }

        setStatus("success");
        setMessage(result.message);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      }
    }

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-5 size-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Verifying Payment
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Payment Successful!
            </h1>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Payment Verification Failed
            </h1>
          </>
        )}

        <p className="mt-3 text-sm text-slate-600">{message}</p>

        {status !== "verifying" && (
          <Link
            href="/dashboard/customer/bookings"
            className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View My Bookings
          </Link>
        )}
      </div>
    </div>
  );
}
