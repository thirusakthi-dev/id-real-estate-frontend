"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/favorite.service";

import { showToast } from "@/hooks/use-toast";

export const FAVORITES_KEY = ["favorites"] as const;

export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: getFavorites,
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => addFavorite(propertyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAVORITES_KEY,
      });

      showToast({
        type: "success",
        title: "Added to favorites",
        message: "Property added to your favorites.",
      });
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Failed to add favorite",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => removeFavorite(propertyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAVORITES_KEY,
      });

      showToast({
        type: "success",
        title: "Removed from favorites",
        message: "Property removed from your favorites.",
      });
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Failed to remove favorite",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    },
  });
}
