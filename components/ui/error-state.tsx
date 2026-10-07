import { AlertCircle, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  onRetry,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-label={title}
      className={`
        flex
        min-h-60
        w-full
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-border
        bg-surface
        px-6
        py-10
        text-center
        ${className}
      `}
    >
      <div
        className="
          mb-4
          flex
          size-12
          items-center
          justify-center
          rounded-full
          bg-destructive/10
          text-destructive
        "
        aria-hidden="true"
      >
        <AlertCircle className="size-6" />
      </div>

      <h2 className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {(onRetry || action) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-primary
                px-4
                py-2.5
                text-sm
                font-medium
                text-primary-foreground
                transition-opacity
                hover:opacity-90
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-primary
              "
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </button>
          )}

          {action}
        </div>
      )}
    </section>
  );
}
