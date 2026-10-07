import {
  BadgeCheck,
  HeartHandshake,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    title: "Curated Properties",
    description:
      "Explore a focused selection of properties across residential and commercial categories.",
    icon: SearchCheck,
  },
  {
    title: "Trusted Listings",
    description:
      "Property information is presented clearly so you can make more informed decisions.",
    icon: ShieldCheck,
  },
  {
    title: "Simple Experience",
    description:
      "Search, filter and explore properties without unnecessary complexity.",
    icon: BadgeCheck,
  },
  {
    title: "Built Around You",
    description:
      "Save properties you like and quickly return to the spaces that caught your attention.",
    icon: HeartHandshake,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-title"
      className="bg-background py-16 sm:py-20 lg:py-15"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          {/* Section introduction */}
          <header className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Why RealEstate
            </span>

            <h2
              id="why-choose-us-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              A better way to{" "}
              <span className="font-normal italic text-muted-foreground">
                find your space.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              We keep property discovery focused, transparent and easy to
              navigate—so you can spend less time searching and more time
              finding the right place.
            </p>
          </header>

          {/* Benefits */}
          <ul className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <li key={benefit.title}>
                  <article
                    className="
                      h-full
                      rounded-2xl
                      border
                      border-border
                      bg-surface
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-accent/40
                      hover:shadow-lg
                    "
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon
                        className="size-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-foreground">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
