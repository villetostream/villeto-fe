"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  SquareArrowOutUpRight,
  MousePointer2,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Optional: if you have a cn utility for className merging

// Context for mobile menu state
type MobileMenuContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const MobileMenuContext = createContext<MobileMenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

export const MobileMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

// Header Component
export default function Header() {
  const { isOpen, setIsOpen } = useMobileMenu();

  const navItems = [
    { label: "Company", href: "#company" },
    { label: "Products", href: "#products" },
    { label: "Solutions", href: "#solutions" },
    { label: "Pricing Plans", href: "#pricing" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto max-w-[1560px] bg-white shadow-sm">
      <div className="border-b border-border/60">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo - Clickable to Homepage */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold transition-opacity hover:opacity-80"
            onClick={closeMenu}
          >
            <img
              src={"/images/villeto-logo.png"}
              alt="Villeto Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 text-lg font-normal text-foreground transition-colors hover:text-foreground/80"
              >
                {item.label}
                {item.label !== "Company" && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              variant="outlinePrimary"
              size="lg"
              asChild
              className="min-w-[171px] rounded-2xl"
            >
              <Link href="/login" className="flex items-center">
                Sign in
                <SquareArrowOutUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button variant="hero" size="md" asChild>
              <Link href="/pre-onboarding" className="flex items-center">
                See a Demo
                <SquareArrowOutUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="border-t border-border/60 bg-white md:hidden">
            <div className="px-6 py-6">
              <nav className="flex flex-col space-y-5">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="text-lg font-medium text-foreground transition-colors hover:text-foreground/80"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="space-y-4 border-t border-border/60 pt-6">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start"
                  >
                    Learn More
                    <MousePointer2 className="ml-2 h-5 w-5" />
                  </Button>

                  <Button variant="hero" size="lg" asChild className="w-full">
                    <Link
                      href="/pre-onboarding"
                      className="flex items-center justify-center"
                    >
                      See a Demo
                      <SquareArrowOutUpRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
