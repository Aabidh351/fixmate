
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { Service } from "@/app/dashboard/admin/services/page";

export default function AdminServicesList({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const [services, setServices] = useState(initialServices);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const updateApproval = async (
    serviceId: string,
    status: "approved" | "rejected"
  ) => {
    setLoadingId(serviceId);

    try {
      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/services/${serviceId}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service.");
      }

      setServices((current) =>
        current.map((service) =>
          service._id === serviceId
            ? { ...service, approvalStatus: status }
            : service
        )
      );

      toast.success(`Service ${status} successfully.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="font-semibold text-slate-800">
          No services submitted yet
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Technician service submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {services.map((service) => (
        <div
          key={service._id}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div className="grid gap-5 p-5 md:grid-cols-[180px_1fr]">
            {service.image ? (
              <div className="relative h-40 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
                No image
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {service.category}
                </span>

                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  service.approvalStatus === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : service.approvalStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {service.approvalStatus}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-slate-900">
                {service.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {service.description}
              </p>

              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p>Technician: {service.technicianName}</p>
                <p>Email: {service.technicianEmail}</p>
                <p>Base price: ${service.basePrice}</p>
                <p>Duration: {service.estimatedDuration || "Not provided"}</p>
                <p>Service mode: {service.serviceMode}</p>
                <p>Service area: {service.serviceArea || "Not provided"}</p>
              </div>

              {service.approvalStatus === "pending" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => updateApproval(service._id, "approved")}
                    disabled={loadingId === service._id}
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {loadingId === service._id ? "Updating..." : "Approve"}
                  </button>

                  <button
                    onClick={() => updateApproval(service._id, "rejected")}
                    disabled={loadingId === service._id}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
