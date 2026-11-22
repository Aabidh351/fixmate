
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Props = {
  bookingId: string;
};

export default function PayNowButton({ bookingId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to start payment.");
      }

      if (!result.checkoutUrl) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Pay Now"}
    </button>
  );
}
