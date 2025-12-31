"use client";
import { Suspense } from "react";
import Header from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeatureSection";
import { TechSection } from "@/components/landing/TechSection";
import Testimonials from "@/components/landing/Testimonials";
import CardsSection from "@/components/landing/CardsSection";
import TrustedCompanies from "@/components/landing/TrustedCompanies";
import MaxWidth from "@/lib/constants/MaxWidth";
import FAQSection from "@/components/landing/FaqSection";
import CTASection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";
import { LoadingFallback } from "@/components/landing/shared/LoadingFallback";

const LandingContent = () => {
  const sections = [
    {
      id: "hero",
      bg: "bg-background",
      dataBgColor: "#FFFFFF",
      content: (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-0 max-w-7xl mx-auto">
          <HeroSection />
          <TrustedCompanies />
          <FeaturesSection />
        </div>
      ),
    },
    {
      id: "tech",
      bg: "bg-navy",
      dataBgColor: "#191919",
      content: <TechSection />,
    },
    {
      id: "process",
      bg: "bg-white",
      dataBgColor: "#FFFFFF",
      content: (
        <>
          <Testimonials />
          <CardsSection />
        </>
      ),
    },
    {
      id: "cta",
      bg: "bg-navy",
      dataBgColor: "#191919",
      content: <CTASection />,
      className: "mt-12 md:mt-20 lg:mt-28 xl:mt-32 2xl:mt-40",
    },
    {
      id: "faq",
      bg: "bg-white",
      dataBgColor: "#FFFFFF",
      content: <FAQSection />,
    },
    {
      id: "footer",
      bg: "bg-navy",
      dataBgColor: "#1F2937",
      content: <Footer />,
      className: "mt-12 md:mt-20 lg:mt-28 xl:mt-32 2xl:mt-40",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <MaxWidth className="py-3.5" data-bg-color="">
        <Header />
      </MaxWidth>

      {sections.map((section) => (
        <MaxWidth
          key={section.id}
          className={`${section.bg} ${section.className || ""}`}
          data-bg-color={section.dataBgColor}
        >
          {section.content}
        </MaxWidth>
      ))}
    </div>
  );
};

export default function Landing() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LandingContent />
    </Suspense>
  );
}
