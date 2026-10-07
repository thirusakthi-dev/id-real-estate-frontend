"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Edit,
  ExternalLink,
  Filter,
  Home,
  MapPin,
  Phone,
  Plus,
  UserRound,
} from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/icons/social-icons";

import PropertyFilters, {
  DEFAULT_FILTERS,
  type FilterValues,
} from "@/components/property/property-filters";
import PropertyGrid from "@/components/property/property-grid";
import LoadMore from "@/components/ui/load-more";
import StatsCard from "@/components/ui/stats-card";
import Button from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";

import { useCurrentUser } from "@/hooks/use-auth";
import { useProperties } from "@/hooks/use-properties";

import type { Property } from "@/types/property";

const PAGE_SIZE = 6;

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
  const sort = searchParams.get("sort") ?? "";

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

    sort: SORT_TYPES.includes(sort as (typeof SORT_TYPES)[number]) ? sort : "",
  };
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function normalizeUrl(url?: string | null) {
  if (!url) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();

  const { user, isLoggedIn, isLoading: authLoading } = useCurrentUser();

  const [filters, setFilters] = useState<FilterValues>(() =>
    getFiltersFromUrl(searchParams),
  );

  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    setFilters(getFiltersFromUrl(searchParams));
    setPage(1);
    setAllProperties([]);
  }, [searchParams]);

  const apiFilters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      mine: true,

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

      ...(filters.sort && {
        sort: filters.sort as "price_asc" | "price_desc" | "latest",
      }),
    }),
    [filters, page],
  );

  const {
    data,
    isLoading: propertiesLoading,
    isFetching,
    isError,
    refetch,
  } = useProperties(apiFilters);

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    setAllProperties((currentProperties) => {
      if (page === 1) {
        return data.data;
      }

      const existingIds = new Set(
        currentProperties.map((property) => property.id),
      );

      const newProperties = data.data.filter(
        (property) => !existingIds.has(property.id),
      );

      return [...currentProperties, ...newProperties];
    });
  }, [data, page]);

  if (!authLoading && !isLoggedIn) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-6" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              Login required
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Please log in to view your profile and manage your properties.
            </p>

            <Button
              type="button"
              onClick={() => {
                window.location.href = "/login";
              }}
              className="mt-6"
            >
              Login
            </Button>
          </div>
        </section>
      </main>
    );
  }

  if (authLoading || !user) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="mt-3 h-4 w-72 rounded bg-muted" />
          </div>
        </section>
      </main>
    );
  }

  const properties = allProperties;
  const pagination = data?.pagination;

  const activeFilterCount = [
    filters.city.trim(),
    filters.propertyType,
    filters.listingType,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const forSale = properties.filter(
    (property) => property.listingType === "SALE",
  ).length;

  const forRent = properties.filter(
    (property) => property.listingType === "RENT",
  ).length;

  const hasMore =
    pagination !== undefined && pagination.page < pagination.totalPages;

  const hasWhatsapp = Boolean(user.whatsapp?.trim());
  const hasInstagram = Boolean(user.instagram?.trim());
  const hasFacebook = Boolean(user.facebook?.trim());
  const hasLinkedin = Boolean(user.linkedin?.trim());

  const hasSocialLinks =
    hasWhatsapp || hasInstagram || hasFacebook || hasLinkedin;

  const hasProfileDetails = Boolean(
    user.phone?.trim() ||
    user.bio?.trim() ||
    user.city?.trim() ||
    hasSocialLinks,
  );

  function handleFiltersChange(nextFilters: FilterValues) {
    setAllProperties([]);
    setFilters(nextFilters);
    setPage(1);
  }

  function handleReset() {
    setAllProperties([]);
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
        {/* Profile Header */}
        <header className="mb-8">
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    aria-hidden="true"
                    className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground"
                  >
                    {getInitials(user.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">
                      Your profile
                    </p>

                    <h1 className="mt-0.5 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {user.name}
                    </h1>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>

                    {user.city?.trim() && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />

                        <span className="truncate">{user.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    startIcon={<Edit className="size-4" aria-hidden="true" />}
                    onClick={() => {
                      window.location.href = "/profile/edit";
                    }}
                    className="w-full sm:w-auto"
                  >
                    Edit profile
                  </Button>

                  <Button
                    type="button"
                    startIcon={<Plus className="size-4" aria-hidden="true" />}
                    onClick={() => {
                      window.location.href = "/properties/new";
                    }}
                    className="w-full sm:w-auto"
                  >
                    Create property
                  </Button>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="border-t border-border pt-5">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone
                    </p>

                    {user.phone?.trim() ? (
                      <a
                        href={`tel:${user.phone}`}
                        className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary"
                      >
                        <Phone
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />

                        <span>{user.phone}</span>
                      </a>
                    ) : (
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        Phone not specified.
                      </p>
                    )}
                  </div>

                  {/* Social */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Contact & social
                    </p>

                    {hasSocialLinks ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {hasWhatsapp && (
                          <a
                            href={`https://wa.me/${user.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            title="WhatsApp"
                            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            <WhatsappIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </a>
                        )}

                        {hasInstagram && (
                          <a
                            href={normalizeUrl(user.instagram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            title="Instagram"
                            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            <InstagramIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </a>
                        )}

                        {hasFacebook && (
                          <a
                            href={normalizeUrl(user.facebook)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            title="Facebook"
                            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            <FacebookIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </a>
                        )}

                        {hasLinkedin && (
                          <a
                            href={normalizeUrl(user.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            title="LinkedIn"
                            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            <LinkedinIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        No social links specified.
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Bio
                  </p>

                  {user.bio?.trim() ? (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      No bio specified.
                    </p>
                  )}
                </div>
              </div>

              {/* Incomplete Profile */}
              {!hasProfileDetails && (
                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Your profile is incomplete
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Add your contact details and social links so people can
                      learn more about you.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      window.location.href = "/profile/edit";
                    }}
                    className="w-full shrink-0 sm:w-auto"
                  >
                    Complete profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            icon={Building2}
            value={pagination?.total ?? 0}
            label="My properties"
            description={
              hasActiveFilters
                ? "Properties matching your current filters"
                : "Properties posted by you"
            }
            iconClassName="bg-primary/10 text-primary"
            accentClassName="before:bg-primary"
          />

          <StatsCard
            icon={Home}
            value={forSale}
            label="For sale"
            description="Sale listings in the current results"
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            accentClassName="before:bg-emerald-500"
          />

          <StatsCard
            icon={Home}
            value={forRent}
            label="For rent"
            description="Rental listings in the current results"
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            accentClassName="before:bg-violet-500"
          />
        </div>

        {/* Filters */}
        <section
          aria-labelledby="property-filters-heading"
          className="mb-8 rounded-2xl border border-border bg-background p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-primary" aria-hidden="true" />

              <h2
                id="property-filters-heading"
                className="text-sm font-semibold text-foreground"
              >
                Filter your properties
              </h2>
            </div>
          </div>

          <PropertyFilters
            value={filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
          />
        </section>

        {/* Results */}
        <section aria-label="My property listings">
          {isError ? (
            <ErrorState
              title="Unable to load your properties"
              description="Something went wrong while loading your property listings."
              onRetry={refetch}
            />
          ) : propertiesLoading && page === 1 ? (
            <PropertyGrid properties={[]} isLoading skeletonCount={PAGE_SIZE} />
          ) : properties.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
              <div
                aria-hidden="true"
                className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Building2 className="size-5" />
              </div>

              <h2 className="text-lg font-semibold text-foreground">
                {hasActiveFilters
                  ? "No properties found"
                  : "You haven't posted any properties yet"}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {hasActiveFilters
                  ? "No properties match your current filters. Try adjusting your search or clearing the filters."
                  : "Your properties will appear here once you create your first listing."}
              </p>

              {!hasActiveFilters && (
                <Button
                  type="button"
                  startIcon={<Plus className="size-4" aria-hidden="true" />}
                  onClick={() => {
                    window.location.href = "/properties/new";
                  }}
                  className="mt-5"
                >
                  Create property
                </Button>
              )}

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  className="mt-5"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Your listings
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {pagination?.total ?? properties.length}{" "}
                    {pagination?.total === 1 ? "property" : "properties"} found
                  </p>
                </div>

                {hasActiveFilters && (
                  <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
                    {activeFilterCount}{" "}
                    {activeFilterCount === 1 ? "filter" : "filters"} active
                  </span>
                )}
              </div>

              <PropertyGrid properties={properties} isLoading={false} isOwner />

              {pagination && pagination.total > 0 && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(properties.length, pagination.total)}
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
