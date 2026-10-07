"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";

import Button from "@/components/ui/button";

type ConfirmDialogVariant = "danger" | "warning" | "info" | "success";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

const variantStyles: Record<
  ConfirmDialogVariant,
  {
    icon: string;
    button: string;
  }
> = {
  danger: {
    icon: "bg-destructive/10 text-destructive",
    button: "bg-destructive text-white hover:bg-destructive/90",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    button: "bg-warning text-white hover:bg-warning/90",
  },
  info: {
    icon: "bg-primary/10 text-primary",
    button: "bg-primary text-primary-foreground hover:opacity-90",
  },
  success: {
    icon: "bg-success/10 text-success",
    button: "bg-success text-white hover:bg-success/90",
  },
};

const defaultIcons: Record<ConfirmDialogVariant, ReactNode> = {
  danger: <AlertTriangle className="size-5" aria-hidden="true" />,
  warning: <AlertTriangle className="size-5" aria-hidden="true" />,
  info: <Info className="size-5" aria-hidden="true" />,
  success: <CheckCircle className="size-5" aria-hidden="true" />,
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  loading = false,
  loadingText = "Processing...",
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const styles = variantStyles[variant];

  const dialog = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onCancel}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={
              description ? "confirm-dialog-description" : undefined
            }
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-border
              bg-background
              p-6
              shadow-2xl
            "
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${styles.icon}
                `}
              >
                {icon ?? defaultIcons[variant]}
              </div>

              <h2
                id="confirm-dialog-title"
                className="
                  min-w-0
                  flex-1
                  text-lg
                  font-semibold
                  text-foreground
                "
              >
                {title}
              </h2>

              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                aria-label="Close dialog"
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-muted-foreground
                  transition-colors
                  hover:bg-surface-hover
                  hover:text-foreground
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Description */}
            {description && (
              <p
                id="confirm-dialog-description"
                className="
                  mt-4
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                {description}
              </p>
            )}

            {/* Actions */}
            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </Button>

              <Button
                type="button"
                onClick={onConfirm}
                loading={loading}
                loadingText={loadingText}
                className={styles.button}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  
  return createPortal(dialog, document.body);
}
