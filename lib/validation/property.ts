import { z } from "zod";

export const PROPERTY_TYPES = [
  "APARTMENT",
  "VILLA",
  "HOUSE",
  "PLOT",
  "OFFICE",
  "SHOP",
] as const;

export const LISTING_TYPES = ["SALE", "RENT"] as const;

export const propertyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),

  price: z
    .number({
      error: "Price is required",
    })
    .positive("Price must be greater than 0"),

  location: z.string().trim().min(2, "Location is required"),

  city: z.string().trim().min(2, "City is required"),

  bedrooms: z
    .number()
    .int("Bedrooms must be a whole number")
    .positive("Bedrooms must be greater than 0")
    .optional(),

  bathrooms: z
    .number()
    .int("Bathrooms must be a whole number")
    .positive("Bathrooms must be greater than 0")
    .optional(),

  area: z
    .number()
    .int("Area must be a whole number")
    .positive("Area must be greater than 0")
    .optional(),

  propertyType: z.enum(PROPERTY_TYPES, {
    error: "Property type is required",
  }),

  listingType: z.enum(LISTING_TYPES, {
    error: "Listing type is required",
  }),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
