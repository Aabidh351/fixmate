
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import BookingCancelButton from "@/components/dashboard/BookingCancelButton";

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

async function getBookings(): Promise<Booking[]> {
  const tokenResponse = await auth.api.getToken({
    headers: await headers(),
  });

  const token = tokenResponse?.token;

  if (!token) {
    redirect("/sign-in");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch your bookings.");
  }

  return response.json();
}

export default async function CustomerBookingsPage() {
  const bookings = await getBookings();

  const statusStyles: Record<string, string> = {
    requested: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    "in-progress": "bg-indigo-100 text-indigo-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-600",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage your repair requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-secondary">
            No bookings yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            You haven&apos;t requested any repair services yet.
          </p>
          <Link
            href="/services"
            className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
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
                    {new Date(booking.preferredDate).toLocaleDateString(
                      "en-US"
                    )}
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
