import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import { Input } from "../ui/input";
import Link from "next/link";

const avatars = [
  {
    src: "/images/avatars/avatar-1.webp",
    alt: "User avatar 1",
  },
  {
    src: "/images/avatars/avatar-2.webp",
    alt: "User avatar 2",
  },
  {
    src: "/images/avatars/avatar-3.webp",
    alt: "User avatar 3",
  },
  {
    src: "/images/avatars/avatar-4.webp",
    alt: "User avatar 4",
  },
  {
    src: "/images/avatars/avatar-5.webp",
    alt: "User avatar 5",
  },
];

export const HeroSection = () => {
  return (
    <section className="pt-48 pb-16 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12 items-center">
          {/* Left Content */}
          <div className="col-span-2 space-y-5">
            <div className="flex">
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-16">
                <span>
                  All-in-One Spend
                  <br />
                  Management for
                </span>{" "}
                <span className="relative">
                  <span className="text-primary"> Business</span>
                  <div className="absolute top-full left-0 w-full h-1 bg-primary" />
                </span>
              </h1>
            </div>

            <p className="text-xl text-muted-foreground">
              Corporate cards, automated spend tracking, and vendor payments
              all under one intelligent platform.
            </p>

            <div className="flex gap-4 border rounded-md border-[#E2E2E2] p-2 focus-within:border-muted-foreground max-w-[452px]">
              <Input
                className="!border-none focus-visible:ring-0 !shadow-none"
                placeholder="What is your work email"
              />
              <Button variant="hero" size="lg" asChild>
                <Link href="/pre-onboarding" className="flex items-center">
                  Get Started <RocketIcon className=" ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-span-2 rounded-xl overflow-hidden">
            <img
              src="/images/villeto-hero-image.png"
              alt="Villeto Demo Dashboard"
              className="w-full h-auto scale-110"
            />
          </div>
        </div>

        {/* Avatars bar  */}
        <div className="max-w-max justify-self-start flex items-center bg-[#eaeaea4c] rounded-full border border-solid border-[#eaeaea99] py-2.5 px-2 -translate-y-4">
          <div className="flex items-center gap-10">
            <div className="inline-flex items-center">
              {avatars.map((avatar, index) => (
                <img
                  key={`avatar-${index}`}
                  className={`w-10 h-10 rounded-full border border-solid border-[#ffffff33] object-cover ${
                    index > 0 ? "-ml-2.5" : ""
                  }`}
                  alt={avatar.alt}
                  src={avatar.src}
                />
              ))}
              <div className="relative w-10 h-10 -ml-2.5">
                <div className="absolute top-0 left-0 w-10 h-10 bg-[#202020] rounded-[20px] border border-solid border-[#ffffff0d]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[Figtree,Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  +995
                </div>
              </div>
            </div>

            <p className="font-[Figtree,Helvetica] font-normal text-[#0d0d0d] text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Join 1,000+ finance teams saving hundreds of hours every month.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};