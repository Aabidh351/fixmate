
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
            <Image
              src="/fixmate-logo.png"
              alt="FixMate"
              width={160}
              height={50}
              priority
              className="h-24 w-auto object-contain"
            />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-secondary transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:text-primary"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Navigation */}
        <details className="relative md:hidden">
          <summary
            aria-label="Toggle navigation menu"
            className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-secondary transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>

          <div className="absolute right-0 top-14 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-slate-50 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-secondary hover:bg-slate-50"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary/90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
