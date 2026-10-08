"use client";

import { AlertCircle, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

import type { AiResponse } from "@/services/ai.service";

import { fadeUp, staggerContainer } from "@/lib/motion";

import AiChatMarkdown from "./ai-chat-markdown";
import AiChatPropertyCard from "./ai-chat-property-card";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  response: AiResponse;
  isError?: boolean;
};

type AiChatMessageProps = {
  message: ChatMessage;
  onPropertyClick: (propertyId: number) => void;
  onViewProperties: (
    filters: Extract<
      AiResponse,
      {
        type: "count" | "properties";
      }
    >["filters"],
  ) => void;
};

export default function AiChatMessage({
  message,
  onPropertyClick,
  onViewProperties,
}: AiChatMessageProps) {
  const isUser = message.role === "user";

  const response = message.response;

  if (isUser) {
    return (
      <motion.article
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="flex items-end justify-end gap-2"
      >
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-xs leading-5 text-primary-foreground">
          <AiChatMarkdown text={response.message} />
        </div>

        <div
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground"
        >
          <User size={14} strokeWidth={1.8} />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="flex items-start gap-2"
    >
      <div
        aria-hidden="true"
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${
          message.isError
            ? "border-destructive/20 bg-destructive/10 text-destructive"
            : "border-border bg-surface text-muted-foreground"
        }`}
      >
        {message.isError ? (
          <AlertCircle size={14} strokeWidth={1.8} />
        ) : (
          <Bot size={14} strokeWidth={1.8} />
        )}
      </div>

      <div className="min-w-0 max-w-[88%] space-y-3">
        <div
          className={`rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs leading-5 ${
            message.isError
              ? "border border-destructive/20 bg-destructive/10 text-destructive"
              : "bg-surface text-foreground"
          }`}
        >
          <AiChatMarkdown text={response.message} />
        </div>

        {response.type === "properties" && response.properties.length > 0 && (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2.5"
            >
              {response.properties.map((property) => (
                <AiChatPropertyCard
                  key={property.id}
                  property={property}
                  onClick={onPropertyClick}
                />
              ))}
            </motion.div>

            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              type="button"
              onClick={() => onViewProperties(response.filters)}
              className="text-xs font-medium text-foreground underline underline-offset-4 hover:opacity-70"
            >
              View all properties
            </motion.button>
          </>
        )}

        {response.type === "properties" && response.properties.length === 0 && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-xs text-muted-foreground"
          >
            No matching properties were found.
          </motion.p>
        )}

        {response.type === "count" && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-border bg-surface p-4"
          >
            <p className="text-2xl font-semibold text-foreground">
              {response.count}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              matching properties found
            </p>

            {response.count > 0 && (
              <button
                type="button"
                onClick={() => onViewProperties(response.filters)}
                className="mt-3 text-xs font-medium text-foreground underline underline-offset-4 hover:opacity-70"
              >
                View properties
              </button>
            )}
          </motion.div>
        )}

        {response.type === "property" && response.property && (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-xl border border-border bg-background"
          >
            <button
              type="button"
              onClick={() => onPropertyClick(response.property!.id)}
              className="flex w-full gap-3 p-3 text-left transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            >
              <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                {response.property.images?.[0] ? (
                  <img
                    src={response.property.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center text-muted-foreground"
                  >
                    <Bot size={22} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-foreground">
                  {response.property.title}
                </h4>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {response.property.city}
                </p>

                <p className="mt-2 text-sm font-semibold text-foreground">
                  ₹{Number(response.property.price).toLocaleString("en-IN")}
                </p>
              </div>
            </button>
          </motion.article>
        )}

        {response.type === "property" && !response.property && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xs text-muted-foreground"
          >
            This property could not be found.
          </motion.p>
        )}
      </div>
    </motion.article>
  );
}
