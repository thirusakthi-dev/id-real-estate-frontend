import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",

  secondary:
    "bg-surface text-foreground ring-1 ring-border hover:bg-surface-hover",

  outline:
    "bg-transparent text-foreground ring-1 ring-border hover:bg-surface-hover",

  ghost: "bg-transparent text-foreground hover:bg-surface-hover",

  danger: "bg-destructive text-white hover:bg-destructive/90",
};

export default function Button({
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  startIcon,
  endIcon,
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        px-4
        py-2.5
        font-medium
        transition-all
        duration-200
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        startIcon
      )}

      <span>{loading ? loadingText : children}</span>

      {!loading && endIcon}
    </button>
  );
}
