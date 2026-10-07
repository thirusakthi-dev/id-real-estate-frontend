import { Building2, Home, LandPlot, Store, Warehouse } from "lucide-react";
import Link from "next/link";

const propertyTypes = [
  {
    title: "Apartments",
    value: "APARTMENT",
    description: "Modern spaces for comfortable city living.",
    icon: Building2,
  },
  {
    title: "Villas",
    value: "VILLA",
    description: "Private homes designed for elevated living.",
    icon: Home,
  },
  {
    title: "Houses",
    value: "HOUSE",
    description: "Thoughtfully designed homes for every family.",
    icon: Home,
  },
  {
    title: "Plots",
    value: "PLOT",
    description: "Build your future on the right piece of land.",
    icon: LandPlot,
  },
  {
    title: "Offices",
    value: "OFFICE",
    description: "Professional spaces for growing businesses.",
    icon: Warehouse,
  },
  {
    title: "Shops",
    value: "SHOP",
    description: "Commercial spaces in promising locations.",
    icon: Store,
  },
];

export default function PropertyTypes() {
  return (
    <section
      aria-labelledby="property-types-title"
      className="bg-surface py-9 sm:py-10 lg:py-13"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Explore by type
          </span>

          <h2
            id="property-types-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Find the right space{" "}
            <span className="font-normal italic text-muted-foreground">
              for you.
            </span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            From contemporary apartments to spacious villas and commercial
            spaces, explore properties that match your needs.
          </p>
        </div>

        {/* Types */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propertyTypes.map((property) => {
            const Icon = property.icon;

            return (
              <Link
                key={property.value}
                href={`/properties?propertyType=${property.value}`}
                className="
                  group
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
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
                    <Icon
                      className="size-6"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-lg text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  >
                    ↗
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {property.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {property.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
