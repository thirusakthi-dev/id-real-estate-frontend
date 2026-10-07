import { api } from "@/lib/api";
import type { Property } from "@/types/property";

export type PropertyFilters = {
  page?: number;
  limit?: number;

  search?: string;
  city?: string;

  propertyType?: Property["propertyType"];
  listingType?: Property["listingType"];

  minPrice?: number;
  maxPrice?: number;

  sort?: "" | "price_asc" | "price_desc" | "latest";

  mine?: boolean;
};

export type PropertiesResponse = {
  success: boolean;
  data: Property[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getProperties(
  filters?: PropertyFilters,
): Promise<PropertiesResponse> {
  const params = {
    ...(filters?.page !== undefined && {
      page: filters.page,
    }),

    ...(filters?.limit !== undefined && {
      limit: filters.limit,
    }),

    ...(filters?.search?.trim() && {
      search: filters.search.trim(),
    }),

    ...(filters?.city?.trim() && {
      city: filters.city.trim(),
    }),

    ...(filters?.propertyType && {
      propertyType: filters.propertyType,
    }),

    ...(filters?.listingType && {
      listingType: filters.listingType,
    }),

    ...(filters?.minPrice !== undefined && {
      minPrice: filters.minPrice,
    }),

    ...(filters?.maxPrice !== undefined && {
      maxPrice: filters.maxPrice,
    }),

    ...(filters?.sort && {
      sort: filters.sort,
    }),

    ...(filters?.mine !== undefined && {
      mine: filters.mine,
    }),
  };

  const response = await api.get<PropertiesResponse>("/properties", {
    params,
  });

  return response.data;
}

export async function getPropertyById(id: number): Promise<Property> {
  const response = await api.get<{
    success: boolean;
    data: Property;
  }>(`/properties/${id}`);

  return response.data.data;
}

export type CreatePropertyPayload = {
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType: Property["propertyType"];
  listingType: Property["listingType"];
  images: File[];
};

export async function createProperty(payload: CreatePropertyPayload) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("price", String(payload.price));
  formData.append("location", payload.location);
  formData.append("city", payload.city);
  formData.append("propertyType", payload.propertyType);
  formData.append("listingType", payload.listingType);

  if (payload.description?.trim()) {
    formData.append("description", payload.description.trim());
  }

  if (payload.bedrooms !== undefined) {
    formData.append("bedrooms", String(payload.bedrooms));
  }

  if (payload.bathrooms !== undefined) {
    formData.append("bathrooms", String(payload.bathrooms));
  }

  if (payload.area !== undefined) {
    formData.append("area", String(payload.area));
  }

  payload.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post<{
    success: boolean;
    message: string;
    data: Property;
  }>("/properties", formData);

  return response.data;
}

export type UpdatePropertyPayload = {
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType: Property["propertyType"];
  listingType: Property["listingType"];
  images?: File[];
};

export async function updateProperty(
  id: number,
  payload: UpdatePropertyPayload,
) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("price", String(payload.price));
  formData.append("location", payload.location);
  formData.append("city", payload.city);
  formData.append("propertyType", payload.propertyType);
  formData.append("listingType", payload.listingType);

  if (payload.description?.trim()) {
    formData.append("description", payload.description.trim());
  }

  if (payload.bedrooms !== undefined) {
    formData.append("bedrooms", String(payload.bedrooms));
  }

  if (payload.bathrooms !== undefined) {
    formData.append("bathrooms", String(payload.bathrooms));
  }

  if (payload.area !== undefined) {
    formData.append("area", String(payload.area));
  }

  payload.images?.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.put<{
    success: boolean;
    message: string;
    data: Property;
  }>(`/properties/${id}`, formData);

  return response.data;
}

export async function deleteProperty(id: number) {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(`/properties/${id}`);

  return response.data;
}
