
import Image from "next/image";
import Link from "next/link";
import CurrentYear from "./CurrentYear";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "Air Conditioner",
  "Refrigerator",
  "Television",
  "Washing Machine",
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/fixmate-logo.png"
                alt="FixMate"
                width={160}
                height={50}
                loading="eager"
                className="h-24 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-300">
              Your trusted partner for smart device and home appliance
              repairs. Find skilled technicians and get your devices
              fixed with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition-colors hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold">Popular Categories</h3>
            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-sm text-slate-300 transition-colors hover:text-accent"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold">Get in Touch</h3>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Have questions or need assistance? We're here to help.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center">
          <p className="text-sm text-slate-400">
            © <CurrentYear/> FixMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
