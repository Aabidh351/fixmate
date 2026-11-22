import { AdminBooking } from "@/app/dashboard/admin/bookings/page";

type Props = {
  bookings: AdminBooking[];
};

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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="font-semibold text-slate-800">
            All Bookings ({bookings.length})
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
              {bookings.map((booking) => (
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

              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No bookings found.
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
