import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  if (!session) redirect("/sign-in");

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [servicesResponse, bookingsResponse] = await Promise.all([
    fetch(`${apiUrl}/api/technician/services`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(`${apiUrl}/api/technician/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);

  if (!servicesResponse.ok || !bookingsResponse.ok) {
    throw new Error("Failed to load dashboard data.");
  }

  const services: Service[] = await servicesResponse.json();
  const bookings: Booking[] = await bookingsResponse.json();

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      description: "Services you've submitted",
      icon: "🛠️",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Approved Services",
      value: services.filter(
        (service) => service.approvalStatus === "approved"
      ).length,
      description: "Visible to customers",
      icon: "✓",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending Requests",
      value: bookings.filter(
        (booking) => booking.status === "requested"
      ).length,
      description: "Waiting for your response",
      icon: "📩",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const actions = [
    {
      title: "Add a Service",
      description: "List a new repair service for customers.",
      href: "/dashboard/technician/add-service",
      icon: "＋",
    },
    {
      title: "Manage Services",
      description: "Update your listings and availability.",
      href: "/dashboard/technician/my-services",
      icon: "🛠️",
    },
    {
      title: "View Requests",
      description: "Check and respond to repair requests.",
      href: "/dashboard/technician/requests",
      icon: "📋",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white sm:px-8 sm:py-10">
        <p className="text-sm font-medium text-slate-300">
          Technician Dashboard
        </p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Welcome back, {session.user.name}!
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Manage your repair services, keep track of customer requests, and
          grow your business with FixMate.
        </p>

        <Link
          href="/dashboard/technician/add-service"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          + Add New Service
        </Link>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Account Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Here's how your technician account is doing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <span
                  className={`flex size-11 items-center justify-center rounded-xl text-xl font-bold ${stat.color}`}
                >
                  {stat.icon}
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Shortcuts to the things you use most.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
                {action.icon}
              </div>

              <h3 className="mt-5 font-semibold text-slate-900 transition group-hover:text-primary">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>

              <span className="mt-4 inline-flex text-sm font-semibold text-primary">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}

export default function TechnicianDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <TechnicianDashboard />
    </Suspense>
  );
}