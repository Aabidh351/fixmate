
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
  "Microwave Oven",
];

const serviceModes = ["All", "Home Visit", "Shop Drop-off"];

export default function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="search"
        placeholder="Search services..."
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => updateFilter("search", e.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-primary"
      />

      <select
        value={searchParams.get("category") || "All"}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-primary"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === "All" ? "All Categories" : category}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("serviceMode") || "All"}
        onChange={(e) => updateFilter("serviceMode", e.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-primary"
      >
        {serviceModes.map((mode) => (
          <option key={mode} value={mode}>
            {mode === "All" ? "All Service Modes" : mode}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("sort") || "newest"}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-primary"
      >
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
