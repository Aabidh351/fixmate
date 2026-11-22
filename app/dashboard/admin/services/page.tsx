
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminServicesList from "@/components/dashboard/AdminServicesList";

export type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: string;
  createdAt: string;
};

export default async function AdminServicesPage() {
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/services`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load submitted services.");
  }

  const services: Service[] = await response.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Manage Services
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review technician submissions and manage service approvals.
        </p>
      </div>

      <AdminServicesList initialServices={services} />
    </div>
  );
}
