import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function Cta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-10 sm:py-16 lg:px-16">
          {/* Decorative elements */}
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 size-64 rounded-full border border-primary-foreground/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 size-72 rounded-full border border-primary-foreground/10"
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div
              aria-hidden="true"
              className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary"
            >
              <Search className="size-5" />
            </div>

            <h2
              id="cta-title"
              className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Your next place could be
              <span className="block font-normal italic opacity-80">
                closer than you think.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-primary-foreground/70 sm:text-base">
              Browse our latest listings and discover a property that fits the
              way you want to live.
            </p>

            {/* Navigation actions */}
            <nav
              aria-label="Property discovery"
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/properties"
                className="
                  inline-flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-accent
                  px-6
                  text-sm
                  font-medium
                  text-primary
                  transition-opacity
                  duration-200
                  hover:opacity-90
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary-foreground
                  sm:w-auto
                "
              >
                Explore Properties
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="/properties?listingType=RENT"
                className="
                  inline-flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-primary-foreground/20
                  bg-transparent
                  px-6
                  text-sm
                  font-medium
                  text-primary-foreground
                  transition-colors
                  duration-200
                  hover:bg-primary-foreground/10
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary-foreground
                  sm:w-auto
                "
              >
                Browse Rentals
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
