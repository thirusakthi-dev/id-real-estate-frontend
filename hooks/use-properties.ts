import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteProperty,
  getProperties,
  getPropertyById,
  type PropertyFilters,
} from "@/services/property.service";

export function useProperties(filters?: PropertyFilters) {
  const [hasToken, setHasToken] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(localStorage.getItem("token")));
    setIsAuthReady(true);
  }, []);

  const requiresAuth = filters?.mine === true;

  return useQuery({
    queryKey: ["properties", filters],

    queryFn: () => getProperties(filters),

    enabled: !requiresAuth || (isAuthReady && hasToken),

    staleTime: 30_000,

    retry: 1,
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: ["property", id],

    queryFn: () => getPropertyById(id),

    enabled: Number.isInteger(id),

    staleTime: 30_000,

    retry: 1,
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => deleteProperty(propertyId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
}
