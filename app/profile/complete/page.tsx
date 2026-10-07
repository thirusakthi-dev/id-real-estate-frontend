import { Suspense } from "react";

import CompleteProfileForm from "@/components/profile/complete-profile-form";

function CompleteProfileFallback() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-4 py-10 sm:px-6 lg:py-14">
      <section className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="animate-pulse space-y-6">
            <div className="space-y-3">
              <div className="h-7 w-56 rounded bg-muted" />
              <div className="h-4 w-full max-w-lg rounded bg-muted" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="h-11 rounded-lg bg-muted" />
              <div className="h-11 rounded-lg bg-muted" />
            </div>

            <div className="h-11 rounded-lg bg-muted" />
            <div className="h-28 rounded-lg bg-muted" />
            <div className="h-11 rounded-lg bg-muted" />
            <div className="h-11 rounded-lg bg-muted" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<CompleteProfileFallback />}>
      <CompleteProfileForm />
    </Suspense>
  );
}
