import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/technician",
    icon: "▦",
  },
  {
    label: "Add Service",
    href: "/dashboard/technician/add-service",
    icon: "+",
  },
  {
    label: "My Services",
    href: "/dashboard/technician/my-services",
    icon: "⌘",
  },
  {
    label: "Requests",
    href: "/dashboard/technician/requests",
    icon: "▤",
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: "○",
  },
];

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  if (session.user.role !== "technician") {
    redirect(`/dashboard/${session.user.role}`);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
      <aside className="h-fit w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:sticky md:top-24 md:w-64">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Technician Portal
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            My Dashboard
          </h2>
          <p className="mt-1 truncate text-sm text-slate-500">
            {session.user.name}
          </p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-primary"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-base">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 rounded-xl bg-primary/5 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Grow your business
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Keep your services updated and respond to customer requests.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Add a service →
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}