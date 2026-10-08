"use client";

import {
  ChevronDown,
  DivideSquare,
  Heart,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import Button from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useCurrentUser } from "@/hooks/use-auth";
import { useOutsideClick } from "@/hooks/use-outside-click";

const navItems = [
  {
    label: "Buy",
    href: "/properties?listingType=SALE",
  },
  {
    label: "Rent",
    href: "/properties?listingType=RENT",
  },
  {
    label: "Properties",
    href: "/properties",
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isLoggedIn } = useCurrentUser();

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const closeProfileMenu = useCallback(() => {
    setProfileOpen(false);
  }, []);

  const mobileMenuRef = useOutsideClick<HTMLDivElement>(closeMobileMenu);
  const profileMenuRef = useOutsideClick<HTMLDivElement>(closeProfileMenu);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");

    window.location.href = "/";
  }

  function toggleMobileMenu() {
    setMobileOpen((current) => !current);
  }

  function toggleProfileMenu() {
    setProfileOpen((current) => !current);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="ID Real Estate home"
          className="flex shrink-0 gap-1 items-center"
        >
          <Image
            src="/logo.png"
            alt="ID Real Estate"
            width={150}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
          <div
            aria-label="Real Estate home"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Real<span className="text-accent">Estate</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              {/* Favorites */}
              <Link
                href="/profile/favorites"
                aria-label="Favorites"
                className="
                  inline-flex
                  size-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  bg-background
                  text-muted-foreground
                  transition-colors
                  hover:bg-surface-hover
                  hover:text-foreground
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary
                "
              >
                <Heart className="size-5" aria-hidden="true" />
              </Link>

              {/* Profile */}
              <div ref={profileMenuRef} className="relative ml-1">
                <button
                  type="button"
                  onClick={toggleProfileMenu}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-2
                    py-1.5
                    transition-colors
                    hover:bg-surface-hover
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-primary
                  "
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="size-4" aria-hidden="true" />
                  </span>

                  <span className="max-w-24 truncate text-sm font-medium text-foreground">
                    {user?.name ?? "Account"}
                  </span>

                  <ChevronDown
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={closeProfileMenu}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-sm
                        text-foreground
                        transition-colors
                        hover:bg-surface-hover
                      "
                    >
                      <User className="size-4" aria-hidden="true" />
                      View Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-sm
                        text-destructive
                        transition-colors
                        hover:bg-destructive/10
                      "
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button
              type="button"
              className="ml-1 rounded-xl px-5"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          {isLoggedIn && (
            <>
              {/* Favorites */}
              <Link
                href="/profile/favorites"
                aria-label="Favorites"
                className="
                  inline-flex
                  size-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  bg-background
                  text-muted-foreground
                  transition-colors
                  hover:bg-surface-hover
                  hover:text-foreground
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary
                "
              >
                <Heart className="size-5" aria-hidden="true" />
              </Link>

              {/* Profile */}
              <Link
                href="/profile"
                aria-label="Profile"
                className="
                  inline-flex
                  size-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  bg-background
                  text-foreground
                  transition-colors
                  hover:bg-surface-hover
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-primary
                "
              >
                <User className="size-5" aria-hidden="true" />
              </Link>
            </>
          )}

          {/* Mobile menu wrapper */}
          <div ref={mobileMenuRef} className="relative">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="
                inline-flex
                size-10
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-background
                text-foreground
                transition-colors
                hover:bg-surface-hover
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-primary
              "
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>

            {/* Mobile overlay menu */}
            {mobileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+0.75rem)]
                  w-[calc(100vw-2rem)]
                  max-w-sm
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  p-2
                  shadow-xl
                "
              >
                <nav aria-label="Mobile navigation">
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="
                          rounded-xl
                          px-3
                          py-3
                          text-sm
                          font-medium
                          text-muted-foreground
                          transition-colors
                          hover:bg-surface-hover
                          hover:text-foreground
                        "
                      >
                        {item.label}
                      </Link>
                    ))}

                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={closeMobileMenu}
                          className="
                            mt-1
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-sm
                            font-medium
                            text-foreground
                            transition-colors
                            hover:bg-surface-hover
                          "
                        >
                          <User className="size-4" aria-hidden="true" />
                          View Profile
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            closeMobileMenu();
                            handleLogout();
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-sm
                            font-medium
                            text-destructive
                            transition-colors
                            hover:bg-destructive/10
                          "
                        >
                          <LogOut className="size-4" aria-hidden="true" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="mt-1 block"
                      >
                        <Button type="button" className="w-full rounded-xl">
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
