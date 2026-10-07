"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { showToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";
  const shouldFavorite = searchParams.get("favorite") === "true";

  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

      return;
    }

    loginMutation.mutate(result.data, {
      onSuccess: () => {
        showToast({
          type: "success",
          title: "Welcome back",
          message: "You have signed in successfully.",
        });

        if (shouldFavorite) {
          router.push(`${redirect}?favorite=true`);
        } else {
          router.push(redirect);
        }

        router.refresh();
      },
    });
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <section aria-labelledby="login-title" className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <header className="mb-8">
            <h1
              id="login-title"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to save properties and manage your favorites.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

            <div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
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
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
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

            <Button
              type="submit"
              loading={loginMutation.isPending}
              loadingText="Signing in..."
              className="w-full"
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/register?redirect=${encodeURIComponent(redirect)}`,
                )
              }
              className="font-medium text-primary hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
