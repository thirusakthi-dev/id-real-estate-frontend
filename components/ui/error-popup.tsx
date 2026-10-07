"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

type ErrorPopupProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        initial={{ opacity: 0, x: 40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.96 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-destructive/30 bg-background p-4 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.2,
              type: "spring",
              stiffness: 400,
            }}
            className="mt-0.5 shrink-0"
          >
            <AlertCircle
              className="size-5 text-destructive"
              aria-hidden="true"
            />
          </motion.div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close error"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
