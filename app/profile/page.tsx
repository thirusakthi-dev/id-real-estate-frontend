import { Suspense } from "react";

import ProfilePage from "./profile-page";

function ProfileFallback() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-40 rounded-2xl bg-muted" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-muted" />
            ))}
          </div>

          <div className="h-24 rounded-2xl bg-muted" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProfileRoute() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfilePage />
    </Suspense>
  );
}
