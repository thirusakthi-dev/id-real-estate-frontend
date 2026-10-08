"use client";

import { Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { fadeUp } from "@/lib/motion";

type AiChatLoadingProps = {
  visible: boolean;
};

export default function AiChatLoading({ visible }: AiChatLoadingProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-label="AI is thinking"
          className="mt-5 flex items-start gap-2"
        >
          <div
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground"
          >
            <Bot size={14} strokeWidth={1.8} />
          </div>

          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface px-3.5 py-3">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: item * 0.12,
                  ease: "easeInOut",
                }}
                className="size-1.5 rounded-full bg-muted-foreground"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
