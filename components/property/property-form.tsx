"use client";

import { Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import Button from "@/components/ui/button";
import Toast from "@/components/ui/toast";
import PropertyImageUpload from "@/components/property/property-image-upload";

import PropertyFormFields, {
  type PropertyFormState,
} from "@/components/property/property-form-fields";

import {
  propertyFormSchema,
  type PropertyFormValues,
} from "@/lib/validation/property";

import {
  createProperty,
  updateProperty,
  type CreatePropertyPayload,
  type UpdatePropertyPayload,
} from "@/services/property.service";

import { showToast } from "@/hooks/use-toast";

import type { Property } from "@/types/property";

type PropertyFormProps = {
  property?: Property;
  onSuccess?: () => void;
};

const INITIAL_FORM: PropertyFormState = {
  title: "",
  description: "",
  price: "",
  location: "",
  city: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  propertyType: "",
  listingType: "",
};

function toOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  return Number(value);
}

function getBackendError(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Something went wrong. Please try again.";
  }

  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Array<{
          path?: (string | number)[];
          message?: string;
        }>;
      };
    };
  };

  const data = axiosError.response?.data;

  if (data?.errors?.length) {
    return data.errors
      .map((item) => {
        const field = item.path?.length
          ? item.path.map(String).join(".")
          : "Property";

        return `${field}: ${item.message ?? "Invalid value"}`;
      })
      .join(" • ");
  }

  if (data?.message) {
    return data.message;
  }

  return "Something went wrong. Please try again.";
}

function getInitialForm(property?: Property): PropertyFormState {
  if (!property) {
    return INITIAL_FORM;
  }

  return {
    title: property.title ?? "",
    description: property.description ?? "",
    price: property.price != null ? String(property.price) : "",
    location: property.location ?? "",
    city: property.city ?? "",
    bedrooms: property.bedrooms != null ? String(property.bedrooms) : "",
    bathrooms: property.bathrooms != null ? String(property.bathrooms) : "",
    area: property.area != null ? String(property.area) : "",
    propertyType: property.propertyType ?? "",
    listingType: property.listingType ?? "",
  };
}

export default function PropertyForm({
  property,
  onSuccess,
}: PropertyFormProps) {
  const isEditMode = Boolean(property);

  const [form, setForm] = useState<PropertyFormState>(getInitialForm(property));

  const [images, setImages] = useState<File[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!property) {
      return;
    }

    setForm(getInitialForm(property));
  }, [property]);

  function updateField(field: keyof PropertyFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = {
        ...current,
      };

      delete next[field];

      return next;
    });
  }

  function getFormValues(): PropertyFormValues {
    return {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      location: form.location,
      city: form.city,
      bedrooms: toOptionalNumber(form.bedrooms),
      bathrooms: toOptionalNumber(form.bathrooms),
      area: toOptionalNumber(form.area),
      propertyType: form.propertyType as PropertyFormValues["propertyType"],
      listingType: form.listingType as PropertyFormValues["listingType"],
    };
  }

  function validateForm(): PropertyFormValues | null {
    const result = propertyFormSchema.safeParse(getFormValues());

    if (result.success) {
      setErrors({});
      return result.data;
    }

    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0];

      if (typeof field === "string") {
        fieldErrors[field] ??= issue.message;
      }
    });

    setErrors(fieldErrors);

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = validateForm();

    if (!values) {
      showToast({
        type: "error",
        title: "Invalid form",
        message: "Please check the highlighted fields and try again.",
      });

      return;
    }

    if (!isEditMode && !images.length) {
      showToast({
        type: "warning",
        title: "Property image required",
        message: "Please add at least one property image.",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && property) {
        const payload: UpdatePropertyPayload = {
          title: values.title,
          description: values.description || undefined,
          price: values.price,
          location: values.location,
          city: values.city,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          area: values.area,
          propertyType: values.propertyType,
          listingType: values.listingType,
          images,
        };

        await updateProperty(property.id, payload);

        showToast({
          type: "success",
          title: "Property updated",
          message: "Your property has been updated successfully.",
        });
      } else {
        const payload: CreatePropertyPayload = {
          title: values.title,
          description: values.description || undefined,
          price: values.price,
          location: values.location,
          city: values.city,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          area: values.area,
          propertyType: values.propertyType,
          listingType: values.listingType,
          images,
        };

        await createProperty(payload);

        showToast({
          type: "success",
          title: "Property created",
          message: "Your property has been listed successfully.",
        });
      }

      onSuccess?.();
    } catch (error) {
      showToast({
        type: "error",
        title: isEditMode
          ? "Unable to update property"
          : "Unable to create property",
        message: getBackendError(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <PropertyFormFields form={form} errors={errors} onChange={updateField} />

      <fieldset className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
        <legend className="sr-only">Property photos</legend>

        <PropertyImageUpload
          value={images}
          existingImages={property?.images ?? []}
          onChange={setImages}
        />
      </fieldset>

      <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={isSubmitting}
          loadingText={
            isEditMode ? "Updating property..." : "Creating property..."
          }
          startIcon={
            !isSubmitting ? (
              <Save className="size-4" aria-hidden="true" />
            ) : undefined
          }
        >
          {isEditMode ? "Update property" : "Create property"}
        </Button>
      </footer>
    </form>
  );
}
