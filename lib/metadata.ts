import type { Metadata } from "next";

const SITE_NAME = "ID Real Estate";

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

    icons: {
      icon: [
        {
          url: "/favicon-32x32.png",
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: "/favicon-16x16.png",
          type: "image/png",
          sizes: "16x16",
        },
      ],
      apple: "/icons/icon-192.png",
    },

    manifest: "/manifest.webmanifest",

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
