"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/review", label: "review" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  const isResultPage = pathname.startsWith("/result");
  const ctaLabel = isResultPage ? "new_review" : "start_review";

  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b border-border">
      {/* Logo */}
      <Link href="/" className="text-base font-bold tracking-tight">
        <span className="text-accent-primary">&gt;</span>{" "}
        <span className="text-text-primary">code_reviewer</span>
      </Link>

      {/* Links + CTA */}
      <div className="flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = !isResultPage && pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-text-primary ${
                isActive ? "text-accent-primary" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <Link href="/review">
          <Button variant="primary">{ctaLabel}</Button>
        </Link>
      </div>
    </nav>
  );
}
