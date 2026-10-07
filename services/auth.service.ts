import { api } from "@/lib/api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  city?: string | null;
  avatar?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type UpdateProfilePayload = {
  name: string;
  email?: string;
  phone: string;
  bio: string;
  city: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: AuthUser;
};

export type UpdateProfileResponse = {
  success: boolean;
  message: string;
  data: AuthUser;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", payload);

  return response.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/users/register", payload);

  return response.data;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<UpdateProfileResponse> {
  const response = await api.patch<UpdateProfileResponse>("/users/me", payload);

  return response.data;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const response = await api.patch<ChangePasswordResponse>(
    "/users/change-password",
    payload,
  );

  return response.data;
}
