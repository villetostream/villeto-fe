"use client"
import React, { useEffect, useRef, useState } from 'react'

interface AnimatedLandingProps {
    children: React.ReactNode
}

const AnimatedLanding = ({ children }: AnimatedLandingProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [hasInitialized, setHasInitialized] = useState(false)

    useEffect(() => {
        // Only import and run GSAP if not already initialized
        if (!hasInitialized) {
            import('gsap').then(({ gsap }) => {
                import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
                    gsap.registerPlugin(ScrollTrigger)

                    // Initial page load animation - runs only once
                    const tl = gsap.timeline({
                        onComplete: () => setHasInitialized(true)
                    })

                    tl.from('.header-animate', {
                        y: -100,
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out'
                    })
                        .from('.hero-animate', {
                            y: 50,
                            opacity: 0,
                            duration: 1.2,
                            stagger: 0.2,
                            ease: 'power3.out'
                        }, '-=0.5')

                    // Scroll-triggered animations - run only once per element
                    const setupScrollAnimations = () => {
                        gsap.utils.toArray('.fade-in').forEach((element: any, index: number) => {
                            gsap.fromTo(element,
                                {
                                    opacity: 0,
                                    y: 60
                                },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 1.2,
                                    ease: 'power3.out',
                                    scrollTrigger: {
                                        trigger: element,
                                        start: 'top 85%',
                                        end: 'bottom 15%',
                                        toggleActions: 'play none none none', // Only play, never reverse
                                        once: true // Critical: ensures animation only happens once
                                    }
                                }
                            )
                        })

                        gsap.utils.toArray('.slide-left').forEach((element: any) => {
                            gsap.fromTo(element,
                                {
                                    x: 100,
                                    opacity: 0
                                },
                                {
                                    x: 0,
                                    opacity: 1,
                                    duration: 1.2,
                                    ease: 'power3.out',
                                    scrollTrigger: {
                                        trigger: element,
                                        start: 'top 85%',
                                        toggleActions: 'play none none none',
                                        once: true
                                    }
                                }
                            )
                        })

                        gsap.utils.toArray('.slide-right').forEach((element: any) => {
                            gsap.fromTo(element,
                                {
                                    x: -100,
                                    opacity: 0
                                },
                                {
                                    x: 0,
                                    opacity: 1,
                                    duration: 1.2,
                                    ease: 'power3.out',
                                    scrollTrigger: {
                                        trigger: element,
                                        start: 'top 85%',
                                        toggleActions: 'play none none none',
                                        once: true
                                    }
                                }
                            )
                        })
                    }

                    // Small delay to ensure DOM is ready
                    setTimeout(setupScrollAnimations, 100)
                })
            })
        }

        // Cleanup function
        return () => {
            import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill())
            })
        }
    }, [hasInitialized])

    return (
        <div ref={containerRef} className="overflow-hidden relative w-full">
            {children}
        </div>
    )
}

export default AnimatedLanding