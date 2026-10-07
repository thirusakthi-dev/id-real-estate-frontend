export type PropertyOwner = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
};

export type Property = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  location: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;

  propertyType: "APARTMENT" | "VILLA" | "HOUSE" | "PLOT" | "OFFICE" | "SHOP";

  listingType: "SALE" | "RENT";

  images: string[];
  isAvailable: boolean;

  userId: number;
  user: PropertyOwner;

  createdAt: string;
  updatedAt: string;
};
