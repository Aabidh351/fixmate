
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
