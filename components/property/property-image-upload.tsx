"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PropertyImageUploadProps = {
  value: File[];
  existingImages?: string[];
  onChange: (files: File[]) => void;
  error?: string;
  maxImages?: number;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PropertyImageUpload({
  value,
  existingImages = [],
  onChange,
  error,
  maxImages = 10,
}: PropertyImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previews, setPreviews] = useState<
    {
      file: File;
      url: string;
    }[]
  >([]);

  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const nextPreviews = value.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [value]);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");

    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const totalImages = existingImages.length + value.length;

    const remaining = maxImages - totalImages;

    if (remaining <= 0) {
      setFileError(`Maximum ${maxImages} images allowed.`);
      event.target.value = "";
      return;
    }

    const invalidType = files.find(
      (file) => !ACCEPTED_TYPES.includes(file.type),
    );

    if (invalidType) {
      setFileError(
        `${invalidType.name} is not supported. Use JPG, PNG or WebP.`,
      );
      event.target.value = "";
      return;
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);

    if (oversized) {
      setFileError(`${oversized.name} is larger than 5MB.`);
      event.target.value = "";
      return;
    }

    const selected = files.slice(0, remaining);

    onChange([...value, ...selected]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  }

  const totalImages = existingImages.length + value.length;

  const canAddMore = totalImages < maxImages;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Property photos
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload clear images of your property.
          </p>
        </div>

        <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          {totalImages}/{maxImages}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Existing property images */}
        {existingImages.map((image, index) => (
          <figure
            key={`existing-${image}-${index}`}
            className="
              relative
              aspect-square
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-surface
            "
          >
            <img
              src={image}
              alt={`Property photo ${index + 1}`}
              className="h-full w-full object-cover"
            />

            {index === 0 && (
              <figcaption className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                Cover
              </figcaption>
            )}
          </figure>
        ))}

        {/* Newly selected images */}
        {previews.map((preview, index) => (
          <figure
            key={`${preview.file.name}-${index}`}
            className="
              relative
              aspect-square
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-surface
            "
          >
            <img
              src={preview.url}
              alt={`New property photo ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label={`Remove new property photo ${index + 1}`}
              className="
                absolute
                right-2
                top-2
                flex
                size-8
                items-center
                justify-center
                rounded-full
                bg-black/70
                text-white
                hover:bg-black
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
              "
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </figure>
        ))}

        {/* Add button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="
              flex
              aspect-square
              flex-col
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-dashed
              border-border
              bg-surface
              text-muted-foreground
              transition-colors
              hover:border-primary
              hover:bg-primary/5
              hover:text-primary
              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-primary/10
            "
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-background">
              <ImagePlus className="size-5" aria-hidden="true" />
            </span>

            <span className="text-xs font-medium">Add photos</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
        className="sr-only"
      />

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Upload className="size-3.5" aria-hidden="true" />

        <span>
          JPG, PNG or WebP · Maximum 5MB per image · Up to {maxImages} photos
        </span>
      </div>

      {(fileError || error) && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {fileError || error}
        </p>
      )}
    </div>
  );
}
