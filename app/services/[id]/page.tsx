
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

type Service = {
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
  technician: {
    name: string;
    image: string | null;
    area: string;
    bio: string;
  } | null;
};

async function getService(id: string): Promise<Service> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch service.");
  }

  return response.json();
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const service = await getService(id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/services"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Services
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative min-h-75 overflow-hidden rounded-2xl">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-semibold text-primary">{service.category}</p>

          <h1 className="mt-3 text-3xl font-extrabold text-secondary sm:text-4xl">
            {service.title}
          </h1>

          <p className="mt-5 leading-7 text-slate-600">
            {service.description}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-secondary">
              About the Technician
            </h2>

            <div className="mt-4 flex items-start gap-4">
              {service.technician?.image ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={service.technician.image}
                    alt={service.technician.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {service.technician?.name?.charAt(0) || "T"}
                </div>
              )}

              <div>
                <h3 className="font-bold text-secondary">
                  {service.technician?.name || service.technicianName}
                </h3>
            
                <p className="mt-1 text-sm text-slate-500">
                  {service.technician?.area || "Area not specified"}
                </p>
            
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.technician?.bio || "No technician bio available."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Starting Price</p>
            <p className="mt-1 text-3xl font-extrabold text-secondary">
              ${service.basePrice.toLocaleString("en-US")}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-slate-500">Technician</p>
                <p className="mt-1 font-semibold text-secondary">
                  {service.technicianName}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Estimated Duration</p>
                <p className="mt-1 font-semibold text-secondary">
                  {service.estimatedDuration}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Service Mode</p>
                <p className="mt-1 font-semibold text-secondary">
                  {service.serviceMode}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Service Area</p>
                <p className="mt-1 font-semibold text-secondary">
                  {service.serviceArea}
                </p>
              </div>
            </div>

            <Link
              href={`/services/${service._id}/request`}
              className="mt-8 block w-full rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-primary/90"
            >
              Request This Service
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
