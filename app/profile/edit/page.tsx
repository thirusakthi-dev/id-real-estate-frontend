"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Save } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/icons/social-icons";

import {
  changePasswordSchema,
  editProfileSchema,
  type ChangePasswordFormData,
  type EditProfileFormData,
} from "@/lib/validation/auth";

import {
  useChangePassword,
  useCurrentUser,
  useUpdateProfile,
} from "@/hooks/use-auth";

import { showToast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const router = useRouter();

  const { user, isLoggedIn, isLoading: isUserLoading } = useCurrentUser();

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileFormRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  const [profileForm, setProfileForm] = useState<EditProfileFormData>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    city: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileErrors, setProfileErrors] = useState<
    Partial<Record<keyof EditProfileFormData, string>>
  >({});

  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent("/profile/edit")}`);
    }
  }, [isUserLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      city: user.city ?? "",
      whatsapp: user.whatsapp ?? "",
      instagram: user.instagram ?? "",
      facebook: user.facebook ?? "",
      linkedin: user.linkedin ?? "",
    });
  }, [user]);

  function updateProfileField(field: keyof EditProfileFormData, value: string) {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));

    setProfileErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function updatePasswordField(
    field: keyof ChangePasswordFormData,
    value: string,
  ) {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handlePhoneChange(field: "phone" | "whatsapp", value: string) {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);

    updateProfileField(field, digitsOnly);
  }

  function focusField(
    formRef: React.RefObject<HTMLFormElement | null>,
    field: string,
  ) {
    requestAnimationFrame(() => {
      const element = formRef.current?.querySelector<HTMLElement>(
        `[name="${field}"]`,
      );

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      window.setTimeout(() => {
        element.focus();
      }, 250);
    });
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = editProfileSchema.safeParse({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      bio: profileForm.bio.trim(),
      city: profileForm.city.trim(),
      whatsapp: profileForm.whatsapp.trim(),
      instagram: profileForm.instagram.trim(),
      facebook: profileForm.facebook.trim(),
      linkedin: profileForm.linkedin.trim(),
    });

    if (!result.success) {
      const errors: Partial<Record<keyof EditProfileFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EditProfileFormData;

        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      setProfileErrors(errors);

      const firstInvalidField = result.error.issues[0]?.path[0];

      if (firstInvalidField) {
        focusField(profileFormRef, String(firstInvalidField));
      }

      return;
    }

    setProfileErrors({});

    updateProfileMutation.mutate(result.data, {
      onSuccess: () => {
        showToast({
          type: "success",
          title: "Profile updated",
          message: "Your profile has been updated successfully.",
        });

        router.push("/profile");
        router.refresh();
      },

      onError: (error) => {
        showToast({
          type: "error",
          title: "Update failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to update your profile. Please try again.",
        });
      },
    });
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = changePasswordSchema.safeParse({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    });

    if (!result.success) {
      const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ChangePasswordFormData;

        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      setPasswordErrors(errors);

      const firstInvalidField = result.error.issues[0]?.path[0];

      if (firstInvalidField) {
        focusField(passwordFormRef, String(firstInvalidField));
      }

      return;
    }

    setPasswordErrors({});

    changePasswordMutation.mutate(
      {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
      {
        onSuccess: () => {
          showToast({
            type: "success",
            title: "Password changed",
            message: "Your password has been changed successfully.",
          });

          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        },

        onError: (error) => {
          showToast({
            type: "error",
            title: "Password change failed",
            message:
              error instanceof Error
                ? error.message
                : "Unable to change your password. Please try again.",
          });
        },
      },
    );
  }

  if (isUserLoading) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-40 rounded-lg bg-muted" />
            <div className="h-96 rounded-2xl bg-muted" />
            <div className="h-72 rounded-2xl bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to profile
          </button>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Edit profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Update your personal information and contact details.
          </p>
        </header>

        {/* Profile */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Keep your profile information up to date.
            </p>
          </div>

          <form
            ref={profileFormRef}
            onSubmit={handleProfileSubmit}
            noValidate
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                name="name"
                value={profileForm.name}
                onChange={(event) =>
                  updateProfileField("name", event.target.value)
                }
                error={profileErrors.name}
                placeholder="Your full name"
                autoComplete="name"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={(event) =>
                  updateProfileField("email", event.target.value)
                }
                error={profileErrors.email}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Input
                label="Phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={profileForm.phone}
                onChange={(event) =>
                  handlePhoneChange("phone", event.target.value)
                }
                error={profileErrors.phone}
                placeholder="10-digit phone number"
                autoComplete="tel"
              />

              <Input
                label="City"
                name="city"
                value={profileForm.city}
                onChange={(event) =>
                  updateProfileField("city", event.target.value)
                }
                error={profileErrors.city}
                placeholder="Chennai"
                autoComplete="address-level2"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                value={profileForm.bio}
                onChange={(event) =>
                  updateProfileField("bio", event.target.value)
                }
                placeholder="Tell people a little about yourself..."
                rows={5}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <div className="mt-1 flex min-h-5 justify-between gap-4">
                <p className="text-sm text-destructive">{profileErrors.bio}</p>

                <span className="text-xs text-muted-foreground">
                  {profileForm.bio.length}/500
                </span>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="border-t border-border pt-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  Contact & social
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add optional ways for people to connect with you.
                </p>
              </div>

              <div className="space-y-5">
                {/* WhatsApp */}
                <Input
                  label="WhatsApp"
                  name="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={profileForm.whatsapp}
                  onChange={(event) =>
                    handlePhoneChange("whatsapp", event.target.value)
                  }
                  error={profileErrors.whatsapp}
                  placeholder="10-digit WhatsApp number"
                  startIcon={
                    <WhatsappIcon className="size-4" aria-hidden="true" />
                  }
                />

                {/* Social Links */}
                <div className="grid gap-5 sm:grid-cols-3">
                  <Input
                    label="Instagram"
                    name="instagram"
                    value={profileForm.instagram}
                    onChange={(event) =>
                      updateProfileField("instagram", event.target.value)
                    }
                    error={profileErrors.instagram}
                    placeholder="instagram.com/username"
                    startIcon={
                      <InstagramIcon className="size-4" aria-hidden="true" />
                    }
                  />

                  <Input
                    label="Facebook"
                    name="facebook"
                    value={profileForm.facebook}
                    onChange={(event) =>
                      updateProfileField("facebook", event.target.value)
                    }
                    error={profileErrors.facebook}
                    placeholder="facebook.com/username"
                    startIcon={
                      <FacebookIcon className="size-4" aria-hidden="true" />
                    }
                  />

                  <Input
                    label="LinkedIn"
                    name="linkedin"
                    value={profileForm.linkedin}
                    onChange={(event) =>
                      updateProfileField("linkedin", event.target.value)
                    }
                    error={profileErrors.linkedin}
                    placeholder="linkedin.com/in/username"
                    startIcon={
                      <LinkedinIcon className="size-4" aria-hidden="true" />
                    }
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end border-t border-border pt-6">
              <Button
                type="submit"
                loading={updateProfileMutation.isPending}
                loadingText="Saving..."
                startIcon={<Save className="size-4" aria-hidden="true" />}
              >
                Save changes
              </Button>
            </div>
          </form>
        </section>

        {/* Password */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Lock className="size-5" aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Change password
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose a strong password you do not use elsewhere.
              </p>
            </div>
          </div>

          <form
            ref={passwordFormRef}
            onSubmit={handlePasswordSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Current Password */}
            <div className="relative">
              <Input
                label="Current password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  updatePasswordField("currentPassword", event.target.value)
                }
                error={passwordErrors.currentPassword}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((current) => !current)}
                className="absolute right-3 bottom-2  inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* New Password */}
              <div className="relative">
                <Input
                  label="New password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    updatePasswordField("newPassword", event.target.value)
                  }
                  error={passwordErrors.newPassword}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((current) => !current)}
                  className="absolute right-3 top-2  inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm new password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    updatePasswordField("confirmPassword", event.target.value)
                  }
                  error={passwordErrors.confirmPassword}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-3 top-2 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex justify-end border-t border-border pt-6">
              <Button
                type="submit"
                variant="outline"
                loading={changePasswordMutation.isPending}
                loadingText="Changing..."
                startIcon={<Lock className="size-4" aria-hidden="true" />}
              >
                Change password
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
