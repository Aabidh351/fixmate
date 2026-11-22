
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

type AdminUser = {
  role: string;
};

type AdminService = {
  approvalStatus: string;
};

async function getAdminStats(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [usersResponse, servicesResponse] = await Promise.all([
    fetch(`${apiUrl}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }),
    fetch(`${apiUrl}/api/admin/services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }),
  ]);

  if (!usersResponse.ok || !servicesResponse.ok) {
    throw new Error("Failed to load admin statistics.");
  }

  const users: AdminUser[] = await usersResponse.json();
  const services: AdminService[] = await servicesResponse.json();

  return {
    totalUsers: users.length,
    totalTechnicians: users.filter(
      (user) => user.role === "technician"
    ).length,
    pendingServices: services.filter(
      (service) => service.approvalStatus === "pending"
    ).length,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const stats = await getAdminStats(token);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered platform users",
    },
    {
      title: "Total Technicians",
      value: stats.totalTechnicians,
      description: "Registered technicians",
    },
    {
      title: "Pending Services",
      value: stats.pendingServices,
      description: "Services awaiting approval",
    },
  ];

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

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {stat.description}
            </p>
          </div>
        ))}
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
