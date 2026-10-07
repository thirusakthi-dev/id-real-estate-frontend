export default function PropertyCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
      "
    >
      <div className="aspect-[4/3] animate-pulse bg-surface-hover" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-surface-hover" />

        <div className="h-4 w-1/2 animate-pulse rounded-md bg-surface-hover" />

        <div className="h-6 w-1/3 animate-pulse rounded-md bg-surface-hover" />

        <div className="flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded-md bg-surface-hover" />
          <div className="h-4 w-16 animate-pulse rounded-md bg-surface-hover" />
          <div className="h-4 w-16 animate-pulse rounded-md bg-surface-hover" />
        </div>
      </div>
    </article>
  );
}
