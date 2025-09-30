import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import heroDashboard from '../../../public/images/tech-glow-1.webp'
import { Input } from '../ui/input'
import MaxWidth from '@/lib/constants/MaxWidth'
import SocialProof from './shared/SocialProof'
import { FadeIn } from './shared/AnimatedLanding'
import Link from 'next/link'

export const HeroSection = () => {
    return (

        <section className="pt-48 pb-16 gradient-hero">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-5">
                        <FadeIn className="flex">
                            <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-16">
                                <span>

                                    All-in-One Spend
                                    <br />
                                    Management for
                                </span>{" "}
                                <span className='relative'>
                                    <span className="text-primary"> Business</span>
                                    <div className='absolute top-full left-0 w-full h-1 bg-primary'></div>
                                </span>


                            </h1>
                        </FadeIn>

                        <FadeIn>
                            <p className="text-xl text-muted-foreground ">
                                Corporate cards, automated spend tracking, and vendor payments all under one intelligent platform.
                            </p>
                        </FadeIn>

                        <FadeIn className="flex  gap-4 border rounded-md border-[#E2E2E2] p-2 focus-within:border-muted-foreground max-w-[452px]">
                            <Input className='!border-none focus-visible:border-0 focus-visible:ring-0 !shadow-none' placeholder='What is yout work email' />
                            <Button variant="hero" size="lg" asChild>
                                <Link href="/pre-onboarding" className='flex items-center'>
                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </FadeIn>
                        <SocialProof />
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <FadeIn className="relative">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src={heroDashboard.src}
                                alt="SpendFlow Dashboard"
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-pulse">
                            <div className="text-sm font-medium text-foreground">+47% Cost Savings</div>
                            <div className="text-xs text-muted-foreground">vs manual processes</div>
                        </div>

                        <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 animate-pulse delay-75">
                            <div className="text-sm font-medium text-foreground">Real-time Sync</div>
                            <div className="text-xs text-muted-foreground">Across all platforms</div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}