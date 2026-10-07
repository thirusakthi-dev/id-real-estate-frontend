"use client";

import { Building2, IndianRupee, MapPin, RotateCcw, Tag } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";

export type FilterValues = {
  search: string;
  city: string;
  propertyType: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

type PropertyFiltersProps = {
  value?: FilterValues;
  onChange?: (filters: FilterValues) => void;
  onReset: () => void;
};

export const PROPERTY_TYPE_OPTIONS = [
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

const SORT_OPTIONS = [
  {
    label: "Latest",
    value: "latest",
  },
  {
    label: "Price: Low to High",
    value: "price_asc",
  },
  {
    label: "Price: High to Low",
    value: "price_desc",
  },
];

export const DEFAULT_FILTERS: FilterValues = {
  search: "",
  city: "",
  propertyType: "",
  listingType: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest",
};

export default function PropertyFilters({
  value = DEFAULT_FILTERS,
  onChange,
  onReset,
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(value);

  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  function updateFilter(key: keyof FilterValues, nextValue: string) {
    const updatedFilters: FilterValues = {
      ...localFilters,
      [key]: nextValue,
    };

    setLocalFilters(updatedFilters);
    onChange?.(updatedFilters);
  }

  function handleReset() {
    setLocalFilters(DEFAULT_FILTERS);
    onReset();
  }

  return (
    <div
      className="
        flex
        flex-col
        gap-3
        2xl:flex-row
        2xl:items-center
      "
    >
      {/* City */}
      <div className="min-w-0 flex-1">
        <Input
          id="property-city"
          name="city"
          label="City or location"
          value={localFilters.city}
          onChange={(event) => updateFilter("city", event.target.value)}
          startIcon={<MapPin className="size-4" aria-hidden="true" />}
        />
      </div>

      {/* Property Type */}
      <div className="min-w-0 flex-1">
        <Select
          value={localFilters.propertyType}
          onValueChange={(value) => updateFilter("propertyType", value)}
          placeholder="Property type"
          options={PROPERTY_TYPE_OPTIONS}
          startIcon={<Building2 className="size-4" aria-hidden="true" />}
        />
      </div>

      {/* Listing Type */}
      <div className="min-w-0 flex-1">
        <Select
          value={localFilters.listingType}
          onValueChange={(value) => updateFilter("listingType", value)}
          placeholder="Listing type"
          options={LISTING_TYPE_OPTIONS}
          startIcon={<Tag className="size-4" aria-hidden="true" />}
        />
      </div>

      {/* Minimum Price */}
      <div className="min-w-0 flex-1">
        <Input
          id="property-min-price"
          name="minPrice"
          label="Min price"
          type="number"
          min="0"
          value={localFilters.minPrice}
          onChange={(event) => updateFilter("minPrice", event.target.value)}
          startIcon={<IndianRupee className="size-4" aria-hidden="true" />}
        />
      </div>

      {/* Maximum Price */}
      <div className="min-w-0 flex-1">
        <Input
          id="property-max-price"
          name="maxPrice"
          label="Max price"
          type="number"
          min="0"
          value={localFilters.maxPrice}
          onChange={(event) => updateFilter("maxPrice", event.target.value)}
          startIcon={<IndianRupee className="size-4" aria-hidden="true" />}
        />
      </div>

      {/* Sort */}
      <div className="min-w-0 flex-1">
        <Select
          value={localFilters.sort}
          onValueChange={(value) => updateFilter("sort", value)}
          placeholder="Sort by"
          options={SORT_OPTIONS}
        />
      </div>

      {/* Clear Filters */}
      <Button
        type="button"
        variant="secondary"
        onClick={handleReset}
        startIcon={<RotateCcw className="size-4 shrink-0" aria-hidden="true" />}
        className="
          w-full
          shrink-0
          whitespace-nowrap
          2xl:w-auto
        "
      >
        Clear filters
      </Button>
    </div>
  );
}
