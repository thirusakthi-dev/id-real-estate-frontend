"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Button from "@/components/ui/button";
import PropertyGrid from "@/components/property/property-grid";
import { useProperties } from "@/hooks/use-properties";

export default function FeaturedProperties() {
  const { data, isLoading, isError } = useProperties({
    page: 1,
    limit: 6,
    sort: "latest",
  });

  const properties = data?.data ?? [];

  return (
    <section
      aria-labelledby="featured-properties-title"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Featured properties
            </span>

            <h2
              id="featured-properties-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Places worth{" "}
              <span className="font-normal italic text-muted-foreground">
                discovering.
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore some of our latest properties, carefully selected for
              modern living and investment.
            </p>
          </div>

          <Link href="/properties" className="shrink-0">
            <Button
              type="button"
              endIcon={<ArrowRight className="size-4" />}
              className="rounded-xl"
            >
              View All Properties
            </Button>
          </Link>
        </div>

        {/* Properties */}
        <div className="mt-10">
          <PropertyGrid properties={properties} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
