"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  login,
  register,
  updateProfile,
  changePassword,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from "@/services/auth.service";

import { showToast } from "@/hooks/use-toast";

export const AUTH_USER_KEY = ["auth", "user"] as const;

const TOKEN_STORAGE_KEY = "token";
const AUTH_USER_STORAGE_KEY = "authUser";

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/* ---------------------------------- */
/* Login                              */
/* ---------------------------------- */

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),

    onSuccess: (response) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);

      localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify(response.data.user),
      );

      queryClient.setQueryData(AUTH_USER_KEY, response.data.user);
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Login failed",
        message: getErrorMessage(error, "Unable to sign in. Please try again."),
      });
    },
  });
}

/* ---------------------------------- */
/* Register                           */
/* ---------------------------------- */

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),

    onSuccess: (response) => {
      localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify(response.data),
      );

      queryClient.setQueryData(AUTH_USER_KEY, response.data);
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Registration failed",
        message: getErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
      });
    },
  });
}

/* ---------------------------------- */
/* Update Profile                     */
/* ---------------------------------- */

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),

    onSuccess: (response) => {
      const updatedUser = response.data;

      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));

      queryClient.setQueryData(AUTH_USER_KEY, updatedUser);
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Profile update failed",
        message: getErrorMessage(
          error,
          "Unable to update your profile. Please try again.",
        ),
      });
    },
  });
}

/* ---------------------------------- */
/* Change Password                    */
/* ---------------------------------- */

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),

    onError: (error) => {
      showToast({
        type: "error",
        title: "Password change failed",
        message: getErrorMessage(
          error,
          "Unable to change your password. Please try again.",
        ),
      });
    },
  });
}

/* ---------------------------------- */
/* Current User                       */
/* ---------------------------------- */

export function useCurrentUser() {
  const query = useQuery<AuthUser | null>({
    queryKey: AUTH_USER_KEY,

    queryFn: () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);

      if (!token || !storedUser) {
        return null;
      }

      try {
        return JSON.parse(storedUser) as AuthUser;
      } catch {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);

        return null;
      }
    },

    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  const isLoggedIn =
    Boolean(query.data) &&
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));

  return {
    user: query.data,
    isLoggedIn,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/* ---------------------------------- */
/* Logout                             */
/* ---------------------------------- */

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);

    queryClient.setQueryData(AUTH_USER_KEY, null);

    queryClient.removeQueries({
      queryKey: AUTH_USER_KEY,
    });
  };
}
