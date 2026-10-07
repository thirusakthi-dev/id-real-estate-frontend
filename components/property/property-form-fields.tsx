"use client";

import { Building2, IndianRupee, MapPin, Ruler } from "lucide-react";

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

export type PropertyFormState = {
  title: string;
  description: string;
  price: string;
  location: string;
  city: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  propertyType: string;
  listingType: string;
};

type PropertyFormFieldsProps = {
  form: PropertyFormState;
  errors: Record<string, string>;
  onChange: (field: keyof PropertyFormState, value: string) => void;
};

const PROPERTY_TYPE_OPTIONS = [
  {
    label: "Apartment",
    value: "APARTMENT",
  },
  {
    label: "Villa",
    value: "VILLA",
  },
  {
    label: "House",
    value: "HOUSE",
  },
  {
    label: "Plot",
    value: "PLOT",
  },
  {
    label: "Office",
    value: "OFFICE",
  },
  {
    label: "Shop",
    value: "SHOP",
  },
];

const LISTING_TYPE_OPTIONS = [
  {
    label: "For Sale",
    value: "SALE",
  },
  {
    label: "For Rent",
    value: "RENT",
  },
];

export default function PropertyFormFields({
  form,
  errors,
  onChange,
}: PropertyFormFieldsProps) {
  return (
    <>
      {/* Property information */}

      <fieldset className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
        <legend className="sr-only">Property information</legend>

        <header className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Property information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tell people about the property.
          </p>
        </header>

        <div className="space-y-5">
          <Input
            id="property-title"
            name="title"
            label="Property title"
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            error={errors.title}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="property-city"
              name="city"
              label="City"
              value={form.city}
              onChange={(event) => onChange("city", event.target.value)}
              startIcon={<MapPin className="size-4" aria-hidden="true" />}
              error={errors.city}
            />

            <Input
              id="property-location"
              name="location"
              label="Location"
              value={form.location}
              onChange={(event) => onChange("location", event.target.value)}
              startIcon={<MapPin className="size-4" aria-hidden="true" />}
              error={errors.location}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Select
              value={form.propertyType}
              onValueChange={(value) => onChange("propertyType", value)}
              placeholder="Property type"
              options={PROPERTY_TYPE_OPTIONS}
              startIcon={<Building2 className="size-4" aria-hidden="true" />}
              error={errors.propertyType}
            />

            <Select
              value={form.listingType}
              onValueChange={(value) => onChange("listingType", value)}
              placeholder="Listing type"
              options={LISTING_TYPE_OPTIONS}
              error={errors.listingType}
            />
          </div>
        </div>
      </fieldset>

      {/* Property details */}

      <fieldset className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
        <legend className="sr-only">Property details</legend>

        <header className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Property details
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add pricing and specifications.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            id="property-price"
            name="price"
            label="Price"
            type="number"
            min="1"
            value={form.price}
            onChange={(event) => onChange("price", event.target.value)}
            startIcon={<IndianRupee className="size-4" aria-hidden="true" />}
            error={errors.price}
          />

          <Input
            id="property-area"
            name="area"
            label="Area (sq.ft)"
            type="number"
            min="1"
            value={form.area}
            onChange={(event) => onChange("area", event.target.value)}
            startIcon={<Ruler className="size-4" aria-hidden="true" />}
            error={errors.area}
          />

          <Input
            id="property-bedrooms"
            name="bedrooms"
            label="Bedrooms"
            type="number"
            min="1"
            value={form.bedrooms}
            onChange={(event) => onChange("bedrooms", event.target.value)}
            error={errors.bedrooms}
          />

          <Input
            id="property-bathrooms"
            name="bathrooms"
            label="Bathrooms"
            type="number"
            min="1"
            value={form.bathrooms}
            onChange={(event) => onChange("bathrooms", event.target.value)}
            error={errors.bathrooms}
          />
        </div>
      </fieldset>

      {/* Description */}

      <fieldset className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
        <legend className="sr-only">Property description</legend>

        <header className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Description</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Give buyers or renters more context.
          </p>
        </header>

        <Textarea
          id="property-description"
          name="description"
          label="Property description"
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          error={errors.description}
          maxLength={2000}
        />

        <p className="mt-2 text-right text-xs text-muted-foreground">
          {form.description.length}/2000
        </p>
      </fieldset>
    </>
  );
}
