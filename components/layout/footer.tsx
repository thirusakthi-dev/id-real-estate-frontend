import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const exploreLinks = [
  {
    label: "Buy Properties",
    href: "/properties?listingType=SALE",
  },
  {
    label: "Rent Properties",
    href: "/properties?listingType=RENT",
  },
  {
    label: "All Properties",
    href: "/properties",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Real Estate home"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Real<span className="text-accent">Estate</span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Discover thoughtfully selected properties and find a place that
              feels like home.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-semibold text-foreground">Explore</h2>

            <nav aria-label="Explore">
              <ul className="mt-4 space-y-3">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {item.label}

                      <ArrowUpRight
                        className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RealEstate. All rights reserved.</p>

          <p>Find your place. Make it home.</p>
        </div>
      </div>
    </footer>
  );
}
