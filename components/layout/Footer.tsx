
import Image from "next/image";
import Link from "next/link";
import CurrentYear from "./CurrentYear";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
];

// Replace these placeholders with your actual contact details.
const contact = {
  email: "your-email@example.com",
  phone: "+8801XXXXXXXXX",
  address: "Your business address, Chattogram, Bangladesh",
};

// Replace these placeholder URLs with your actual social profiles.
const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/your-page" },
  { name: "Instagram", href: "https://instagram.com/your-page" },
  { name: "X", href: "https://x.com/your-profile" },
  { name: "LinkedIn", href: "https://linkedin.com/company/your-page" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/fixmate-footer-logo.jpg"
                alt="FixMate"
                width={160}
                height={50}
                className="h-20 w-auto object-contain"
              />
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
              Your trusted repair partner. Connecting you with skilled
              technicians to keep your devices and home appliances running.
            </p>

            <p className="mt-5 text-sm font-semibold text-white">
              Repair made simple. Life made easier.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-slate-300 transition-colors hover:border-accent hover:bg-accent hover:text-white"
                >
                  {social.name === "X" ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zm-1.29 19.49h2.039L6.486 3.24H4.298z" />
                    </svg>
                  ) : (
                    social.name.charAt(0)
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-25 sm:mt-0">
            <h3 className="text-base font-bold">Quick Links</h3>

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

          {/* Popular Categories */}
          <div>
            <h3 className="text-base font-bold">Popular Categories</h3>

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
            <h3 className="text-base font-bold">Get in Touch</h3>

            <p className="mt-5 text-sm leading-6 text-slate-300">
              Have a question or need help? We'd love to hear from you.
            </p>

            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <p className="mb-1 font-semibold text-white">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all transition-colors hover:text-accent"
                >
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="mb-1 font-semibold text-white">Phone</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="transition-colors hover:text-accent"
                >
                  {contact.phone}
                </a>
              </div>

              <div>
                <p className="mb-1 font-semibold text-white">Address</p>
                <p className="leading-6">{contact.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/15 pt-6">
          <p className="text-center text-sm text-slate-400">
            © <CurrentYear /> FixMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
