import React, { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    UserPlus,
    CreditCard,
    BarChart3,
    CheckCircle,
    ArrowRight
} from 'lucide-react'
import SectionTitle from './shared/SectionTitle'
import { divTitleStyle, subTitleStyle, titleStyle } from '@/lib/constants/styles'
import { useGSAP } from "@gsap/react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger);

const description = [
    "           Lorem ipsum dolor sit amet consectetu pellentesque in donec eu. ",
    "Risus dui consectetur in aliquet elementum aliquet. ",
    "Consequat malesuada faucibus ac varius scelerisque venenatis leo arcu.",
    "Cras sapien massa id tellus tellus id vitae convallis. ",
    "At mattis aliquam lectus cras facilisis. ",
    "Et phasellus faucibus risus ultrices turpis. Etiam posuere nibh pharetra."
];

const processSteps = [
    {
        step: '01',
        icon: UserPlus,
        title: 'Sign Up',
        description: description,
        duration: '2 minutes',
        reverse: true,
    },
    {
        step: '02',
        icon: CreditCard,
        title: 'Issue Cards',
        description: description,
        duration: '5 minutes',
        reverse: false,

    },
    {
        step: '03',
        icon: BarChart3,
        title: 'Track & Analyze',
        description: description,
        duration: 'Real-time',
        reverse: true,

    },
    {
        step: '04',
        icon: CheckCircle,
        title: 'Optimize',
        description: description,
        duration: 'Ongoing'
    }
]
interface TimelineStep {
    day: string;
    title: string;
    description: string;
    points: string[];
    image: string;
    position: 'left' | 'right';
}

const timelineData: TimelineStep[] = [
    {
        day: 'DAY 1',
        title: 'Get Started',
        description: 'Set up Villeto in just a few steps and start simplifying how your team tracks, approves, and manages expenses, so you can focus on what truly matters',
        points: [
            'Complete account setup and team onboarding process',
            'Configure expense categories and approval workflows',
            'Connect your banking and payment methods securely',
            'Set up automated expense tracking and receipt scanning',
            'Train your team on the intuitive expense management interface',
            'Establish spending limits and budget controls for different departments'
        ],
        image: "/images/tech-glow.webp",
        position: 'right'
    },
    {
        day: 'DAY 15',
        title: 'Get Comfortable',
        description: 'Your team is now familiar with the platform and experiencing the benefits of streamlined expense management and real-time financial visibility',
        points: [
            'Review automated expense categorization and reporting accuracy',
            'Analyze spending patterns and identify cost optimization opportunities',
            'Fine-tune approval workflows based on team feedback and usage data',
            'Integrate with existing accounting software and financial systems',
            'Set up advanced reporting dashboards for stakeholder visibility',
            'Optimize mobile app usage for on-the-go expense tracking'
        ],
        image: "/images/tech-glow.webp",
        position: 'left'
    },
    {
        day: 'DAY 30',
        title: 'Get Results',
        description: 'Experience the full power of effortless expense control with complete financial transparency and streamlined operations across your organization',
        points: [
            'Achieve complete visibility into company-wide spending patterns',
            'Reduce expense processing time by up to 80% with automation',
            'Generate comprehensive financial reports for strategic decision making',
            'Implement advanced budget controls and spend management policies',
            'Scale the system across multiple departments and locations',
            'Celebrate improved financial compliance and audit readiness'
        ],
        image: "/images/tech-glow.webp",
        position: 'right'
    }
];

