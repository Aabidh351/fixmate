
"use client";

import { useState } from "react";
import { AdminBooking } from "@/app/dashboard/admin/bookings/page";

type Props = {
  bookings: AdminBooking[];
};

const filters = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    requested: "bg-blue-100 text-blue-700",
    accepted: "bg-indigo-100 text-indigo-700",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status.replace("-", " ")}
    </span>
  );
}

export default function AdminBookingsList({ bookings }: Props) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === activeFilter
        );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Manage Bookings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor all customer service bookings across the platform.
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="font-semibold text-slate-800">
            {activeFilter === "all"
              ? "All Bookings"
              : `${filters.find((filter) => filter.value === activeFilter)?.label} Bookings`}
            {" "}({filteredBookings.length})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Technician</th>
                <th className="px-6 py-4 font-medium">Job Status</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                    {booking.serviceTitle}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {booking.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.customerEmail}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {booking.technicianName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.technicianEmail}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={booking.paymentStatus || "unpaid"} />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                    ${booking.finalAmount ?? booking.basePrice}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No bookings found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
