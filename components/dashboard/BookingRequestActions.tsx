
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type BookingRequestActionsProps = {
  bookingId: string;
  status: string;
};

export default function BookingRequestActions({
  bookingId,
  status,
}: BookingRequestActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState("");

  async function updateStatus(
    newStatus: string,
    amount?: number
  ) {
    try {
      setLoading(true);

      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        toast.error("Authentication required. Please sign in again.");
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
          body: JSON.stringify({
            status: newStatus,
            ...(amount !== undefined && { finalAmount: amount }),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update booking.");
      }

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (status === "requested") {
    return (
      <div className="flex gap-3">
        <button
          disabled={loading}
          onClick={() => updateStatus("accepted")}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          Accept
        </button>

        <button
          disabled={loading}
          onClick={() => updateStatus("rejected")}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <button
        disabled={loading}
        onClick={() => updateStatus("in-progress")}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Start Job
      </button>
    );
  }

  if (status === "in-progress") {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor={`finalAmount-${bookingId}`}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Final Amount (USD)
          </label>

          <input
            id={`finalAmount-${bookingId}`}
            type="number"
            min="0.01"
            step="0.01"
            required
            value={finalAmount}
            onChange={(e) => setFinalAmount(e.target.value)}
            placeholder="Enter final price"
            className="w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          disabled={loading || !finalAmount || Number(finalAmount) <= 0}
          onClick={() =>
            updateStatus("completed", Number(finalAmount))
          }
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          Complete Job
        </button>
      </div>
    );
  }

  return null;
}
