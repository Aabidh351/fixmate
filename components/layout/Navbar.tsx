
import Image from "next/image";
import Link from "next/link";
import UserMenu from "@/components/layout/UserMenu";

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
            loading="eager"
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

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          <UserMenu />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 md:hidden">
          <UserMenu />

          <details className="group relative">
            <summary
              aria-label="Toggle navigation menu"
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-secondary transition-colors hover:border-primary/30 hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 transition-transform group-open:rotate-90"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>

            <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
