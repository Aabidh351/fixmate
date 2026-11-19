
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Starting Price</p>
            <p className="mt-1 text-3xl font-extrabold text-secondary">
              ৳{service.basePrice.toLocaleString("en-BD")}
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

            <button
              className="mt-8 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              Request This Service
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
