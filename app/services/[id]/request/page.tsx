
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import RequestForm from "@/components/services/RequestForm";


type Service = {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  technicianName: string;
};

async function getService(id: string): Promise<Service> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
    { cache: "no-store" }
  );

  if (response.status === 400 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch service.");
  }

  return response.json();
}

export default async function RequestServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/sign-in?callbackURL=/services/${id}/request`);
  }

  if (session.user.role !== "customer") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-secondary">
          Service Requests Unavailable
        </h1>
        <p className="mt-3 text-slate-600">
          Only customer accounts can request repair services.
        </p>
      </main>
    );
  }

  const service = await getService(id);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-secondary">
        Request a Repair
      </h1>

      <p className="mt-2 text-slate-600">
        Complete the details below to request this service.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Selected Service</p>

        <h2 className="mt-1 text-xl font-bold text-secondary">
          {service.title}
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {service.category} · {service.technicianName}
        </p>

        <p className="mt-3 text-lg font-bold text-secondary">
          ${service.basePrice.toLocaleString("en-US")}
        </p>
      </div>

      <RequestForm
        serviceId={service._id}
        name={session.user.name}
        email={session.user.email}
        phone={session.user.phone || ""}
      />
    </main>
  );
}
