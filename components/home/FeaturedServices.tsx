
import Image from "next/image";
import Link from "next/link";

type Service = {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
};

async function getFeaturedServices(): Promise<Service[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/featured`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured services");
    }

    return response.json();
  } catch (error) {
    console.error("Featured services error:", error);
    return [];
  }
}

export default async function FeaturedServices() {
  const services = await getFeaturedServices();

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Our Services
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
              Featured Repair Services
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Explore some of our latest repair services from skilled technicians.
            </p>
          </div>

          <Link
            href="/services"
            className="font-bold text-primary transition-colors hover:text-secondary"
          >
            View All Services →
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative h-55 bg-slate-100">
                  {service.image && (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="eager"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {service.category}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-secondary">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {service.serviceMode} · {service.serviceArea}
                  </p>

                  <p className="mt-4 text-sm text-slate-600">
                    Technician: {service.technicianName}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-lg font-extrabold text-secondary">
                      ৳{service.basePrice.toLocaleString("en-BD")}
                    </p>

                    <Link
                      href={`/services/${service._id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No featured services available right now.
          </p>
        )}
      </div>
    </section>
  );
}
