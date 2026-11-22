
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  if (session.user.role !== "admin") {
    redirect(`/dashboard/${session.user.role}`);
  }

  const navLinks = [
    {
      name: "Overview",
      href: "/dashboard/admin",
    },
    {
      name: "Manage Services",
      href: "/dashboard/admin/services",
    },
    {
      name: "Manage Users",
      href: "/dashboard/admin/users",
    },
    {
      name: "Manage Bookings",
      href: "/dashboard/admin/bookings",
    },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-6">
        <aside className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-5 md:sticky md:top-24 md:h-fit md:w-64">
          <div className="mb-6 border-b border-slate-100 pb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Admin Panel
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage FixMate platform
            </p>
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
