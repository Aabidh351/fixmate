
import Link from "next/link";

const values = [
  {
    icon: "🤝",
    title: "Trust & Reliability",
    description:
      "We aim to connect customers with dependable technicians who take their work seriously.",
  },
  {
    icon: "💡",
    title: "Simplicity",
    description:
      "Finding a repair service, submitting a request, and tracking progress should be straightforward.",
  },
  {
    icon: "💳",
    title: "Pay After Service",
    description:
      "Customers pay only after their repair has been completed, making the process more transparent.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-secondary px-4 py-10 md:py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-widest text-accent">
            About FixMate
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Making Repairs Simple and Reliable
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-300">
            FixMate brings customers and skilled repair technicians together.
            Our goal is to make device and home appliance repairs easier,
            more convenient, and more transparent.
          </p>
        </div>
      </section>

      <section className="bg-background px-4 py-10 md:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
              One Platform for Your Repair Needs
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              From smartphones and laptops to refrigerators and air
              conditioners, FixMate helps customers discover repair services
              that match their needs.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              We provide a platform where technicians can offer their
              services and customers can submit repair requests, follow job
              progress, and complete payments after successful repairs.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              🔧
            </div>

            <h3 className="mt-6 text-2xl font-extrabold text-secondary">
              Our Mission
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              To make repair services accessible and convenient by creating
              a trustworthy connection between customers and technicians.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 md:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              What Matters to Us
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-background p-7"
              >
                <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {value.icon}
                </span>

                <h3 className="mt-5 text-lg font-bold text-secondary">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white">
          Need Something Fixed?
        </h2>

        <p className="mt-4 text-slate-300">
          Explore available services and find the right technician.
        </p>

        <Link
          href="/services"
          className="mt-7 inline-flex rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Explore Services
        </Link>
      </section>
      <hr/>
    </main>
  );
}
