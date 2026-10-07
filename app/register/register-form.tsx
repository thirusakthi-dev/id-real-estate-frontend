"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { showToast } from "@/hooks/use-toast";
import { useRegister } from "@/hooks/use-auth";
import { registerSchema } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";

  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          (field === "name" ||
            field === "email" ||
            field === "password" ||
            field === "confirmPassword") &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);

      return;
    }

    registerMutation.mutate(
      {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      },
      {
        onSuccess: () => {
          showToast({
            type: "success",
            title: "Account created",
            message: "Your account has been created successfully.",
          });

          router.push(
            `/login?redirect=${encodeURIComponent(
              `/profile/complete?redirect=${encodeURIComponent(redirect)}`,
            )}`,
          );
        },
      },
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <section aria-labelledby="register-title" className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <header className="mb-8">
            <h1
              id="register-title"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Create your account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Create an account to manage properties and favorites.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <Input
                id="name"
                name="name"
                label="Full name"
                placeholder="Your name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    name: undefined,
                  }));
                }}
                startIcon={<UserRound className="size-4" aria-hidden="true" />}
                autoComplete="name"
                required
              />

              {errors.name && (
                <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    email: undefined,
                  }));
                }}
                startIcon={<Mail className="size-4" aria-hidden="true" />}
                autoComplete="email"
                required
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                  }}
                  startIcon={
                    <LockKeyhole className="size-4" aria-hidden="true" />
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-[38px] rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      confirmPassword: undefined,
                    }));
                  }}
                  startIcon={
                    <LockKeyhole className="size-4" aria-hidden="true" />
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-9 rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              loading={registerMutation.isPending}
              loadingText="Creating account..."
              className="w-full"
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
              }
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
