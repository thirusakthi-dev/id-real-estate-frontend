"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, RotateCcw, X } from "lucide-react";
import { useState } from "react";

import AiChat from "@/components/ai/ai-chat";

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClearChat = () => {
    setClearTrigger((current) => current + 1);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            id="ai-assistant"
            aria-label="Property AI assistant"
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="fixed right-4 bottom-24 z-50 flex w-[calc(100vw-2rem)] max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:right-6"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                >
                  <Bot size={18} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Property Assistant
                  </h2>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    Find your next property
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  aria-label="Clear chat"
                  title="Clear chat"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:outline-slate-100"
                >
                  <RotateCcw size={17} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close property assistant"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:outline-slate-100"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </header>

            <section
              aria-label="Property assistant conversation"
              className="h-[70vh] max-h-[650px] min-h-0"
            >
              <AiChat onClose={handleClose} clearTrigger={clearTrigger} />
            </section>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open property assistant"
            aria-expanded={isOpen}
            aria-controls="ai-assistant"
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
            }}
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="fixed right-4 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:focus-visible:outline-slate-100 sm:right-6"
          >
            <Bot size={24} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
