"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import PropertyForm from "@/components/property/property-form";

export default function NewPropertyPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link href="/profile">
            <Button
              type="button"
              variant="ghost"
              startIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            >
              Back to profile
            </Button>
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
              aria-hidden="true"
            >
              <Building2 className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">
                Property management
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Add a new property
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create a complete property listing with accurate details,
                pricing and high-quality photos.
              </p>
            </div>
          </div>
        </header>

        <PropertyForm onSuccess={handleSuccess} />
      </section>
    </main>
  );
}
