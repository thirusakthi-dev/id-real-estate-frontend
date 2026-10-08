"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Home,
  MapPin,
  Search,
  Send,
  Wallet,
} from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { useAiChat } from "@/hooks/use-ai-chat";
import type { AiChatMessage, AiResponse } from "@/services/ai.service";

type AiChatProps = {
  onClose: () => void;
  clearTrigger: number;
};

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  response: AiResponse;
};

const SUGGESTED_PROMPTS = [
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

const CHAT_HISTORY_LIMIT = 10;

const AiChat = ({ onClose, clearTrigger }: AiChatProps) => {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    });
  }, [messages, aiChat.isPending]);

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || aiChat.isPending) {
      return;
    }

    const history: AiChatMessage[] = messages
      .slice(-CHAT_HISTORY_LIMIT)
      .map((item) => ({
        role: item.role,
        message: item.response.message,
      }));

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        response: {
          type: "text",
          message: trimmedMessage,
        },
      },
    ]);

    setInput("");

    try {
      const response = await aiChat.mutateAsync({
        message: trimmedMessage,
        history,
      });

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          response,
        },
      ]);
    } catch {
      // Error toast is handled by useAiChat.
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendMessage(input);
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  /*
   * Closing the assistant does NOT clear messages.
   * The conversation stays in memory.
   */
  const handlePropertyClick = (propertyId: number) => {
    onClose();

    router.push(`/properties/${propertyId}`);
  };

  const handleViewProperties = (
    filters: Extract<
      AiResponse,
      {
        type: "count" | "properties";
      }
    >["filters"],
  ) => {
    const params = new URLSearchParams();

    if (filters.city) {
      params.set("city", filters.city);
    }

    if (filters.location) {
      params.set("location", filters.location);
    }

    if (filters.bedrooms !== undefined) {
      params.set("bedrooms", String(filters.bedrooms));
    }

    if (filters.bathrooms !== undefined) {
      params.set("bathrooms", String(filters.bathrooms));
    }

    if (filters.propertyType) {
      params.set("propertyType", filters.propertyType);
    }

    if (filters.listingType) {
      params.set("listingType", filters.listingType);
    }

    if (filters.minPrice !== undefined) {
      params.set("minPrice", String(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      params.set("maxPrice", String(filters.maxPrice));
    }

    const query = params.toString();

    onClose();

    router.push(query ? `/properties?${query}` : "/properties");
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-slate-950">
      <section
        aria-label="Conversation"
        aria-live="polite"
        className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <div className="py-8">
            <div className="text-center">
              <div
                aria-hidden="true"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                <Building2 size={22} strokeWidth={1.8} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                How can I help you?
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Search properties using natural language.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Try asking
              </p>

              <ul className="mt-2 grid gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => {
                  const Icon = prompt.icon;

                  return (
                    <li key={prompt.text}>
                      <button
                        type="button"
                        onClick={() => handleSuggestedPrompt(prompt.text)}
                        disabled={aiChat.isPending}
                        className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-100"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          <Icon size={15} strokeWidth={1.8} />
                        </span>

                        <span className="min-w-0 leading-5">{prompt.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {messages.map((item) => {
          const response = item.response;

          return (
            <article key={item.id}>
              {item.role === "user" ? (
                <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-slate-900 px-3.5 py-2.5 text-xs leading-5 text-white dark:bg-slate-100 dark:text-slate-900">
                  {response.message}
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-xs leading-5 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                    {response.message}
                  </p>

                  {/* PROPERTY RESULTS */}
                  {response.type === "properties" &&
                    response.properties.length > 0 && (
                      <>
                        <div className="space-y-2.5">
                          {response.properties.map((property) => (
                            <article
                              key={property.id}
                              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                            >
                              <div className="flex gap-3 p-3">
                                {/* Image */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePropertyClick(property.id)
                                  }
                                  aria-label={`View ${property.title}`}
                                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-800 dark:focus-visible:outline-slate-100"
                                >
                                  {property.images?.[0] ? (
                                    <img
                                      src={property.images[0]}
                                      alt=""
                                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                    />
                                  ) : (
                                    <div
                                      aria-hidden="true"
                                      className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500"
                                    >
                                      <Building2 size={22} />
                                    </div>
                                  )}
                                </button>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePropertyClick(property.id)
                                    }
                                    className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
                                  >
                                    <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                      {property.title}
                                    </h4>
                                  </button>

                                  <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    <MapPin
                                      size={12}
                                      className="shrink-0"
                                      aria-hidden="true"
                                    />
                                    <span className="truncate">
                                      {property.city}
                                    </span>
                                  </p>

                                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    ₹
                                    {Number(property.price).toLocaleString(
                                      "en-IN",
                                    )}
                                  </p>

                                  <div className="mt-1 flex gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                                    {property.bedrooms !== null &&
                                      property.bedrooms !== undefined && (
                                        <span>{property.bedrooms} BHK</span>
                                      )}

                                    {property.area !== null &&
                                      property.area !== undefined && (
                                        <span>{property.area} sq.ft</span>
                                      )}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handlePropertyClick(property.id)}
                                className="flex w-full items-center justify-between border-t border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:outline-slate-100"
                              >
                                <span>View property</span>

                                <ArrowRight size={14} aria-hidden="true" />
                              </button>
                            </article>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleViewProperties(response.filters)}
                          className="text-xs font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-400"
                        >
                          View all properties
                        </button>
                      </>
                    )}

                  {/* NO RESULTS */}
                  {response.type === "properties" &&
                    response.properties.length === 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No matching properties were found.
                      </p>
                    )}

                  {/* COUNT */}
                  {response.type === "count" && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {response.count}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        matching properties found
                      </p>

                      {response.count > 0 && (
                        <button
                          type="button"
                          onClick={() => handleViewProperties(response.filters)}
                          className="mt-3 text-xs font-medium text-slate-900 underline underline-offset-4 dark:text-slate-100"
                        >
                          View properties
                        </button>
                      )}
                    </div>
                  )}

                  {/* SINGLE PROPERTY */}
                  {response.type === "property" && response.property && (
                    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() =>
                          handlePropertyClick(response.property!.id)
                        }
                        className="flex w-full gap-3 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                          {response.property.images?.[0] ? (
                            <img
                              src={response.property.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              aria-hidden="true"
                              className="flex h-full w-full items-center justify-center text-slate-400"
                            >
                              <Building2 size={22} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {response.property.title}
                          </h4>

                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {response.property.city}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            ₹
                            {Number(response.property.price).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </button>
                    </article>
                  )}

                  {response.type === "property" && !response.property && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This property could not be found.
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {/* Loading */}
        {aiChat.isPending && (
          <div
            role="status"
            aria-label="AI is thinking"
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-3 dark:bg-slate-900">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s] dark:bg-slate-500" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s] dark:bg-slate-500" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </section>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="ai-message" className="sr-only">
              Ask the property assistant
            </label>

            <Input
              id="ai-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about properties..."
              disabled={aiChat.isPending}
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            disabled={!input.trim() || aiChat.isPending}
            aria-label="Send message"
          >
            <Send size={18} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AiChat;
