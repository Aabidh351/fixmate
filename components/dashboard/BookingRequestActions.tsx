
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Props = {
  bookingId: string;
};

export default function BookingRequestActions({ bookingId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: "accepted" | "rejected") => {
    setLoading(true);

    try {
      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update booking.");
      }

      toast.success(`Booking ${status} successfully.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        onClick={() => updateStatus("accepted")}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        Accept
      </button>

      <button
        onClick={() => updateStatus("rejected")}
        disabled={loading}
        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
