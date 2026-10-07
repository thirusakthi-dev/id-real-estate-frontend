import { Suspense } from "react";

import RegisterForm from "./register-form";

function RegisterFallback() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <div className="w-full animate-pulse space-y-6">
          <div className="mx-auto h-10 w-40 rounded bg-muted" />

          <div className="space-y-4">
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
          </div>

          <div className="h-11 rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
