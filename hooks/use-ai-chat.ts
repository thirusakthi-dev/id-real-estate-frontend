import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { sendAiMessage, type AiChatMessage } from "@/services/ai.service";
import { showToast } from "@/hooks/use-toast";

type ErrorResponse = {
  message?: string;
};

type AiChatRequest = {
  message: string;
  history: AiChatMessage[];
};

export const useAiChat = () => {
  return useMutation({
    mutationFn: ({ message, history }: AiChatRequest) =>
      sendAiMessage(message, history),

    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        "Failed to get AI response. Please try again.";

      showToast({
        type: "error",
        title: "AI Error",
        message,
      });
    },
  });
};
