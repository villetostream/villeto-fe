import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroDashboard from "../../../public/images/tech-glow-1.webp";
import { Input } from "../ui/input";
import MaxWidth from "@/lib/constants/MaxWidth";
import SocialProof from "./shared/SocialProof";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="pt-48 pb-16 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-5">
            <div className="flex">
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-16">
                <span>
                  All-in-One Spend
                  <br />
                  Management for
                </span>{" "}
                <span className="relative">
                  <span className="text-primary"> Business</span>
                  <div className="absolute top-full left-0 w-full h-1 bg-primary"></div>
                </span>
              </h1>
            </div>

            <div>
              <p className="text-xl text-muted-foreground ">
                Corporate cards, automated spend tracking, and vendor payments
                all under one intelligent platform.
              </p>
            </div>

            <div className="flex  gap-4 border rounded-md border-[#E2E2E2] p-2 focus-within:border-muted-foreground max-w-[452px]">
              <Input
                className="!border-none focus-visible:border-0 focus-visible:ring-0 !shadow-none"
                placeholder="What is your work email"
              />
              <Button variant="hero" size="lg" asChild>
                <Link href="/pre-onboarding" className="flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <SocialProof />
          </div>

          {/* Right Content - Dashboard Preview */}

          <div className="relative rounded-xl overflow-hidden">
            <img
              src={"/images/villeto-hero-image.png"}
              alt="Villeto Demo Dashboard"
              className="w-full h-auto scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
