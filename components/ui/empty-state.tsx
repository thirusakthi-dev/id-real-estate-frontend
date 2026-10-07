import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <section
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
        border-dashed
        border-border
        bg-surface
        px-6
        py-10
        text-center
        ${className}
      `}
    >
      {icon && (
        <div
          className="
            mb-4
            flex
            size-12
            items-center
            justify-center
            rounded-full
            bg-surface-hover
            text-muted-foreground
          "
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <h2 className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}
