import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import EditServiceForm from "@/components/dashboard/EditServiceForm";

type Service = {
  _id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

async function getMyService(id: string): Promise<Service> {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/technician/services`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load your services.");
  }

  const services: Service[] = await response.json();

  const service = services.find((item) => item._id === id);

  if (!service) notFound();

  return service;
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  if (session.user.role !== "technician") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const service = await getMyService(id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update your service information and submit it for approval again.
        </p>
      </div>

      <EditServiceForm service={service} />
    </div>
  );
}