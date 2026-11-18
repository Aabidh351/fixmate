
const benefits = [
  {
    icon: "🛠️",
    title: "Skilled Technicians",
    description:
      "Connect with technicians who have the skills to handle your device and appliance repairs.",
  },
  {
    icon: "💳",
    title: "Pay After Service",
    description:
      "No upfront payment. Pay only after your repair job has been completed.",
  },
  {
    icon: "📍",
    title: "Convenient Service",
    description:
      "Choose home visits or shop drop-off based on your needs and location.",
  },
  {
    icon: "🤝",
    title: "Simple & Transparent",
    description:
      "Submit requests, track repair progress, and know your final repair cost before payment.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-10 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            The FixMate Advantage
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
            Repair Services You Can Count On
          </h2>

          <p className="mt-5 max-w-xl leading-8 text-slate-600">
            Finding a reliable repair service shouldn&apos;t be stressful.
            FixMate makes it easier to connect with technicians and manage
            your repair journey from request to completion.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
              ✓
            </span>
            <p className="font-semibold text-secondary">
              Your repair, your convenience, your peace of mind.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-background p-6"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {benefit.icon}
              </span>

              <h3 className="mt-5 font-bold text-secondary">
                {benefit.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
