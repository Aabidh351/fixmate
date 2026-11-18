
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-secondary px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-accent">
          Ready to Get Started?
        </span>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Don&apos;t Let a Broken Device Slow You Down.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
          Find a trusted technician, request your repair, and pay only after
          the service is completed. Getting things fixed has never been easier.
        </p>

        <Link
          href="/services"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Find a Repair Service
        </Link>
      </div>
      
    </section>
  );
}
