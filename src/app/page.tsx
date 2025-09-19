"use client"
import React, { Suspense, useEffect, useRef } from 'react'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from '@/components/landing/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeatureSection'
import { TechSection } from '@/components/landing/TechSection'
import { ProcessSection } from '@/components/landing/ProcessSection'
import Marquee from '@/components/landing/Marquee'
import TrustedCompanies from '@/components/landing/TrustedCompanies'
import MaxWidth from '@/lib/constants/MaxWidth'
import FAQSection from '@/components/landing/FaqSection'
import CTASection from '@/components/landing/CtaSection'
import CardsSection from '@/components/landing/CardsSection'
import Testimonials from '@/components/landing/Testimonials'
import Footer from '@/components/landing/Footer'
import AnimatedLanding from '@/components/landing/shared/AnimatedLanding'
import { LoadingFallback } from '@/components/landing/shared/LoadingFallback'
const LandingContent = () => {
  return (
    <>
      <Header />
      <MaxWidth className="bg-background">
        <div className='px-[6.944%]'>
          <HeroSection />
          <TrustedCompanies />
          <FeaturesSection />
        </div>
      </MaxWidth>
      <MaxWidth className="bg-navy">
        <TechSection />
      </MaxWidth>
      <MaxWidth className="bg-white">
        <ProcessSection />
        <Testimonials />
        <CardsSection />
      </MaxWidth>
      <MaxWidth className="bg-navy mt-[6.9544%] xl:mt-[120px]">
        <CTASection />
      </MaxWidth>
      <MaxWidth className="bg-white">
        <FAQSection />
      </MaxWidth>
      <MaxWidth className="bg-navy mt-[6.9544%] xl:mt-[120px]">
        <Footer />
      </MaxWidth>
    </>
  )
}

export default function Landing() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatedLanding>
        <LandingContent />
      </AnimatedLanding>
    </Suspense>
  )
}