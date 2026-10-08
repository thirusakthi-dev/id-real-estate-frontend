"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

import { useOnlineStatus } from "@/hooks/use-online-status";

export default function OnlineStatus() {
  const isOnline = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBackOnline(false);
      return;
    }

    const hasBeenOffline = sessionStorage.getItem("was-offline");

    if (hasBeenOffline) {
      setShowBackOnline(true);
      sessionStorage.removeItem("was-offline");

      const timer = window.setTimeout(() => {
        setShowBackOnline(false);
      }, 2500);

      return () => window.clearTimeout(timer);
    }
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) {
      sessionStorage.setItem("was-offline", "true");
    }
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed left-0 right-0 top-0 z-[100] border-b border-destructive/20 bg-destructive px-4 py-3 text-destructive-foreground shadow-md"
          role="alert"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="size-4 shrink-0" aria-hidden="true" />

            <span>
              No internet connection. Please check your connection and try
              again.
            </span>
          </div>
        </motion.div>
      )}

      {showBackOnline && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed left-0 right-0 top-0 z-[100] border-b border-green-500/20 bg-green-600 px-4 py-3 text-white shadow-md"
          role="status"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm font-medium">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />

            <span>Back online</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
