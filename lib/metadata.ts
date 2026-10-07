import type { Metadata } from "next";

const SITE_NAME = "RealEstate";

const SITE_DESCRIPTION = "Find properties for sale and rent across India.";

type CreateMetadataOptions = {
  title: string;
  description?: string;
  image?: string;
};

export function createMetadata({
  title,
  description = SITE_DESCRIPTION,
  image,
}: CreateMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,

    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      ...(image && {
        images: [
          {
            url: image,
            alt: title,
          },
        ],
      }),
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && {
        images: [image],
      }),
    },
  };
}
