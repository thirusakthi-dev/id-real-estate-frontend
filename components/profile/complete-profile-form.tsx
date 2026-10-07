"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { MapPin, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/icons/social-icons";

import { showToast } from "@/hooks/use-toast";
import { updateProfile } from "@/services/auth.service";
import { completeProfileSchema } from "@/lib/validation/auth";

type FormErrors = {
  name?: string;
  phone?: string;
  bio?: string;
  city?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
};

export default function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/profile";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: keyof FormErrors) {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handlePhoneChange(
    value: string,
    setter: (value: string) => void,
    field: "phone" | "whatsapp",
  ) {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);

    setter(digitsOnly);
    clearError(field);
  }

  function handleTextChange(
    value: string,
    setter: (value: string) => void,
    field: keyof FormErrors,
  ) {
    setter(value);
    clearError(field);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrors({});

    const result = completeProfileSchema.safeParse({
      name: name.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      city: city.trim(),
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      linkedin: linkedin.trim(),
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        bio: fieldErrors.bio?.[0],
        city: fieldErrors.city?.[0],
        whatsapp: fieldErrors.whatsapp?.[0],
        instagram: fieldErrors.instagram?.[0],
        facebook: fieldErrors.facebook?.[0],
        linkedin: fieldErrors.linkedin?.[0],
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateProfile({
        name: result.data.name,
        phone: result.data.phone,
        bio: result.data.bio,
        city: result.data.city,
        whatsapp: result.data.whatsapp || undefined,
        instagram: result.data.instagram || undefined,
        facebook: result.data.facebook || undefined,
        linkedin: result.data.linkedin || undefined,
      });

      console.log("Profile updated:", response);

      showToast({
        type: "success",
        title: "Profile completed",
        message: "Your profile has been updated successfully.",
      });

      router.push(redirect);
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);

      showToast({
        type: "error",
        title: "Unable to update profile",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-4 py-10 sm:px-6 lg:py-14">
      <section className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Complete your profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add your details so people can know more about you when viewing
              your properties.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Basic information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                These details are required for your owner profile.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <Input
                  id="name"
                  name="name"
                  label="Full name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) =>
                    handleTextChange(event.target.value, setName, "name")
                  }
                  startIcon={
                    <UserRound className="size-4" aria-hidden="true" />
                  }
                  autoComplete="name"
                  required
                />

                {errors.name && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  label="Phone"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(event) =>
                    handlePhoneChange(event.target.value, setPhone, "phone")
                  }
                  autoComplete="tel"
                  required
                />

                {errors.phone && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* City */}
            <div>
              <Input
                id="city"
                name="city"
                label="City"
                placeholder="Chennai"
                value={city}
                onChange={(event) =>
                  handleTextChange(event.target.value, setCity, "city")
                }
                startIcon={<MapPin className="size-4" aria-hidden="true" />}
                required
              />

              {errors.city && (
                <p className="mt-1.5 text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                About you
                <span className="ml-1 text-destructive">*</span>
              </label>

              <textarea
                id="bio"
                name="bio"
                rows={4}
                maxLength={500}
                placeholder="Tell people a little about yourself..."
                value={bio}
                onChange={(event) =>
                  handleTextChange(event.target.value, setBio, "bio")
                }
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />

              <div className="mt-1 flex items-center justify-between">
                {errors.bio ? (
                  <p className="text-sm text-destructive">{errors.bio}</p>
                ) : (
                  <span />
                )}

                <p className="text-xs text-muted-foreground">
                  {bio.length}/500
                </p>
              </div>
            </div>

            {/* Social / Contact */}
            <div className="border-t border-border pt-6">
              <h2 className="text-base font-semibold text-foreground">
                Contact & social links
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                These fields are optional. Add the contact methods you want to
                share with people interested in your properties.
              </p>

              <div className="mt-5 space-y-5">
                {/* WhatsApp */}
                <div>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    label="WhatsApp"
                    placeholder="9876543210"
                    value={whatsapp}
                    onChange={(event) =>
                      handlePhoneChange(
                        event.target.value,
                        setWhatsapp,
                        "whatsapp",
                      )
                    }
                    startIcon={
                      <WhatsappIcon className="size-4" aria-hidden="true" />
                    }
                  />

                  {errors.whatsapp && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                {/* Instagram */}
                <div>
                  <Input
                    id="instagram"
                    name="instagram"
                    type="url"
                    label="Instagram"
                    placeholder="https://instagram.com/username"
                    value={instagram}
                    onChange={(event) =>
                      handleTextChange(
                        event.target.value,
                        setInstagram,
                        "instagram",
                      )
                    }
                    startIcon={
                      <InstagramIcon className="size-4" aria-hidden="true" />
                    }
                  />

                  {errors.instagram && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.instagram}
                    </p>
                  )}
                </div>

                {/* Facebook */}
                <div>
                  <Input
                    id="facebook"
                    name="facebook"
                    type="url"
                    label="Facebook"
                    placeholder="https://facebook.com/username"
                    value={facebook}
                    onChange={(event) =>
                      handleTextChange(
                        event.target.value,
                        setFacebook,
                        "facebook",
                      )
                    }
                    startIcon={
                      <FacebookIcon className="size-4" aria-hidden="true" />
                    }
                  />

                  {errors.facebook && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.facebook}
                    </p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(event) =>
                      handleTextChange(
                        event.target.value,
                        setLinkedin,
                        "linkedin",
                      )
                    }
                    startIcon={
                      <LinkedinIcon className="size-4" aria-hidden="true" />
                    }
                  />

                  {errors.linkedin && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.linkedin}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(redirect)}
                disabled={isSubmitting}
              >
                Skip for now
              </Button>

              <Button
                type="submit"
                loading={isSubmitting}
                loadingText="Saving..."
              >
                Complete profile
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
