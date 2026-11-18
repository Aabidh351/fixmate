
import Link from "next/link";

const categories = [
  { name: "Smartphone", icon: "📱" },
  { name: "Laptop & PC", icon: "💻" },
  { name: "AC", icon: "❄️" },
  { name: "Refrigerator", icon: "🧊" },
  { name: "TV", icon: "📺" },
  { name: "Washing Machine", icon: "🧺" },
  { name: "Electrical", icon: "⚡" },
  { name: "Microwave Oven", icon: "♨️" },
];

export default function PopularCategories() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            What Needs Fixing?
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
            Explore Repair Categories
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Find the right repair service for your devices and home appliances.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-7 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-colors group-hover:bg-primary/15">
                {category.icon}
              </span>

              <h3 className="mt-4 font-bold text-secondary transition-colors group-hover:text-primary">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
