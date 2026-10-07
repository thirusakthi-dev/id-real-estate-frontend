"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  MapPin,
  Pencil,
  Ruler,
  Trash2,
  UserRound,
} from "lucide-react";

import Badge from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import OptimizedImage from "@/components/ui/optimized-image";
import PropertyFavorite from "@/components/property/property-favorite";

import { useDeleteProperty } from "@/hooks/use-properties";
import { showToast } from "@/hooks/use-toast";

import type { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
  isOwner?: boolean;
};

export default function PropertyCard({
  property,
  isOwner = false,
}: PropertyCardProps) {
  const image = property.images?.[0];
  const isForSale = property.listingType === "SALE";

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deletePropertyMutation = useDeleteProperty();

  const bedrooms =
    property.bedrooms !== null && property.bedrooms !== undefined
      ? `${property.bedrooms} ${property.bedrooms === 1 ? "Bed" : "Beds"}`
      : "Not specified";

  const bathrooms =
    property.bathrooms !== null && property.bathrooms !== undefined
      ? `${property.bathrooms} ${property.bathrooms === 1 ? "Bath" : "Baths"}`
      : "Not specified";

  const area =
    property.area !== null && property.area !== undefined
      ? `${Number(property.area).toLocaleString("en-IN")} sq.ft`
      : "Not specified";

  function handleDelete() {
    deletePropertyMutation.mutate(property.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);

        showToast({
          type: "success",
          title: "Property deleted",
          message: "The property was deleted successfully.",
        });
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Delete failed",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete the property.",
        });
      },
    });
  }

  return (
    <>
      <article
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-surface
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:shadow-lg
        "
      >
        <div className="relative shrink-0">
          <Link
            href={`/properties/${property.id}`}
            aria-label={`View ${property.title}`}
          >
            <figure
              className="
                relative
                aspect-[4/3]
                overflow-hidden
                bg-surface-hover
              "
            >
              {image ? (
                <OptimizedImage
                  src={image}
                  alt={property.title}
                  fill
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw
                  "
                  quality={75}
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                    bg-surface-hover
                    text-sm
                    text-muted-foreground
                  "
                >
                  No image available
                </div>
              )}

              <div className="absolute left-3 top-3">
                <Badge variant={isForSale ? "default" : "warning"}>
                  {isForSale ? "For Sale" : "For Rent"}
                </Badge>
              </div>

              {!property.isAvailable && (
                <div className="absolute right-3 top-3">
                  <Badge variant="destructive">Unavailable</Badge>
                </div>
              )}

              {isOwner && (
                <div
                  className="
                    absolute
                    right-3
                    top-3
                    z-20
                    flex
                    overflow-hidden
                    rounded-lg
                    border
                    border-border/60
                    bg-background/90
                    shadow-sm
                    backdrop-blur-sm
                  "
                >
                  <button
                    type="button"
                    aria-label={`Edit ${property.title}`}
                    title="Edit property"
                    className="
                      flex
                      size-9
                      items-center
                      justify-center
                      text-muted-foreground
                      transition-colors
                      hover:bg-surface-hover
                      hover:text-foreground
                      focus-visible:z-10
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                      focus-visible:ring-inset
                    "
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      window.location.href = `/properties/${property.id}/edit`;
                    }}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>

                  <div className="w-px bg-border" aria-hidden="true" />

                  <button
                    type="button"
                    aria-label={`Delete ${property.title}`}
                    title="Delete property"
                    className="
                      flex
                      size-9
                      items-center
                      justify-center
                      text-muted-foreground
                      transition-colors
                      hover:bg-destructive/10
                      hover:text-destructive
                      focus-visible:z-10
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-destructive
                      focus-visible:ring-inset
                    "
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </figure>
          </Link>

          <div className="absolute bottom-3 right-3 z-20">
            <PropertyFavorite propertyId={property.id} />
          </div>
        </div>

        <Link
          href={`/properties/${property.id}`}
          aria-label={`View ${property.title}`}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col p-4">
            <header>
              <div className="mb-2 flex items-start justify-between gap-3">
                <h2
                  className="
                    min-w-0
                    flex-1
                    line-clamp-1
                    text-base
                    font-semibold
                    text-foreground
                  "
                >
                  {property.title}
                </h2>

                <Badge variant="outline" className="shrink-0">
                  {property.propertyType}
                </Badge>
              </div>

              <address
                className="
                  flex
                  items-center
                  gap-1.5
                  not-italic
                  text-sm
                  text-muted-foreground
                "
              >
                <MapPin className="size-4 shrink-0" aria-hidden="true" />

                <span className="line-clamp-1">
                  {property.location}, {property.city}
                </span>
              </address>
            </header>

            <p className="mt-4 text-lg font-bold text-foreground">
              ₹{Number(property.price).toLocaleString("en-IN")}
              {!isForSale && (
                <span
                  className="
                    ml-1
                    text-sm
                    font-normal
                    text-muted-foreground
                  "
                >
                  / month
                </span>
              )}
            </p>

            <dl
              className="
                mt-4
                grid
                min-h-12
                grid-cols-3
                gap-2
                text-sm
                text-muted-foreground
              "
            >
              <div className="flex min-w-0 items-start gap-1.5">
                <dt className="sr-only">Bedrooms</dt>

                <BedDouble
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />

                <dd className="line-clamp-2">{bedrooms}</dd>
              </div>

              <div className="flex min-w-0 items-start gap-1.5">
                <dt className="sr-only">Bathrooms</dt>

                <Bath className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

                <dd className="line-clamp-2">{bathrooms}</dd>
              </div>

              <div className="flex min-w-0 items-start gap-1.5">
                <dt className="sr-only">Area</dt>

                <Ruler className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

                <dd className="line-clamp-2">{area}</dd>
              </div>
            </dl>

            <div
              className="
                mt-auto
                flex
                min-h-10
                items-center
                gap-1.5
                border-t
                border-border
                pt-3
                text-sm
                text-muted-foreground
              "
            >
              <UserRound className="size-4 shrink-0" aria-hidden="true" />

              <span className="truncate">
                Owner:{" "}
                <span className="font-medium text-foreground">
                  {property.user?.name ?? "Unknown"}
                </span>
              </span>
            </div>
          </div>
        </Link>
      </article>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete property?"
        description={`Are you sure you want to delete "${property.title}"? This action cannot be undone.`}
        confirmText="Delete property"
        cancelText="Cancel"
        variant="danger"
        loading={deletePropertyMutation.isPending}
        loadingText="Deleting..."
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deletePropertyMutation.isPending) {
            setIsDeleteDialogOpen(false);
          }
        }}
      />
    </>
  );
}
