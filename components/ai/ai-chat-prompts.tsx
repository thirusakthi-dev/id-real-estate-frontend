"use client";

import { Building2, Home, Search, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { fadeUp, staggerFast } from "@/lib/motion";

type SuggestedPrompt = {
  text: string;
  icon: LucideIcon;
};

type AiChatPromptsProps = {
  disabled: boolean;
  onSelect: (prompt: string) => void;
};

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    text: "Show me 2 BHK apartments in Chennai",
    icon: Building2,
  },
  {
    text: "Find properties under ₹50 lakhs",
    icon: Wallet,
  },
  {
    text: "Show me villas for rent",
    icon: Home,
  },
  {
    text: "How many properties are available in Chennai?",
    icon: Search,
  },
];

export default function AiChatPrompts({
  disabled,
  onSelect,
}: AiChatPromptsProps) {
  return (
    <div className="mt-6">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Try asking
      </p>

      <motion.ul
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="mt-2 grid gap-2"
      >
        {SUGGESTED_PROMPTS.map((prompt) => {
          const Icon = prompt.icon;

          return (
            <motion.li key={prompt.text} variants={fadeUp}>
              <button
                type="button"
                onClick={() => onSelect(prompt.text)}
                disabled={disabled}
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left text-xs font-medium text-foreground transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground"
                >
                  <Icon size={15} strokeWidth={1.8} />
                </span>

                <span className="min-w-0 leading-5">{prompt.text}</span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
