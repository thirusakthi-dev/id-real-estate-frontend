import { ArrowRight, Search, SlidersHorizontal, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Start with a location, property type or listing preference that matches what you're looking for.",
    icon: Search,
  },
  {
    number: "02",
    title: "Explore",
    description:
      "Use filters to narrow down properties by type, price and other important details.",
    icon: SlidersHorizontal,
  },
  {
    number: "03",
    title: "Save",
    description:
      "Keep your favorite properties in one place so you can come back to them anytime.",
    icon: Heart,
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="bg-surface py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            How it works
          </span>

          <h2
            id="how-it-works-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Finding your next place,{" "}
            <span className="font-normal italic text-muted-foreground">
              made simple.
            </span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            A straightforward way to discover properties without the unnecessary
            hassle.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <article
                  className="
                    h-full
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-accent/40
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon
                        className="size-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <span className="text-sm font-semibold tracking-wider text-accent">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </article>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <ArrowRight
                    className="
                      absolute
                      -right-4
                      top-1/2
                      z-10
                      hidden
                      size-7
                      -translate-y-1/2
                      text-accent
                      md:block
                    "
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
