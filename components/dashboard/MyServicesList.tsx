
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

type Service = {
  _id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  serviceMode: string;
  approvalStatus: string;
  isAvailable?: boolean;
};

export default function MyServicesList({
  services,
}: {
  services: Service[];
}) {
  const [serviceList, setServiceList] = useState(services);
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  const updateService = async (
    id: string,
    data: { isAvailable: boolean }
  ) => {
    setLoadingId(id);

    try {
      const { data: tokenData } = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setServiceList((current) =>
        current.map((service) =>
          service._id === id
            ? { ...service, isAvailable: data.isAvailable }
            : service
        )
      );

      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingId("");
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setLoadingId(id);

    try {
      const { data: tokenData } = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData?.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setServiceList((current) =>
        current.filter((service) => service._id !== id)
      );

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingId("");
    }
  };

  if (serviceList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="font-semibold text-slate-800">
          No services yet
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          You haven&apos;t submitted any repair services.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {serviceList.map((service) => {
        const isAvailable = service.isAvailable ?? true;

        return (
          <div
            key={service._id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex flex-col gap-5 p-5 sm:flex-row">
              {service.image && (
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    loading="eager"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {service.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      service.approvalStatus === "approved"
                        ? "bg-green-50 text-green-700"
                        : service.approvalStatus === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  {service.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {service.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-5 text-sm">
                  <p className="font-semibold text-slate-900">
                    ${service.basePrice}
                  </p>
                  <p className="text-slate-500">
                    {service.serviceMode}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  disabled={loadingId === service._id}
                  onChange={(e) =>
                    updateService(service._id, {
                      isAvailable: e.target.checked,
                    })
                  }
                  className="size-4 accent-blue-600"
                />
                Available to customers
              </label>

              <div className="flex items-center gap-4">
                <Link
  href={`/dashboard/technician/my-services/${service._id}/edit`}
  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
>
  Edit
</Link>
                <button
                  type="button"
                  onClick={() => deleteService(service._id)}
                  disabled={loadingId === service._id}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
