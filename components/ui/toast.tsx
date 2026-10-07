"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { TOAST_EVENT, type ToastData, type ToastType } from "@/hooks/use-toast";

const config: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    titleClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600 dark:text-green-400",
    titleClass: "text-green-700 dark:text-green-300",
  },

  error: {
    icon: AlertCircle,
    iconClass: "text-destructive",
    titleClass: "text-destructive",
  },

  warning: {
    icon: TriangleAlert,
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-700 dark:text-amber-300",
  },

  info: {
    icon: Info,
    iconClass: "text-primary",
    titleClass: "text-primary",
  },
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    function handleToast(event: Event) {
      const customEvent = event as CustomEvent<{
        type?: ToastType;
        title: string;
        message?: string;
        duration?: number;
      }>;

      const {
        type = "info",
        title,
        message,
        duration = 4000,
      } = customEvent.detail;

      const id = Date.now() + Math.random();

      const toast: ToastData = {
        id,
        type,
        title,
        message,
        duration,
      };

      setToasts((current) => [...current, toast]);

      if (duration > 0) {
        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== id));
        }, duration);
      }
    }

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  function removeToast(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  return (
    <div
      aria-label="Notifications"
      className="
        pointer-events-none
        fixed
        inset-x-0
        top-5
        z-[100]
        flex
        flex-col
        items-center
        gap-3
        px-4
      "
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const toastConfig = config[toast.type];
          const Icon = toastConfig.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{
                opacity: 0,
                y: -40,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.96,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 28,
                mass: 0.8,
              }}
              role={toast.type === "error" ? "alert" : "status"}
              aria-live="polite"
              className="
                pointer-events-auto
                w-full
                max-w-md
                rounded-xl
                border
                border-border
                bg-background
                p-4
                shadow-xl
                ring-1
                ring-black/5
              "
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 size-5 shrink-0 ${toastConfig.iconClass}`}
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${toastConfig.titleClass}`}
                  >
                    {toast.title}
                  </p>

                  {toast.message && (
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {toast.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close notification"
                  className="
                    -mr-1
                    -mt-1
                    flex
                    size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    text-muted-foreground
                    transition-colors
                    hover:bg-surface-hover
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                  "
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
