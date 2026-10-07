"use client";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ruler,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PropertyFavorite from "@/components/property/property-favorite";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/icons/social-icons";

import { useDeleteProperty } from "@/hooks/use-properties";
import { showToast } from "@/hooks/use-toast";

import type { Property } from "@/types/property";

type PropertyInfoProps = {
  property: Property;
};

type PropertyDetailProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

type JwtPayload = {
  id?: number | string;
  userId?: number | string;
};

function PropertyDetail({ icon, label, value }: PropertyDetailProps) {
  const isNotSpecified = value === "Not specified";

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition-colors hover:bg-surface-hover">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border">
        {icon}
      </span>

      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>

        <dd
          className={`mt-1 truncate text-sm ${
            isNotSpecified
              ? "font-normal text-muted-foreground"
              : "font-semibold text-foreground"
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as JwtPayload;

    const userId = decoded.userId ?? decoded.id;
    const parsedUserId = Number(userId);

    return Number.isInteger(parsedUserId) ? parsedUserId : null;
  } catch {
    return null;
  }
}

function normalizeUrl(url?: string | null) {
  if (!url?.trim()) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url.trim() : `https://${url.trim()}`;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const router = useRouter();

  const deletePropertyMutation = useDeleteProperty();

  const [isOwner, setIsOwner] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const userId = getUserIdFromToken();

    setIsOwner(userId === property.userId);
  }, [property.userId]);

  const isSale = property.listingType === "SALE";
  const owner = property.user;

  const bedrooms =
    property.bedrooms !== null && property.bedrooms !== undefined
      ? `${property.bedrooms} ${
          property.bedrooms === 1 ? "Bedroom" : "Bedrooms"
        }`
      : "Not specified";

  const bathrooms =
    property.bathrooms !== null && property.bathrooms !== undefined
      ? `${property.bathrooms} ${
          property.bathrooms === 1 ? "Bathroom" : "Bathrooms"
        }`
      : "Not specified";

  const area =
    property.area !== null && property.area !== undefined
      ? `${Number(property.area).toLocaleString("en-IN")} sq.ft`
      : "Not specified";

  const whatsapp = owner?.whatsapp?.trim();
  const instagram = owner?.instagram?.trim();
  const facebook = owner?.facebook?.trim();
  const linkedin = owner?.linkedin?.trim();

  function handleEdit() {
    router.push(`/properties/${property.id}/edit`);
  }

  function handleDeleteClick() {
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteCancel() {
    if (deletePropertyMutation.isPending) {
      return;
    }

    setIsDeleteDialogOpen(false);
  }

  function handleDeleteConfirm() {
    deletePropertyMutation.mutate(property.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);

        showToast({
          type: "success",
          title: "Property deleted",
          message: "The property has been deleted successfully.",
        });

        router.push("/profile");
        router.refresh();
      },

      onError: (error) => {
        showToast({
          type: "error",
          title: "Unable to delete property",
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        });
      },
    });
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3"></div>

      <section
        aria-labelledby="property-title"
        className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm"
      >
        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge variant={isSale ? "default" : "warning"}>
                {isSale ? "For Sale" : "For Rent"}
              </Badge>

              <Badge variant="outline">{property.propertyType}</Badge>

              {!property.isAvailable && (
                <Badge variant="destructive">Unavailable</Badge>
              )}
              {isOwner && <Badge variant="success">Your Property</Badge>}
            </div>

            <PropertyFavorite propertyId={property.id} />
          </div>

          {/* Title */}
          <div className="mt-6">
            <h1
              id="property-title"
              className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2.5rem]"
            >
              {property.title}
            </h1>

            <address className="mt-3 flex items-start gap-2 not-italic text-sm leading-6 text-muted-foreground sm:text-base">
              <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />

              <span>
                {property.location}, {property.city}
              </span>
            </address>
          </div>

          {/* Price */}
          <div className="mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2">
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ₹{Number(property.price).toLocaleString("en-IN")}
            </span>

            {!isSale && (
              <span className="text-sm text-muted-foreground">per month</span>
            )}
          </div>

          {property.description && (
            <div className="mt-7 border-y border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Property overview
              </p>

              <h2 className="mt-1 text-lg font-semibold text-foreground">
                About this property
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                {property.description}
              </p>
            </div>
          )}

          {/* Property Details */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-foreground">
              Property details
            </h2>

            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <PropertyDetail
                icon={<BedDouble className="size-5" aria-hidden="true" />}
                label="Bedrooms"
                value={bedrooms}
              />

              <PropertyDetail
                icon={<Bath className="size-5" aria-hidden="true" />}
                label="Bathrooms"
                value={bathrooms}
              />

              <PropertyDetail
                icon={<Ruler className="size-5" aria-hidden="true" />}
                label="Area"
                value={area}
              />
            </dl>
          </div>

          {/* Owner */}
          {owner && (
            <div className="mt-7 border-t border-border pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Property owner
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    {owner.name}
                  </h2>
                </div>

                {(whatsapp || instagram || facebook || linkedin) && (
                  <div className="flex shrink-0 gap-2">
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contact owner on WhatsApp"
                        title="WhatsApp"
                        className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                      >
                        <WhatsappIcon
                          className="size-[18px]"
                          aria-hidden="true"
                        />
                      </a>
                    )}

                    {instagram && (
                      <a
                        href={normalizeUrl(instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Owner's Instagram"
                        title="Instagram"
                        className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                      >
                        <InstagramIcon
                          className="size-[18px]"
                          aria-hidden="true"
                        />
                      </a>
                    )}

                    {facebook && (
                      <a
                        href={normalizeUrl(facebook)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Owner's Facebook"
                        title="Facebook"
                        className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                      >
                        <FacebookIcon
                          className="size-[18px]"
                          aria-hidden="true"
                        />
                      </a>
                    )}

                    {linkedin && (
                      <a
                        href={normalizeUrl(linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Owner's LinkedIn"
                        title="LinkedIn"
                        className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                      >
                        <LinkedinIcon
                          className="size-[18px]"
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Contact information */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {owner.email && (
                  <a
                    href={`mailto:${owner.email}`}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 transition-colors hover:bg-surface-hover"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border">
                      <Mail className="size-4" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>

                      <p className="truncate text-sm font-medium text-foreground">
                        {owner.email}
                      </p>
                    </div>
                  </a>
                )}

                {owner.phone && (
                  <a
                    href={`tel:${owner.phone}`}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 transition-colors hover:bg-surface-hover"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Phone</p>

                      <p className="truncate text-sm font-medium text-foreground">
                        {owner.phone}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                startIcon={<Pencil className="size-4" aria-hidden="true" />}
                onClick={handleEdit}
              >
                Edit property
              </Button>

              <Button
                type="button"
                variant="danger"
                startIcon={<Trash2 className="size-4" aria-hidden="true" />}
                onClick={handleDeleteClick}
              >
                Delete property
              </Button>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete property?"
        description="This property will be permanently deleted. This action cannot be undone."
        confirmText="Delete property"
        cancelText="Cancel"
        variant="danger"
        loading={deletePropertyMutation.isPending}
        loadingText="Deleting..."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
