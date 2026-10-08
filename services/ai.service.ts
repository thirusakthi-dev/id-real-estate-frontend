import { api } from "@/lib/api";
import type { Property } from "@/types/property";

export type AiChatMessage = {
  role: "user" | "assistant";
  message: string;
};

export type AiFilters = {
  city?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
};

export type AiResponse =
  | {
      type: "text";
      message: string;
    }
  | {
      type: "count";
      message: string;
      count: number;
      filters: AiFilters;
    }
  | {
      type: "properties";
      message: string;
      properties: Property[];
      filters: AiFilters;
    }
  | {
      type: "property";
      message: string;
      property: Property | null;
    };

export const sendAiMessage = async (
  message: string,
  history: AiChatMessage[],
): Promise<AiResponse> => {
  const response = await api.post<AiResponse>("/ai/chat", {
    message,
    history,
  });

  return response.data;
};
