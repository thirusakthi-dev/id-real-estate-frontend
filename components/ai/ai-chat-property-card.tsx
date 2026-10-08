"use client";

import { ArrowRight, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import type { Property } from "@/types/property";

import { fadeUp } from "@/lib/motion";

type AiChatPropertyCardProps = {
  property: Property;
  onClick: (propertyId: number) => void;
};

export default function AiChatPropertyCard({
  property,
  onClick,
}: AiChatPropertyCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      className="overflow-hidden rounded-xl border border-border bg-background transition hover:border-border hover:bg-surface-hover"
    >
      <div className="flex gap-3 p-3">
        <button
          type="button"
          onClick={() => onClick(property.id)}
          aria-label={`View ${property.title}`}
          className="size-20 shrink-0 overflow-hidden rounded-lg bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt=""
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-muted-foreground"
            >
              <Building2 size={22} />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onClick(property.id)}
            className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <h4 className="truncate text-sm font-semibold text-foreground">
              {property.title}
            </h4>
          </button>

          <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />

            <span className="truncate">{property.city}</span>
          </p>

          <p className="mt-2 text-sm font-semibold text-foreground">
            ₹{Number(property.price).toLocaleString("en-IN")}
          </p>

          <div className="mt-1 flex gap-3 text-[10px] text-muted-foreground">
            {property.bedrooms !== null && property.bedrooms !== undefined && (
              <span>{property.bedrooms} BHK</span>
            )}

            {property.area !== null && property.area !== undefined && (
              <span>{property.area} sq.ft</span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onClick(property.id)}
        className="flex w-full items-center justify-between border-t border-border px-3 py-2 text-[11px] font-medium text-muted-foreground transition hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
      >
        <span>View property</span>

        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </motion.article>
  );
}
