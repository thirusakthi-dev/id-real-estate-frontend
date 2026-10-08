"use client";

import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

import { scaleIn, slideUp } from "@/lib/motion";

import AiChatPrompts from "./ai-chat-prompts";

type AiChatEmptyProps = {
  disabled: boolean;
  onSelectPrompt: (prompt: string) => void;
};

export default function AiChatEmpty({
  disabled,
  onSelectPrompt,
}: AiChatEmptyProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="py-8"
    >
      <div className="text-center">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          aria-hidden="true"
          className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-surface text-muted-foreground"
        >
          <Building2 size={22} strokeWidth={1.8} />
        </motion.div>

        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mt-4"
        >
          <h3 className="text-base font-semibold text-foreground">
            How can I help you?
          </h3>

          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            Search properties using natural language.
          </p>
        </motion.div>
      </div>

      <AiChatPrompts disabled={disabled} onSelect={onSelectPrompt} />
    </motion.div>
  );
}