export const ProcessSection = () => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the timeline line based on scroll
            gsap.to(lineRef.current, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                }
            });

            // Animate each timeline step
            stepRefs.current.forEach((step, index) => {
                if (!step) return;

                const isLeft = timelineData[index].position === 'left';

                gsap.fromTo(step, {
                    opacity: 0,
                    x: isLeft ? -100 : 100,
                    y: 50
                }, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                });

                // Animate the day badge separately for extra emphasis
                const dayBadge = step.querySelector('.day-badge');
                if (dayBadge) {
                    gsap.fromTo(dayBadge, {
                        scale: 0,
                        rotation: -180
                    }, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.8,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 70%',
                        }
                    });
                }

                // Stagger animate the bullet points
                const bulletPoints = step.querySelectorAll('.bullet-point');
                gsap.fromTo(bulletPoints, {
                    opacity: 0,
                    x: isLeft ? -30 : 30
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 60%',
                    }
                });
            });
        }, timelineRef);

        return () => ctx.revert();
    }, []);
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            // Timeline card animations
            gsap.utils.toArray('.timeline-card').forEach((card: any) => {
                gsap.from(card, {
                    xPercent: -100,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%'
                    }
                });
            });

            gsap.to('.timeline', {
                transformOrigin: 'bottom bottom',
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: ".timeline",
                    start: "top center",
                    end: "70% center",
                    onUpdate: (self) => {
                        gsap.to(".timeline", {
                            scaleY: 1 - self.progress
                        });
                    }
                }
            });

            // Slide-in animations for images
            gsap.utils.toArray('.slide-in-image').forEach((img: any) => {
                const direction = img.classList.contains('slide-from-left') ? -100 : 100;
                gsap.from(img, {
                    x: direction,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: img,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Slide-in animations for text
            gsap.utils.toArray('.slide-in-text').forEach((text: any) => {
                const direction = text.classList.contains('slide-from-left') ? -50 : 50;
                gsap.from(text, {
                    x: direction,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 70%',
                        end: 'bottom 30%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Dynamic color change for timeline logos based on timeline progress
            const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']; // Blue, Green, Yellow, Red
            gsap.utils.toArray('.timeline-logo div').forEach((logo: any, index: number) => {
                gsap.set(logo, { backgroundColor: '#6b7280' }); // Initial grey
                gsap.to(logo, {
                    backgroundColor: colorPalette[index % colorPalette.length],
                    ease: 'none',
                    scrollTrigger: {
                        trigger: logo,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: true
                    }
                });
            });

            // Text animations
            gsap.utils.toArray('.expText').forEach((text: any) => {
                gsap.from(text, {
                    xPercent: 0,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 60%'
                    }
                });
            });
        });

        return () => ctx.revert(); // Cleans up ALL animations and ScrollTriggers
    }, []);
    return (
        <section id="process" className="p-[6.9544%] bg-background">
            <SectionTitle text={"YOUR JOURNEY"} />
            {/* Section Header */}
            <div className={`${divTitleStyle} fade-in`}>

                <h2 className={titleStyle}>
                    Effortless Expense Control, From Day One.
                </h2>
                <p className={subTitleStyle}>
                    Set up Villeto in just a few steps and start simplifying how your team tracks, approves, and manages expenses, so you can focus on what truly matters
                </p>
            </div>

            <div className='mt-32 relative'>
                {/* Timeline */}
                <div ref={timelineRef} className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-black h-full">
                        <div
                            ref={lineRef}
                            className="w-full bg-gradient-to-b from-primary to-primary h-0 transition-all duration-300"
                        />
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-32">
                        {timelineData.map((step, index) => (
                            <div
                                key={step.day}
                                ref={el => stepRefs.current[index] = el}
                                className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-7 items-center ${step.position === 'left' ? 'lg:text-right' : ''
                                    }`}
                            >
                                {/* Timeline Dot & Badge */}
                                <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="w-6 h-6 bg-timeline-teal rounded-full border-4 border-background shadow-lg" />
                                    <div className="day-badge absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8">
                                        <div className="bg-timeline-teal text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg whitespace-nowrap">
                                            {step.day}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={`${step.position === 'left' ? 'lg:order-1 text-left' : 'lg:order-2 text-left ml-16'}`}>

                                    <h2 className="text-[26px] font-semibold leading-[100%] tracking-[0%]  text-black mb-5">
                                        {step.title}
                                    </h2>



                                    <ul className="space-y-3 p-5 list-disc list-inside">
                                        {step.points.map((point, pointIndex) => (
                                            <li
                                                key={pointIndex}
                                                className="  text-[15px] leading-[23px] font-normal"
                                            >
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Image */}
                                <div className={`${step.position === 'left' ? 'lg:order-2' : 'lg:order-1'} flex justify-center`}>
                                    <div className="relative group">


                                        <div className={`${step.position === "right" ? "left-full" : "left-0"} absolute transform -translate-x-1/2 translate-y-1/6 -mt-8`}>
                                            <div className="bg-gradient-to-r from-[#006F] via-[#00B8A9] to-[#00B8A9] text-white px-[30px] py-5 w-[148px] rounded-full font-semibold text-[26px] whitespace-nowrap">
                                                {step.day}
                                            </div>
                                        </div>

                                        <img
                                            src={step.image}
                                            alt={`${step.title} illustration`}
                                            className=" size-[241px] aspect-square object-cover rounded-full bg-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </section >
    )
}