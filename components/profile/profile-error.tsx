"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

import Button from "@/components/ui/button";

export default function ProfileError() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section
        role="alert"
        className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-sm"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
        >
          <AlertCircle className="size-7" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-foreground">
          Unable to load profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We couldn't load your account information. Please try again or sign in
          again.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={() => window.location.reload()}>
            Try Again
          </Button>

          <Link href="/login">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Login
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
