import { Suspense } from "react";

import LoginForm from "./login-form";

function LoginFallback() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="animate-pulse space-y-6">
            <div className="space-y-3">
              <div className="h-7 w-40 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
            </div>

            <div className="h-11 rounded-lg bg-muted" />

            <div className="h-11 rounded-lg bg-muted" />

            <div className="h-11 rounded-lg bg-muted" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
