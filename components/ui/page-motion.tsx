"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageMotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function PageMotion({
  children,
  className,
  delay = 0,
}: PageMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
