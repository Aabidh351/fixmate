import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminUsersList from "@/components/dashboard/AdminUsersList";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  image?: string;
  createdAt?: string;
};

export default async function AdminUsersPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/dashboard");

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load users.");
  }

  const users: AdminUser[] = await response.json();

  return <AdminUsersList initialUsers={users} />;
}