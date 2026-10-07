"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      startIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
      onClick={() => router.back()}
      className="px-2.5 sm:px-3"
      aria-label="Go back"
    >
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
}
