"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, Filter, Home, RotateCcw, Search } from "lucide-react";

import PropertyFilters, {
  DEFAULT_FILTERS,
  type FilterValues,
} from "@/components/property/property-filters";
import PropertyGrid from "@/components/property/property-grid";
import LoadMore from "@/components/ui/load-more";
import StatsCard from "@/components/ui/stats-card";
import Button from "@/components/ui/button";

import { useProperties } from "@/hooks/use-properties";
import Input from "@/components/ui/input";

const PAGE_SIZE = 10;

const PROPERTY_TYPES = [
  "APARTMENT",
  "VILLA",
  "HOUSE",
  "PLOT",
  "OFFICE",
  "SHOP",
] as const;

const LISTING_TYPES = ["SALE", "RENT"] as const;

const SORT_TYPES = ["price_asc", "price_desc", "latest"] as const;

function getFiltersFromUrl(
  searchParams: ReturnType<typeof useSearchParams>,
): FilterValues {
  const propertyType = searchParams.get("propertyType") ?? "";
  const listingType = searchParams.get("listingType") ?? "";
  const sort = searchParams.get("sort") ?? "latest";

  return {
    search: searchParams.get("search") ?? "",

    city: searchParams.get("city") ?? "",

    propertyType: PROPERTY_TYPES.includes(
      propertyType as (typeof PROPERTY_TYPES)[number],
    )
      ? propertyType
      : "",

    listingType: LISTING_TYPES.includes(
      listingType as (typeof LISTING_TYPES)[number],
    )
      ? listingType
      : "",

    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",

    sort: SORT_TYPES.includes(sort as (typeof SORT_TYPES)[number])
      ? sort
      : "latest",
  };
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterValues>(() =>
    getFiltersFromUrl(searchParams),
  );

  const [page, setPage] = useState(1);

  /*
   * Sync filters with URL.
   *
   * Example:
   * /properties?search=luxury&listingType=RENT&propertyType=VILLA
   */
  useEffect(() => {
    setFilters(getFiltersFromUrl(searchParams));
    setPage(1);
  }, [searchParams]);

  /*
   * Convert UI filters into API filters.
   */
  const apiFilters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,

      ...(filters.search.trim() && {
        search: filters.search.trim(),
      }),

      ...(filters.city.trim() && {
        city: filters.city.trim(),
      }),

      ...(filters.propertyType && {
        propertyType: filters.propertyType as
          | "APARTMENT"
          | "VILLA"
          | "HOUSE"
          | "PLOT"
          | "OFFICE"
          | "SHOP",
      }),

      ...(filters.listingType && {
        listingType: filters.listingType as "SALE" | "RENT",
      }),

      ...(filters.minPrice &&
        Number(filters.minPrice) > 0 && {
          minPrice: Number(filters.minPrice),
        }),

      ...(filters.maxPrice &&
        Number(filters.maxPrice) > 0 && {
          maxPrice: Number(filters.maxPrice),
        }),

      sort: filters.sort as "price_asc" | "price_desc" | "latest",
    }),
    [filters, page],
  );

  const { data, isLoading, isFetching, isError } = useProperties(apiFilters);

  const properties = data?.data ?? [];
  const pagination = data?.pagination;

  const activeFilterCount = [
    filters.search.trim(),
    filters.city.trim(),
    filters.propertyType,
    filters.listingType,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const hasMore =
    pagination !== undefined && pagination.page < pagination.totalPages;

  function handleSearchChange(value: string) {
    setFilters((current) => ({
      ...current,
      search: value,
    }));

    setPage(1);
  }

  function handleFiltersChange(nextFilters: FilterValues) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  function handleLoadMore() {
    if (!hasMore || isFetching) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">
            Property listings
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Find your next property
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Search properties by name and refine your results using the filters
            below.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            icon={Building2}
            value={pagination?.total ?? 0}
            label="Total properties"
            description={
              hasActiveFilters
                ? "Properties matching your current filters"
                : "Available property listings"
            }
            iconClassName="bg-primary/10 text-primary"
            accentClassName="before:bg-primary"
          />

          <StatsCard
            icon={Home}
            value={properties.length}
            label="Showing now"
            description="Properties currently displayed"
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            accentClassName="before:bg-emerald-500"
          />

          <StatsCard
            icon={Filter}
            value={activeFilterCount}
            label="Active filters"
            description={
              activeFilterCount === 0
                ? "No filters applied"
                : `${activeFilterCount} filter${
                    activeFilterCount > 1 ? "s" : ""
                  } applied`
            }
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            accentClassName="before:bg-violet-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="mb-8 rounded-2xl border border-border bg-background p-4 sm:p-5">
          {/* Search */}
          <div className="pb-5">
            <div className="mb-3 flex items-center gap-2">
              <Search className="size-4 text-primary" aria-hidden="true" />

              <h2 className="text-sm font-semibold text-foreground">
                Search properties
              </h2>
            </div>

            <Input
              id="property-search"
              name="search"
              type="search"
              value={filters.search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by property name..."
              startIcon={<Search className="size-4" aria-hidden="true" />}
            />

            {filters.search.trim() && (
              <p className="mt-2 text-xs text-muted-foreground">
                Searching for{" "}
                <span className="font-medium text-foreground">
                  "{filters.search.trim()}"
                </span>
              </p>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Filters */}
          <div className="pt-5">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="size-4 text-primary" aria-hidden="true" />

              <h2 className="text-sm font-semibold text-foreground">
                Filter properties
              </h2>
            </div>

            <PropertyFilters
              value={filters}
              onChange={handleFiltersChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Results */}
        <section aria-label="Property results">
          {isError ? (
            <div
              role="alert"
              className="
                rounded-2xl
                border
                border-destructive/20
                bg-destructive/5
                p-8
                text-center
              "
            >
              <h2 className="text-lg font-semibold text-foreground">
                Unable to load properties
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Something went wrong while loading the properties. Please try
                again.
              </p>

              <Button
                type="button"
                variant="secondary"
                onClick={() => window.location.reload()}
                className="mt-5"
              >
                Try again
              </Button>
            </div>
          ) : isLoading ? (
            <PropertyGrid properties={[]} isLoading />
          ) : properties.length === 0 ? (
            <div
              className="
                flex
                min-h-80
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-border
                bg-surface
                px-6
                py-12
                text-center
              "
            >
              <div
                className="
                  mb-4
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                  text-primary
                "
              >
                <Building2 className="size-5" aria-hidden="true" />
              </div>

              <h2 className="text-lg font-semibold text-foreground">
                No properties found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                We couldn't find any properties matching your current filters.
                Try adjusting your search or clearing the filters.
              </p>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  startIcon={
                    <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
                  }
                  className="mt-5"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <PropertyGrid properties={properties} isLoading={false} />

              {pagination && pagination.total > 0 && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(page * PAGE_SIZE, pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {pagination.total}
                    </span>{" "}
                    properties
                  </p>

                  {hasMore && (
                    <LoadMore onClick={handleLoadMore} loading={isFetching} />
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}
