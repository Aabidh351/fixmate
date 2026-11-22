
import Link from "next/link";

const adminSections = [
  {
    title: "Manage Services",
    description: "Review technician services and approve or reject submissions.",
    href: "/dashboard/admin/services",
    action: "Review Services",
  },
  {
    title: "Manage Users",
    description: "View users and manage their platform roles.",
    href: "/dashboard/admin/users",
    action: "Manage Users",
  },
  {
    title: "Manage Bookings",
    description: "Monitor customer bookings and service progress.",
    href: "/dashboard/admin/bookings",
    action: "View Bookings",
  },
  {
    title: "Transactions",
    description: "Review payments and transaction records.",
    href: "/dashboard/admin/transactions",
    action: "View Transactions",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">
          FIXMATE ADMINISTRATION
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Manage services, users, bookings, and platform transactions.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-8 text-white">
        <h2 className="text-2xl font-bold">Welcome to FixMate</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Your central workspace for monitoring and managing the repair
          service platform. Review submissions and keep everything running
          smoothly.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Management
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {adminSections.map((section) => (
            <div
              key={section.href}
              className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">
                {section.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {section.description}
              </p>

              <Link
                href={section.href}
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {section.action}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
