"use client";
import React, { Suspense } from 'react';
import { InView } from 'react-intersection-observer';
import { ScrollContextProvider, useScrollContext } from '@/components/landing/Header';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeatureSection';
import { TechSection } from '@/components/landing/TechSection';
import { ProcessSection } from '@/components/landing/ProcessSection';
import TrustedCompanies from '@/components/landing/TrustedCompanies';
import MaxWidth from '@/lib/constants/MaxWidth';
import FAQSection from '@/components/landing/FaqSection';
import CTASection from '@/components/landing/CtaSection';
import CardsSection from '@/components/landing/CardsSection';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import AnimatedLanding from '@/components/landing/shared/AnimatedLanding';
import { LoadingFallback } from '@/components/landing/shared/LoadingFallback';

const LandingContent = () => {

  // Define sections with their background classes
  const sections = [
    {
      id: 'hero',
      bg: 'bg-background',
      dataBgColor: '#FFFFFF', // Fallback: white (adjust if bg-background differs)
      content: (
        <div className="px-[6.944%]">
          <HeroSection />
          <TrustedCompanies />
          <FeaturesSection />
        </div>
      ),
    },
    {
      id: 'tech',
      bg: 'bg-navy',
      dataBgColor: '#191919', // Fallback: navy (Tailwind's gray-900)
      content: <TechSection />,
    },
    {
      id: 'process',
      bg: 'bg-white',
      dataBgColor: '#FFFFFF', // White
      content: (
        <>
          {/* <ProcessSection /> */}
          <Testimonials />
          <CardsSection />
        </>
      ),
    },
    {
      id: 'cta',
      bg: 'bg-navy',
      dataBgColor: '#191919', // Navy
      content: <CTASection />,
      className: 'mt-[6.9544%] xl:mt-[120px]',
    },
    {
      id: 'faq',
      bg: 'bg-white',
      dataBgColor: '#FFFFFF', // White
      content: <FAQSection />,
    },
    {
      id: 'footer',
      bg: 'bg-navy',
      dataBgColor: '#1F2937', // Navy
      content: <Footer />,
      className: 'mt-[6.9544%] xl:mt-[120px]',
    },
  ];

  return (
    <>
      <MaxWidth
        className={''}

        data-bg-color={""}
      >
        <Header />
      </MaxWidth>
      {sections.map((section) => (
        <InView
          key={section.id}
          threshold={0}
          rootMargin="0px 0px 0px 0px"
        >
          {({ ref }) => (
            <MaxWidth
              className={`${section.bg} ${section.className || ''}`}
              ref={ref}
              data-bg-color={section.dataBgColor}
            >
              {section.content}
            </MaxWidth>
          )}
        </InView>
      ))}
    </>
  );
};

export default function Landing() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollContextProvider>
        <AnimatedLanding>
          <LandingContent />
        </AnimatedLanding>
      </ScrollContextProvider>
    </Suspense>
  );
}