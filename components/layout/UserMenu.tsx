
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (isPending) {
    return (
      <p className="text-sm font-medium text-slate-500">
        Loading...
      </p>
    );
  }

  const user = session?.user;

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const cta =
    user?.role === "admin"
      ? {
          name: "Admin Dashboard",
          href: "/dashboard/admin",
        }
      : user?.role === "technician"
        ? {
            name: "Manage Services",
            href: "/dashboard/technician/my-services",
          }
        : {
            name: "Find a Technician",
            href: "/services",
          };

  if (!user) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-secondary hover:text-primary"
      >
        Sign In
      </Link>

      <Link
        href="/sign-up"
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Get Started
      </Link>
    </div>
  );
}

  const initials = user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    const result = await authClient.signOut();

    if (result.error) {
      toast.error("Failed to sign out.");
      return;
    }

    toast.success("Signed out successfully!");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open user menu"
          aria-expanded={isOpen}
          className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-primary/10 text-sm font-bold text-primary transition hover:border-primary"
        >
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User avatar"}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          ) : (
            initials || "U"
          )}
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Close user menu"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User avatar"}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    initials || "U"
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-secondary">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold capitalize text-primary">
                    {user.role || "Customer"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-b border-slate-200 py-3">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary"
                >
                  My Profile
                </Link>

                <Link
                  href={dashboardLink}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary"
                >
                  Dashboard
                </Link>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      <Link
        href={cta.href}
        className="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 md:block"
      >
        {cta.name}
      </Link>
    </div>
  );
}
