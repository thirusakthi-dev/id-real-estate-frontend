"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";

import { useOutsideClick } from "@/hooks/use-outside-click";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  error?: string;
  className?: string;
  startIcon?: ReactNode;
  clearable?: boolean;
};

export default function Select({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  options,
  disabled = false,
  error,
  className = "",
  startIcon,
  clearable = true,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const handleOutsideClick = useCallback(() => {
    setOpen(false);
  }, []);

  const containerRef = useOutsideClick<HTMLDivElement>(handleOutsideClick);

  const selectedValue = value ?? internalValue;

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  function handleSelect(optionValue: string) {
    if (value === undefined) {
      setInternalValue(optionValue);
    }

    onValueChange?.(optionValue);
    setOpen(false);
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation();

    if (value === undefined) {
      setInternalValue("");
    }

    onValueChange?.("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        onClick={() => setOpen((current) => !current)}
        className={`
          flex
          h-12
          w-full
          items-center
          justify-between
          gap-2
          rounded-xl
          border
          bg-background
          px-3.5
          text-sm
          outline-none
          transition-colors
          duration-200
          hover:border-foreground/30
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/10"
              : "border-border"
          }
          ${className}
        `}
      >
        <span className="flex min-w-0 items-center gap-2">
          {startIcon && (
            <span className="shrink-0 text-muted-foreground" aria-hidden="true">
              {startIcon}
            </span>
          )}

          <span
            className={`
              truncate
              ${selectedOption ? "text-foreground" : "text-muted-foreground"}
            `}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-1">
          {clearable && selectedValue && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleClear(event as unknown as React.MouseEvent);
                }
              }}
              className="
                flex
                size-6
                items-center
                justify-center
                rounded-md
                text-muted-foreground
                transition-colors
                hover:bg-surface-hover
                hover:text-foreground
              "
            >
              <X className="size-3.5" aria-hidden="true" />
            </span>
          )}

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex shrink-0"
          >
            <ChevronDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </motion.span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            className="
              absolute
              left-0
              top-full
              z-50
              mt-2
              max-h-60
              w-full
              overflow-y-auto
              rounded-xl
              border
              border-border
              bg-background
              p-1.5
              shadow-lg
            "
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <motion.button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-foreground
                    transition-colors
                    hover:bg-surface-hover
                    focus-visible:bg-surface-hover
                    focus-visible:outline-none
                  "
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
