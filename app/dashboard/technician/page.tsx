
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";

type Service = {
  approvalStatus: string;
};

type Booking = {
  status: string;
};

async function TechnicianDashboard() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [servicesResponse, bookingsResponse] = await Promise.all([
    fetch(`${apiUrl}/api/technician/services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }),
    fetch(`${apiUrl}/api/technician/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }),
  ]);

  if (!servicesResponse.ok || !bookingsResponse.ok) {
  const servicesError = await servicesResponse.text();
  const bookingsError = await bookingsResponse.text();

  console.log("Services API:", servicesResponse.status, servicesError);
  console.log("Bookings API:", bookingsResponse.status, bookingsError);

  throw new Error("Failed to load dashboard data");
}

  const services: Service[] = await servicesResponse.json();
  const bookings: Booking[] = await bookingsResponse.json();

  const totalServices = services.length;

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const pendingRequests = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      icon: "🛠️",
    },
    {
      title: "Approved Services",
      value: approvedServices,
      icon: "✅",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: "📩",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {session?.user.name}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's an overview of your technician account.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {stat.title}
              </p>
              <span className="text-2xl">{stat.icon}</span>
            </div>

            <p className="mt-4 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Quick Actions</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/technician/add-service"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Add a Service
          </Link>

          <Link
            href="/dashboard/technician/my-services"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
          >
            My Services
          </Link>

          <Link
            href="/dashboard/technician/requests"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
          >
            View Requests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TechnicianDashboardPage() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <TechnicianDashboard />
    </Suspense>
  );
}
