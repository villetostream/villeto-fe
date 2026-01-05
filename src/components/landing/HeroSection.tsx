import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import { Input } from "../ui/input";
import Link from "next/link";

const avatars = [
  {
    src: "/images/avatars/avatar-1.jpg",
    alt: "User avatar 1",
  },
  {
    src: "/images/avatars/avatar-2.jpg",
    alt: "User avatar 2",
  },
  {
    src: "/images/avatars/avatar-3.jpg",
    alt: "User avatar 3",
  },
  {
    src: "/images/avatars/avatar-4.jpg",
    alt: "User avatar 4",
  },
  {
    src: "/images/avatars/avatar-5.jpg",
    alt: "User avatar 5",
  },
];

export const HeroSection = () => {
  return (
    <section className="pt-24 md:pt-48 md:pb-16 gradient-hero">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 md:gap-12 items-center justify-center">
          {/* Left Content */}
          <div className="space-y-5">
            <div className="flex">
              <h1 className="text-2xl md:text-5xl font-semibold text-[#0d0d0d] md:leading-tight">
                <span>All-in-One Spend Management for</span>{" "}
                <span className="relative">
                  <span className="text-primary"> Businesses</span>
                  <div className="absolute top-full left-0 w-full h-1 bg-primary" />
                </span>
              </h1>
            </div>

            <p className="mb-10 text-base md:text-xl text-[#0d0d0d]">
              Corporate cards, automated spend tracking, and vendor{" "}
              <br className="hidden md:block" /> {/* Visible only on md+ */}
              payments all under one intelligent platform.
            </p>

            <div className="flex gap-4 border rounded-md border-[#E2E2E2] p-2 focus-within:border-muted-foreground max-w-[452px]">
              <Input
                className="text-base border-none! focus-visible:ring-0 shadow-none!"
                placeholder="What is your work email"
              />
              <Button variant="hero" size="lg" asChild>
                <Link
                  href="/pre-onboarding"
                  className="text-base flex items-center"
                >
                  Get Started <RocketIcon className=" ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="rounded-xl overflow-hidden">
            <img
              src="/images/villeto-hero-image.png"
              alt="Villeto Demo Dashboard"
              className="w-full h-auto scale-110"
            />
          </div>
        </div>

        {/* Avatars bar  */}
        <div
          className="w-full max-w-fit flex items-center bg-[#eaeaea4c] rounded-2xl border border-[#eaeaea99] px-3 py-3 md:px-4 md:py-2.5
  -translate-y-4
"
        >
          <div
            className="
    flex flex-col
    gap-3
    md:flex-row md:items-center md:gap-6
  "
          >
            {/* Avatars */}
            <div className="inline-flex items-center justify-center">
              {avatars.map((avatar, index) => (
                <img
                  key={`avatar-${index}`}
                  className={`
            w-8 h-8 md:w-10 md:h-10
            rounded-full
            border border-[#ffffff33]
            object-cover
            ${index > 0 ? "-ml-2" : ""}
            md:${index > 0 ? "-ml-2.5" : ""}
          `}
                  alt={avatar.alt}
                  src={avatar.src}
                />
              ))}

              {/* +995 bubble */}
              <div className="relative w-8 h-8 md:w-10 md:h-10 -ml-2 md:-ml-2.5">
                <div className="absolute inset-0 bg-[#202020] rounded-full border border-[#ffffff0d]" />
                <span
                  className="
          absolute inset-0
          flex items-center justify-center
          text-[10px] md:text-xs
          text-white
        "
                >
                  +995
                </span>
              </div>
            </div>

            {/* Text */}
            <p
              className="
      text-center md:text-left
      text-xs md:text-base
      text-[#0d0d0d]
      leading-snug
      whitespace-normal
    "
            >
              Join <span className="font-medium">1,000+</span> finance teams
              saving hundreds of hours every month.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
