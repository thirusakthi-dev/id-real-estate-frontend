import { api } from "@/lib/api";

import type { Property } from "@/types/property";

export type Favorite = {
  id: number;
  userId: number;
  propertyId: number;
  createdAt: string;
  property: Property;
};

export type FavoritesResponse = {
  success: boolean;
  data: Favorite[];
};

export async function getFavorites(): Promise<Favorite[]> {
  const response = await api.get<FavoritesResponse>("/favorites");

  return response.data.data;
}

export async function addFavorite(propertyId: number): Promise<void> {
  await api.post(`/favorites/${propertyId}`);
}

export async function removeFavorite(propertyId: number): Promise<void> {
  await api.delete(`/favorites/${propertyId}`);
}
