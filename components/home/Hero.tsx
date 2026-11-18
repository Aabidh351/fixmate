
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Content */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Reliable Repair, Right at Your Doorstep
          </span>

          <h1 className="mt-6 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-secondary sm:text-5xl lg:text-6xl">
            Your Devices Deserve a{" "}
            <span className="text-primary">Second Life.</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            From smartphones to home appliances, find skilled
            technicians you can trust. Get your devices fixed
            without the hassle.
          </p>

          <div className="mt-4 sm:mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Explore Services
            </Link>

            <Link
              href="/about"
              className="rounded-xl border border-secondary/15 px-7 py-3.5 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-6 sm:mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-secondary">
            <span className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Trusted Technicians
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Pay After Service
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="absolute -right-6 -top-6 size-40 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/banner-bg.jpg"
              alt="Professional technician repairing a home appliance"
              width={800}
              height={650}
              loading="eager"
              priority
              className="h-80 w-full object-cover sm:h-105 lg:h-125"
            />
          </div>

          <div className="absolute -bottom-5 -left-4 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
            <p className="text-sm font-bold text-secondary">
              Repairs Made Simple
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Find. Fix. Pay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
