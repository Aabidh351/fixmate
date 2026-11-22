
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
];

type NavLinksProps = {
  variant: "desktop" | "mobile";
};

export default function NavLinks({ variant }: NavLinksProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className={
        variant === "desktop"
          ? "hidden items-center gap-8 md:flex"
          : "flex flex-col gap-1"
      }
    >
      {navLinks.map((link) => {
        const active = isActive(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              variant === "desktop"
                ? `border-b-2 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-secondary hover:text-primary"
                  }`
                : `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-secondary hover:bg-slate-50 hover:text-primary"
                  }`
            }
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
