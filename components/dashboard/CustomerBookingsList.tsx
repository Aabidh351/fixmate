
"use client";

import { useState } from "react";
import Link from "next/link";
import BookingCancelButton from "@/components/dashboard/BookingCancelButton";
import PayNowButton from "@/components/dashboard/PayNowButton";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category: string;
  basePrice: number;
  finalAmount: number;
  technicianName: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const filters = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

const statusStyles: Record<string, string> = {
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  "in-progress": "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export default function CustomerBookingsList({
  bookings,
}: {
  bookings: Booking[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter.value
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <h2 className="font-bold text-secondary">
            {bookings.length === 0
              ? "No bookings yet"
              : "No bookings found"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {bookings.length === 0
              ? "You haven't requested any repair services yet."
              : "There are no bookings with this status."}
          </p>

          {bookings.length === 0 && (
            <Link
              href="/services"
              className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="font-bold text-secondary">
                    {booking.serviceTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {booking.category} · Technician: {booking.technicianName}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusStyles[booking.status] ||
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {booking.status.replace("-", " ")}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-400">Preferred Date</p>
                  <p className="mt-1 text-sm font-semibold text-secondary">
                    {new Date(booking.preferredDate).toLocaleDateString("en-US")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Base Price</p>
                  <p className="mt-1 text-sm font-semibold text-secondary">
                    ${booking.basePrice.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Payment</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-secondary">
                    {booking.paymentStatus}
                  </p>
                </div>

                {booking.status === "completed" &&
                  booking.paymentStatus === "unpaid" && (
                    <PayNowButton bookingId={booking._id} />
                  )}
              </div>

              {booking.status === "requested" && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <BookingCancelButton bookingId={booking._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
