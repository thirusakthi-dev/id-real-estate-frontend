"use client";

import { useState } from "react";
import { Heart, HeartOff } from "lucide-react";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import FavoriteButton from "@/components/ui/favorite-button";

import { useCurrentUser } from "@/hooks/use-auth";

import {
  useAddFavorite,
  useFavorites,
  useRemoveFavorite,
} from "@/hooks/use-favorite";

type PropertyFavoriteProps = {
  propertyId: number;
};

export default function PropertyFavorite({
  propertyId,
}: PropertyFavoriteProps) {
  const { isLoggedIn } = useCurrentUser();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: favorites = [] } = useFavorites();

  const addFavoriteMutation = useAddFavorite();

  const removeFavoriteMutation = useRemoveFavorite();

  const isFavorite = favorites.some(
    (favorite) => favorite.propertyId === propertyId,
  );

  const isLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  function handleFavoriteClick() {
    setIsDialogOpen(true);
  }

  function handleConfirm() {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/properties/${propertyId}&favorite=true`;

      return;
    }

    if (isFavorite) {
      removeFavoriteMutation.mutate(propertyId, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });

      return;
    }

    addFavoriteMutation.mutate(propertyId, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  }

  function handleCancel() {
    if (isLoading) {
      return;
    }

    setIsDialogOpen(false);
  }

  const dialogTitle = isFavorite
    ? "Remove from favorites?"
    : "Add to favorites?";

  const dialogDescription = isFavorite
    ? "Would you like to remove this property from your favorites?"
    : isLoggedIn
      ? "Would you like to add this property to your favorites?"
      : "Please log in to add this property to your favorites.";

  const confirmText = isFavorite
    ? "Remove"
    : isLoggedIn
      ? "Add to Favorites"
      : "Login & Add";

  const loadingText = isFavorite ? "Removing..." : "Adding...";

  return (
    <>
      <FavoriteButton
        variant="icon"
        active={isFavorite}
        disabled={isLoading}
        onClick={handleFavoriteClick}
      />

      <ConfirmDialog
        open={isDialogOpen}
        title={dialogTitle}
        description={dialogDescription}
        confirmText={confirmText}
        cancelText="Cancel"
        variant={isFavorite ? "danger" : "info"}
        icon={
          isFavorite ? (
            <HeartOff className="size-5" />
          ) : (
            <Heart className="size-5" />
          )
        }
        loading={isLoading}
        loadingText={loadingText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
