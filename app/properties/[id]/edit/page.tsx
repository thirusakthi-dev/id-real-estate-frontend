"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/button";
import PropertyForm from "@/components/property/property-form";
import { useProperty } from "@/hooks/use-properties";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const propertyId = Number(params.id);

  const { data: property, isLoading, isError } = useProperty(propertyId);

  async function handleSuccess() {
    await queryClient.invalidateQueries({
      queryKey: ["properties"],
    });

    router.push("/profile");
  }
  if (isLoading) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-32 rounded-lg bg-surface-hover" />

            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-surface-hover" />
              <div className="h-8 w-72 rounded bg-surface-hover" />
              <div className="h-5 w-full max-w-2xl rounded bg-surface-hover" />
            </div>

            <div className="h-96 rounded-2xl bg-surface-hover" />
          </div>
        </section>
      </main>
    );
  }

  if (isError || !property) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-8 text-center sm:px-6 lg:px-8">
          <Building2 className="size-10 text-muted-foreground" />

          <h1 className="mt-4 text-xl font-semibold text-foreground">
            Property not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This property may have been deleted or you may not have permission
            to edit it.
          </p>

          <Link href="/profile" className="mt-6">
            <Button
              type="button"
              startIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            >
              Back to profile
            </Button>
          </Link>
        </section>
      </main>
    );
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
                Edit property
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Update your property details, pricing and photos.
              </p>
            </div>
          </div>
        </header>

        <PropertyForm property={property} onSuccess={handleSuccess} />
      </section>
    </main>
  );
}
