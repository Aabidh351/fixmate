
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Booking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: string;
  basePrice: number;
  createdAt: string;
};

async function RequestsList() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "technician") redirect("/dashboard");

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/technician/bookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load booking requests.");
  }

  const bookings: Booking[] = await response.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Booking Requests
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          View and manage service requests from your customers.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-800">
            No booking requests yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            New customer requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {booking.serviceTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Customer: {booking.customerName}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                  {booking.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Customer Email</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {booking.customerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {booking.customerPhone}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Preferred Date</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Base Price</p>
                  <p className="mt-1 font-medium text-slate-800">
                    ${booking.basePrice}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-slate-500">Service Address</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {booking.address}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-slate-500">Problem Description</p>
                  <p className="mt-1 text-slate-700">
                    {booking.problemDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TechnicianRequestsPage() {
  return (
    <Suspense fallback={<p>Loading booking requests...</p>}>
      <RequestsList />
    </Suspense>
  );
}
