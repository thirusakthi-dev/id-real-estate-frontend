import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  description?: string;
  iconClassName?: string;
  accentClassName?: string;
};

export default function StatsCard({
  icon: Icon,
  value,
  label,
  description,
  iconClassName = "",
  accentClassName = "",
}: StatsCardProps) {
  return (
    <article
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-background
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        before:absolute
        before:inset-y-0
        before:left-0
        before:w-1
        ${accentClassName}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>

          <h2 className="mt-1 text-sm font-semibold text-foreground">
            {label}
          </h2>
        </div>

        <div
          className={`
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconClassName}
          `}
        >
          <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
    </article>
  );
}
