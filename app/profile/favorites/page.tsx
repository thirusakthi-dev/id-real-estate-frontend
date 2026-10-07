"use client";

import { Heart, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import BackButton from "@/components/ui/back-button";
import Button from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";
import PropertyGrid from "@/components/property/property-grid";

import { useFavorites } from "@/hooks/use-favorite";

export default function FavoritesPage() {
  const router = useRouter();

  const {
    data: favorites = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useFavorites();

  const properties = favorites.map((favorite) => favorite.property);

  return (
    <main className="min-h-screen bg-background">
      <section
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
          lg:py-10
        "
      >
        {/* Back */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <header
          className="
            mb-8
            flex
            flex-col
            gap-5
            border-b
            border-border
            pb-7
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <div
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <Heart
                  className="size-5"
                  fill="currentColor"
                  aria-hidden="true"
                />
              </div>

              <span
                className="
                  text-sm
                  font-medium
                  text-primary
                "
              >
                Your collection
              </span>
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-foreground
                sm:text-3xl
              "
            >
              Favorite properties
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-muted-foreground
                sm:text-base
              "
            >
              Keep track of properties you like and come back to them whenever
              you are ready.
            </p>
          </div>

          {!isLoading && !isError && favorites.length > 0 && (
            <div
              className="
                inline-flex
                w-fit
                shrink-0
                items-center
                rounded-full
                border
                border-border
                bg-surface
                px-3.5
                py-2
                text-sm
                font-medium
                text-muted-foreground
              "
            >
              <span className="text-foreground">{favorites.length}</span>

              <span className="ml-1">
                {favorites.length === 1 ? "saved property" : "saved properties"}
              </span>
            </div>
          )}
        </header>

        {/* Error */}
        {isError ? (
          <div className="py-8">
            <ErrorState
              title="Unable to load favorites"
              description="We couldn't load your saved properties. Please try again."
              action={
                <Button
                  type="button"
                  variant="outline"
                  startIcon={
                    <RefreshCw className="size-4" aria-hidden="true" />
                  }
                  loading={isFetching}
                  loadingText="Retrying..."
                  onClick={() => refetch()}
                >
                  Try again
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Loading */}
            {isLoading && (
              <PropertyGrid properties={[]} isLoading skeletonCount={6} />
            )}

            {/* Empty */}
            {!isLoading && favorites.length === 0 && (
              <section
                className="
                  flex
                  min-h-[420px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-border
                  bg-surface/50
                  px-6
                  py-12
                  text-center
                "
              >
                <div
                  className="
                    flex
                    size-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Heart className="size-7" aria-hidden="true" />
                </div>

                <h2
                  className="
                    mt-5
                    text-xl
                    font-semibold
                    text-foreground
                  "
                >
                  No favorites yet
                </h2>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  You haven't saved any properties yet. Explore available
                  properties and save the ones you like.
                </p>

                <Button
                  type="button"
                  className="mt-6"
                  startIcon={<Search className="size-4" aria-hidden="true" />}
                  onClick={() => router.push("/properties")}
                >
                  Browse properties
                </Button>
              </section>
            )}

            {/* Favorites */}
            {!isLoading && properties.length > 0 && (
              <PropertyGrid properties={properties} />
            )}
          </>
        )}
      </section>
    </main>
  );
}
