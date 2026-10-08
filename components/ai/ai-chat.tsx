"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { AxiosError } from "axios";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { useAiChat } from "@/hooks/use-ai-chat";

import type {
  AiChatMessage as AiChatHistoryMessage,
  AiResponse,
} from "@/services/ai.service";

import AiChatEmpty from "./ai-chat-empty";
import AiChatLoading from "./ai-chat-loading";
import AiChatMessage from "./ai-chat-message";

type AiChatProps = {
  onClose: () => void;
  clearTrigger: number;
};

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  response: AiResponse;
  isError?: boolean;
};

type ErrorResponse = {
  message?: string;
};

const CHAT_HISTORY_LIMIT = 10;

export default function AiChat({
  onClose,
  clearTrigger,
}: AiChatProps) {
  const router = useRouter();

  const [input, setInput] = useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const aiChat = useAiChat();

  useEffect(() => {
    if (clearTrigger === 0) {
      return;
    }

    setMessages([]);
    setInput("");
  }, [clearTrigger]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, aiChat.isPending]);

  const sendMessage = async (
    message: string,
  ) => {
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      aiChat.isPending
    ) {
      return;
    }

    const history: AiChatHistoryMessage[] =
      messages
        .slice(-CHAT_HISTORY_LIMIT)
        .map((item) => ({
          role: item.role,
          message:
            item.response.message,
        }));

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        response: {
          type: "text",
          message:
            trimmedMessage,
        },
      },
    ]);

    setInput("");

    try {
      const response =
        await aiChat.mutateAsync({
          message:
            trimmedMessage,
          history,
        });

      setMessages((current) => [
        ...current,
        {
          id:
            Date.now() + 1,
          role: "assistant",
          response,
        },
      ]);
    } catch (error) {
      const axiosError =
        error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data
          ?.message ||
        axiosError.message ||
        "Something went wrong while contacting the AI assistant. Please try again.";

      setMessages((current) => [
        ...current,
        {
          id:
            Date.now() + 1,
          role: "assistant",
          isError: true,
          response: {
            type: "text",
            message:
              errorMessage,
          },
        },
      ]);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await sendMessage(input);
  };

  const handleSuggestedPrompt =
    async (
      prompt: string,
    ) => {
      await sendMessage(prompt);
    };

  const handlePropertyClick = (
    propertyId: number,
  ) => {
    onClose();

    router.push(
      `/properties/${propertyId}`,
    );
  };

  const handleViewProperties = (
    filters: Extract<
      AiResponse,
      {
        type:
          | "count"
          | "properties";
      }
    >["filters"],
  ) => {
    const params =
      new URLSearchParams();

    if (filters.city) {
      params.set(
        "city",
        filters.city,
      );
    }

    if (filters.location) {
      params.set(
        "location",
        filters.location,
      );
    }

    if (
      filters.bedrooms !==
      undefined
    ) {
      params.set(
        "bedrooms",
        String(
          filters.bedrooms,
        ),
      );
    }

    if (
      filters.bathrooms !==
      undefined
    ) {
      params.set(
        "bathrooms",
        String(
          filters.bathrooms,
        ),
      );
    }

    if (filters.propertyType) {
      params.set(
        "propertyType",
        filters.propertyType,
      );
    }

    if (filters.listingType) {
      params.set(
        "listingType",
        filters.listingType,
      );
    }

    if (
      filters.minPrice !==
      undefined
    ) {
      params.set(
        "minPrice",
        String(
          filters.minPrice,
        ),
      );
    }

    if (
      filters.maxPrice !==
      undefined
    ) {
      params.set(
        "maxPrice",
        String(
          filters.maxPrice,
        ),
      );
    }

    const query =
      params.toString();

    onClose();

    router.push(
      query
        ? `/properties?${query}`
        : "/properties",
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <section
        aria-label="AI conversation"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto bg-background p-4"
      >
        <AnimatePresence
          initial={false}
        >
          {messages.length ===
            0 && (
            <AiChatEmpty
              disabled={
                aiChat.isPending
              }
              onSelectPrompt={
                handleSuggestedPrompt
              }
            />
          )}
        </AnimatePresence>

        <div className="space-y-5">
          <AnimatePresence
            initial={false}
            mode="popLayout"
          >
            {messages.map(
              (message) => (
                <AiChatMessage
                  key={message.id}
                  message={
                    message
                  }
                  onPropertyClick={
                    handlePropertyClick
                  }
                  onViewProperties={
                    handleViewProperties
                  }
                />
              ),
            )}
          </AnimatePresence>
        </div>

        <AiChatLoading
          visible={
            aiChat.isPending
          }
        />

        <div
          ref={messagesEndRef}
          aria-hidden="true"
        />
      </section>

      <form
        onSubmit={
          handleSubmit
        }
        className="shrink-0 border-t border-border bg-background p-3"
      >
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="ai-message"
              className="sr-only"
            >
              Ask the property
              assistant
            </label>

            <Input
              id="ai-message"
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value,
                )
              }
              placeholder="Ask about properties..."
              disabled={
                aiChat.isPending
              }
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            disabled={
              !input.trim() ||
              aiChat.isPending
            }
            aria-label="Send message"
            startIcon={
              <Send
                size={18}
                aria-hidden="true"
              />
            }
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}