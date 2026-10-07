"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import OptimizedImage from "@/components/ui/optimized-image";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images.length) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm text-muted-foreground">
        No property images available
      </div>
    );
  }

  const activeImage = images[activeIndex];

  function previousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      const gallery = document.getElementById("property-image-gallery");

      if (gallery) {
        await gallery.requestFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement !== null);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      id="property-image-gallery"
      className={`
        space-y-3
        ${
          isFullscreen
            ? "flex min-h-screen flex-col justify-center bg-background p-4 sm:p-8"
            : ""
        }
      `}
    >
      <div
        className={`
          relative overflow-hidden bg-surface
          ${
            isFullscreen
              ? "mx-auto aspect-[16/9] w-full max-w-7xl rounded-2xl"
              : "aspect-[16/9] rounded-2xl"
          }
        `}
      >
        <OptimizedImage
          src={activeImage}
          alt={`${title} - Image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          quality={85}
        />

        {/* Previous / Next */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Fullscreen */}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={
            isFullscreen ? "Exit fullscreen" : "Open image gallery fullscreen"
          }
          className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isFullscreen ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="size-4" aria-hidden="true" />
          )}
        </button>

        {/* Image counter */}
        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && !isFullscreen && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`
                relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition
                ${
                  index === activeIndex
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                }
              `}
            >
              <OptimizedImage
                src={image}
                alt=""
                fill
                sizes="112px"
                quality={70}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
