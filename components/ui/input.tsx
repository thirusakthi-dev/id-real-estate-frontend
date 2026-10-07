import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: string;
};

export default function Input({
  label,
  startIcon,
  endIcon,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full min-w-0">
      <div
        className={`
          group
          relative
          flex
          min-h-12
          w-full
          min-w-0
          items-center
          rounded-xl
          border
          bg-background
          transition-all
          duration-200
          ${
            error
              ? "border-destructive"
              : "border-border hover:border-foreground/30 focus-within:border-primary"
          }
          focus-within:ring-4
          focus-within:ring-primary/10
        `}
      >
        {startIcon && (
          <span
            className="
              ml-3
              shrink-0
              text-muted-foreground
              transition-colors
              group-focus-within:text-primary
            "
            aria-hidden="true"
          >
            {startIcon}
          </span>
        )}

        <div className="relative flex min-w-0 flex-1">
          <input
            {...props}
            id={inputId}
            placeholder={label ? " " : props.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              peer
              h-12
              w-full
              min-w-0
              bg-transparent
              px-3
              pb-2
              text-sm
              text-foreground
              outline-none
              placeholder:text-muted-foreground
              sm:text-base

              ${label ? "pt-3" : ""}
              ${endIcon ? "pr-10" : ""}

              autofill:bg-transparent
              autofill:text-foreground
              autofill:[-webkit-text-fill-color:var(--foreground)]
              autofill:[-webkit-box-shadow:0_0_0px_1000px_var(--background)_inset]

              [&:-webkit-autofill]:bg-transparent
              [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]
              [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_var(--background)_inset]
              [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_var(--background)_inset]
              [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_var(--background)_inset]

              ${className}
            `}
          />

          {label && (
            <label
              htmlFor={inputId}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                bg-background
                px-1
                text-sm
                text-muted-foreground
                transition-all
                duration-200

                peer-focus:top-0
                peer-focus:text-xs
                peer-focus:text-primary

                peer-[:not(:placeholder-shown)]:top-0
                peer-[:not(:placeholder-shown)]:text-xs
              "
            >
              {label}
            </label>
          )}
        </div>

        {endIcon && (
          <span
            className="
              mr-2
              flex
              shrink-0
              items-center
              justify-center
              text-muted-foreground
            "
          >
            {endIcon}
          </span>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
