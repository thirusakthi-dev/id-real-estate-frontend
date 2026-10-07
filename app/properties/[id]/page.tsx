import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";

import PropertyInfo from "@/components/property/property-info";
import ImageGallery from "@/components/ui/image-gallery";
import PageMotion from "@/components/ui/page-motion";

import { createMetadata } from "@/lib/metadata";
import { getPropertyById } from "@/services/property.service";
import Button from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";

type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getPropertyById(Number(id));

    const description =
      property.description ??
      `${property.title} in ${property.city}. Explore this property for ${
        property.listingType === "SALE" ? "sale" : "rent"
      }.`;

    return createMetadata({
      title: property.title,
      description,
      image: property.images?.[0],
    });
  } catch {
    return createMetadata({
      title: "Property Not Found",
      description: "The property you are looking for could not be found.",
    });
  }
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    notFound();
  }

  let property;

  try {
    property = await getPropertyById(propertyId);
  } catch {
    notFound();
  }

  if (!property) {
    notFound();
  }

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-5 lg:px-8 lg:py-9">
        <BackButton  />
        {/* Gallery */}
        <PageMotion>
          <ImageGallery images={property.images} title={property.title} />
        </PageMotion>

        <div className="mt-8">
          {/* Main content */}
          <article className="min-w-0">
            <PageMotion delay={0.05}>
              <PropertyInfo property={property} />
            </PageMotion>
          </article>
        </div>
      </div>
    </main>
  );
}
