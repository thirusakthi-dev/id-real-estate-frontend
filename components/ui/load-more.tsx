import { Loader2 } from "lucide-react";

type LoadMoreProps = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  hasMore?: boolean;
};

export default function LoadMore({
  onClick,
  loading = false,
  disabled = false,
  hasMore = true,
}: LoadMoreProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center py-6">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="
          inline-flex
          min-w-32
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-border
          bg-surface
          px-5
          py-2.5
          text-sm
          font-medium
          text-foreground
          transition-colors
          hover:bg-surface-hover
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-primary
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}

        {loading ? "Loading..." : "Show More"}
      </button>
    </div>
  );
}
