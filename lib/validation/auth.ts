import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

const socialUrlSchema = (platform: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        const normalized = /^https?:\/\//i.test(value)
          ? value
          : `https://${value}`;

        try {
          const url = new URL(normalized);

          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: `Enter a valid ${platform} URL`,
      },
    );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const completeProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City must not exceed 100 characters"),

  whatsapp: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit WhatsApp number")
    .optional()
    .or(z.literal("")),

  instagram: z
    .string()
    .trim()
    .url("Enter a valid Instagram URL")
    .optional()
    .or(z.literal("")),

  facebook: z
    .string()
    .trim()
    .url("Enter a valid Facebook URL")
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
});

/* ---------------------------------- */
/* Edit Profile                       */
/* ---------------------------------- */

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z.string().trim().email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),

  whatsapp: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^[0-9]{10}$/.test(value),
      "WhatsApp number must be exactly 10 digits",
    ),

  instagram: socialUrlSchema("Instagram"),

  facebook: socialUrlSchema("Facebook"),

  linkedin: socialUrlSchema("LinkedIn"),
});

/* ---------------------------------- */
/* Change Password                    */
/* ---------------------------------- */

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
