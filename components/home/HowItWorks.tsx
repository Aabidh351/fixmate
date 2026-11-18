
const steps = [
  {
    number: "01",
    icon: "🔎",
    title: "Find a Service",
    description:
      "Browse available repair services and find the right technician for your device.",
  },
  {
    number: "02",
    icon: "📋",
    title: "Send a Request",
    description:
      "Describe your problem, provide your details, and submit a repair request.",
  },
  {
    number: "03",
    icon: "🛠️",
    title: "Get It Fixed",
    description:
      "Your technician accepts the request, works on your device, and completes the repair.",
  },
  {
    number: "04",
    icon: "💳",
    title: "Pay After Service",
    description:
      "Once the repair is completed, pay securely for the service through Stripe.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Getting your devices repaired shouldn&apos;t be complicated.
            Follow four simple steps and leave the rest to us.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative mx-auto flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold text-secondary">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
