"use client";

import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "icon" | "button";
};

export default function FavoriteButton({
  active = false,
  onClick,
  disabled = false,
  className = "",
  variant = "icon",
}: FavoriteButtonProps) {
  const label = active ? "Remove from favorites" : "Add to favorites";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active}
        className={`
          inline-flex
          h-10
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-border
          bg-surface
          px-4
          text-sm
          font-medium
          text-foreground
          transition-all
          duration-200
          hover:bg-surface-hover
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-primary
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${active ? "text-destructive" : ""}
          ${className}
        `}
      >
        <Heart
          className={`size-4 ${active ? "fill-current" : ""}`}
          aria-hidden="true"
        />

        <span>{active ? "Saved" : "Add to Favorites"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`
        inline-flex
        size-10
        items-center
        justify-center
        rounded-full
        border
        border-border
        bg-background/90
        text-foreground
        shadow-sm
        backdrop-blur-sm
        transition-all
        duration-200
        hover:scale-105
        hover:bg-background
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${active ? "text-destructive" : ""}
        ${className}
      `}
    >
      <Heart
        className={`size-5 ${active ? "fill-current" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}
