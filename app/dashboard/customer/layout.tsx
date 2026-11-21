
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const dashboardLinks = [
  { name: "Overview", href: "/dashboard/customer" },
  { name: "My Bookings", href: "/dashboard/customer/bookings" },
  { name: "Payment History", href: "/dashboard/customer/payments" },
  { name: "My Profile", href: "/dashboard/profile" },
];

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "customer") {
    redirect(`/dashboard/${session.user.role}`);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
      {/* Sidebar */}
      <aside className="w-full shrink-0 md:w-64">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 border-b border-slate-100 px-2 pb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer Portal
            </p>
            <h2 className="mt-1 text-lg font-bold text-secondary">
              My Dashboard
            </h2>
          </div>

          <nav className="flex flex-col gap-1">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <Link
              href="/services"
              className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Find a Technician
            </Link>
          </div>
        </div>
      </aside>

      {/* Dashboard Content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
