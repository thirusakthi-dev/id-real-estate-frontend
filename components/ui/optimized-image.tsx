"use client";

import Image, { type ImageProps } from "next/image";
import { Building2 } from "lucide-react";
import { useState } from "react";

type OptimizedImageProps = ImageProps & {
  containerClassName?: string;
};

export default function OptimizedImage({
  containerClassName = "",
  className = "",
  src,
  alt,
  ...props
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex h-full min-h-32 w-full items-center justify-center bg-surface text-muted-foreground ${containerClassName}`}
        role="img"
        aria-label={alt || "Property image unavailable"}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-surface-hover">
            <Building2 className="size-6" aria-hidden="true" />
          </div>

          <span className="text-sm font-medium">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-surface ${containerClassName}`}
    >
      <Image
        {...props}
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
