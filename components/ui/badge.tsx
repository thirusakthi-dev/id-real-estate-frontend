import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",

  success: "bg-success/10 text-success",

  warning: "bg-warning/10 text-warning",

  destructive: "bg-destructive/10 text-destructive",

  outline: "border border-border bg-transparent text-foreground",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        w-fit
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        leading-none
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
