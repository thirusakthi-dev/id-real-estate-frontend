export default function ProfileSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading profile"
      className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-9 w-48 animate-pulse rounded-lg bg-muted" />

          <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
        </header>

        <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {/* Profile header */}
          <header className="border-b border-border px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="size-16 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-56 max-w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </header>

          {/* Details */}
          <div className="divide-y divide-border">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 px-6 py-5 sm:px-8"
              >
                <div className="size-10 animate-pulse rounded-lg bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-48 max-w-full animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <footer className="flex flex-col gap-3 border-t border-border px-6 py-5 sm:flex-row sm:px-8">
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
          </footer>
        </section>
      </div>
    </main>
  );
}
