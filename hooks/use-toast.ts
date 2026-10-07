"use client";

export type ToastType = "success" | "error" | "warning" | "info";

type ShowToastOptions = {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

export type ToastData = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
};

export const TOAST_EVENT = "app:toast";

export function showToast({
  type = "info",
  title,
  message,
  duration = 4000,
}: ShowToastOptions) {
  window.dispatchEvent(
    new CustomEvent<ShowToastOptions>(TOAST_EVENT, {
      detail: {
        type,
        title,
        message,
        duration,
      },
    }),
  );
}
