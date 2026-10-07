import type { Property } from "@/types/property";

import PropertyCard from "@/components/property/property-card";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";

type PropertyGridProps = {
  properties: Property[];
  isLoading?: boolean;
  skeletonCount?: number;
  isOwner?: boolean;
};

export default function PropertyGrid({
  properties,
  isLoading = false,
  skeletonCount = 6,
  isOwner = false,
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} isOwner={isOwner} />
      ))}
    </div>
  );
}
