"use client";

import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import OptimizedImage from "@/components/ui/optimized-image";
import Select from "@/components/ui/select";
import { PROPERTY_TYPE_OPTIONS } from "@/components/property/property-filters";

const propertyTypeOptions = [
  { label: "All Types", value: "" },
  ...PROPERTY_TYPE_OPTIONS,
];

const priceOptions = [
  { label: "Any Price", value: "" },
  { label: "Under ₹25L", value: "0-2500000" },
  { label: "₹25L – ₹50L", value: "2500000-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹2Cr", value: "10000000-20000000" },
  { label: "₹2Cr+", value: "20000000-" },
];

export default function Hero() {
  const router = useRouter();

  const [listingType, setListingType] = useState<"SALE" | "RENT">("SALE");

  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    params.set("listingType", listingType);

    if (city.trim()) {
      params.set("city", city.trim());
    }

    if (propertyType) {
      params.set("propertyType", propertyType);
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-");

      if (minPrice) {
        params.set("minPrice", minPrice);
      }

      if (maxPrice) {
        params.set("maxPrice", maxPrice);
      }
    }

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-visible bg-background"
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          
          pt-8
          sm:px-6
          sm:pt-12
          lg:px-8
        
          lg:pt-11
        "
      >
        {/* Hero */}
        <div
          className="
            grid
            items-center
            gap-10
            lg:grid-cols-[1fr_0.9fr]
            lg:gap-14
          "
        >
          {/* Content */}
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="
                inline-flex
                rounded-full
                border
                border-accent/30
                bg-accent-soft
                px-3
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-accent
              "
            >
              Curated living
            </motion.span>

            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="
                mt-5
                text-4xl
                font-semibold
                leading-[1.05]
                tracking-tight
                text-foreground
                sm:text-5xl
                lg:text-6xl
              "
            >
              Find a place
              <br />
              you&apos;ll love{" "}
              <span className="font-normal italic text-muted-foreground">
                to call home.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground
                sm:text-base
              "
            >
              Discover exceptional properties in sought-after locations. Explore
              homes, apartments, villas and more—all in one place.
            </motion.p>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              x: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="
              relative
              aspect-[4/3]
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-surface
              shadow-xl
            "
          >
            <OptimizedImage
              src="/assets/hero-property.jpg"
              alt="Modern residential property"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={85}
            />
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: "easeOut",
          }}
          className="
            relative
            z-50
            mx-auto
            mt-8
            max-w-5xl
            sm:-mt-5
          "
        >
          <form
            onSubmit={handleSearch}
            className="
              relative
              z-50
              rounded-2xl
              border
              border-border
              bg-background
              p-2
              shadow-xl
              sm:p-3
            "
          >
            {/* Buy / Rent */}
            <div className="flex border-b border-border px-2">
              <button
                type="button"
                onClick={() => setListingType("SALE")}
                aria-pressed={listingType === "SALE"}
                className={`
                  relative
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition-colors
                  ${
                    listingType === "SALE"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                Buy
                {listingType === "SALE" && (
                  <motion.span
                    layoutId="listing-type-indicator"
                    aria-hidden="true"
                    className="
                      absolute
                      inset-x-2
                      bottom-0
                      h-0.5
                      rounded-full
                      bg-primary
                    "
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setListingType("RENT")}
                aria-pressed={listingType === "RENT"}
                className={`
                  relative
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition-colors
                  ${
                    listingType === "RENT"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                Rent
                {listingType === "RENT" && (
                  <motion.span
                    layoutId="listing-type-indicator"
                    aria-hidden="true"
                    className="
                      absolute
                      inset-x-2
                      bottom-0
                      h-0.5
                      rounded-full
                      bg-primary
                    "
                  />
                )}
              </button>
            </div>

            {/* Search Fields */}
            <div
              className="
                grid
                gap-3
                p-2
                md:grid-cols-[1.2fr_1fr_1fr_auto]
                md:items-end
              "
            >
              {/* Location */}
              <Input
                id="hero-city"
                name="city"
                label="Location"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                startIcon={<MapPin className="size-4" aria-hidden="true" />}
              />

              {/* Property Type */}
              <div className="relative z-50">
                <label
                  htmlFor="hero-property-type"
                  className="
                    mb-1.5
                    block
                    px-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Property Type
                </label>

                <Select
                  value={propertyType}
                  onValueChange={setPropertyType}
                  options={propertyTypeOptions}
                  placeholder="All Types"
                />
              </div>

              {/* Price Range */}
              <div className="relative z-50">
                <label
                  htmlFor="hero-price-range"
                  className="
                    mb-1.5
                    block
                    px-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Price Range
                </label>

                <Select
                  value={priceRange}
                  onValueChange={setPriceRange}
                  options={priceOptions}
                  placeholder="Any Price"
                />
              </div>

              {/* Search */}
              <Button
                type="submit"
                startIcon={<Search className="size-4" aria-hidden="true" />}
                className="
                  h-12
                  whitespace-nowrap
                  rounded-xl
                  px-5
                "
              >
                Search Properties
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
