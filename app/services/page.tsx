
import ServiceFilters from "@/components/services/ServiceFIlters";
import Image from "next/image";
import Link from "next/link";

type Service = {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
};


async function getServices(searchParams: {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
}): Promise<Service[]> {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch services.");
  }

  return response.json();
}


export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
  }>;
}) {
  const filters = await searchParams;
  const services = await getServices(filters);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-secondary sm:text-4xl">
          Explore Repair Services
        </h1>
        <p className="mt-3 text-slate-600">
          Find the right technician to get your devices working again.
        </p>
      </div>

      <ServiceFilters />

      {services.length === 0 ? (
        <p className="py-16 text-center text-slate-500">
          No services available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-56">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="eager"
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold text-primary">
                  {service.category}
                </p>

                <h2 className="mt-2 text-xl font-bold text-secondary">
                  {service.title}
                </h2>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Technician: {service.technicianName}</p>
                  <p>Service Mode: {service.serviceMode}</p>
                  <p>Area: {service.serviceArea}</p>
                  <p>Duration: {service.estimatedDuration}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-lg font-extrabold text-secondary">
                    ৳{service.basePrice.toLocaleString("en-BD")}
                  </p>

                  <Link
                    href={`/services/${service._id}`}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
