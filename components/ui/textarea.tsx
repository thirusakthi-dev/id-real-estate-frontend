import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export default function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="w-full min-w-0">
      <div
        className={`
          group
          relative
          w-full
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
        <textarea
          {...props}
          id={textareaId}
          placeholder={label ? " " : props.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={`
            peer
            min-h-32
            w-full
            resize-y
            bg-transparent
            px-3
            pb-3
            pt-5
            text-sm
            text-foreground
            outline-none
            placeholder:text-muted-foreground
            sm:text-base
            ${className}
          `}
        />

        {label && (
          <label
            htmlFor={textareaId}
            className="
              pointer-events-none
              absolute
              left-3
              top-0
              -translate-y-1/2
              bg-background
              px-1
              text-xs
              text-muted-foreground
              transition-colors
              duration-200
              peer-focus:text-primary
            "
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p
          id={`${textareaId}-error`}
          role="alert"
          className="mt-1.5 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
