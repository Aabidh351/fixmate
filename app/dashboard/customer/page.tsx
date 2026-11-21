
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";

type Booking = {
  status: string;
};

function DashboardLoading() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">Loading dashboard...</p>
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <CustomerDashboardContent />
    </Suspense>
  );
}

async function CustomerDashboardContent() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  let bookings: Booking[] = [];

  if (token) {
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
      throw new Error("Failed to fetch dashboard statistics.");
    }

    bookings = await response.json();
  }

  const totalRequests = bookings.length;

  const activeJobs = bookings.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests,
      description: "All your repair requests",
      icon: "📋",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      description: "Requests currently in progress",
      icon: "🔧",
    },
    {
      title: "Completed Jobs",
      value: completedJobs,
      description: "Successfully completed repairs",
      icon: "✓",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">
          Customer Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-secondary sm:text-3xl">
          Welcome back, {session?.user.name}!
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your repair bookings and keep track of your services.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {stat.title}
              </p>
              <span className="text-2xl">{stat.icon}</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-secondary">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-secondary">
          Get Started
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Need help fixing a device or home appliance? Browse available
          repair services and find the right technician for your needs.
        </p>

        <Link
          href="/services"
          className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Browse Services
        </Link>
      </div>
    </div>
  );
}
