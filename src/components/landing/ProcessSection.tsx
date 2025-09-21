import React, { useEffect, useRef, useState } from 'react'
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
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

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

const TimelineStep = ({ step, index }: { step: TimelineStep; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
    const isLeft = step.position === 'left';

    return (
        <motion.div
            ref={ref}
            className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-7 items-center ${isLeft ? 'lg:text-right' : ''}`}
            initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            {/* Timeline Dot & Badge */}
            <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-6 h-6 bg-timeline-teal rounded-full border-4 border-background shadow-lg" />
                <motion.div
                    className="day-badge absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ duration: 0.3, ease: 'backOut', delay: 0.1 }}
                >
                    <div className="bg-timeline-teal text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg whitespace-nowrap">
                        {step.day}
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <motion.div
                className={`${isLeft ? 'lg:order-1 text-left' : 'lg:order-2 text-left ml-16'}`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
                transition={{ duration: 5, ease: 'easeOut', delay: 0.1 }}
            >
                <h2 className="text-[26px] font-semibold leading-[100%] tracking-[0%] text-black mb-5">
                    {step.title}
                </h2>

                <ul className="space-y-3 p-5 list-disc list-inside">
                    {step.points.map((point, pointIndex) => (
                        <motion.li
                            key={pointIndex}
                            className="text-[15px] leading-[23px] font-normal bullet-point"
                            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -30 : 30 }}
                            transition={{
                                duration: 0.6,
                                ease: 'easeOut',
                                delay: 0.2 + (pointIndex * 0.1)
                            }}
                        >
                            {point}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Image */}
            <motion.div
                className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} flex justify-center`}
                initial={{ opacity: 0, x: isLeft ? 100 : -100 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? 100 : -100 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            >
                <div className="relative group">
                    <div className={`${step.position === "right" ? "left-full" : "left-0"} absolute transform -translate-x-1/2 translate-y-1/6 -mt-8`}>
                        <div className="bg-gradient-to-r from-[#006F] via-[#00B8A9] to-[#00B8A9] text-white px-[30px] py-5 w-[148px] rounded-full font-semibold text-[26px] whitespace-nowrap">
                            {step.day}
                        </div>
                    </div>

                    <img
                        src={step.image}
                        alt={`${step.title} illustration`}
                        className="size-[241px] aspect-square object-cover rounded-full bg-gray-300"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export const ProcessSection = () => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const [timelineProgress, setTimelineProgress] = useState(0);

    // Scroll-based timeline line animation
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            setTimelineProgress(latest);
        });
        return unsubscribe;
    }, [scrollYProgress]);
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
                        <motion.div
                            className="w-full bg-gradient-to-b from-primary to-primary"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-32">
                        {timelineData.map((step, index) => (
                            <TimelineStep
                                key={step.day}
                                step={step}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>


        </section >
    )
}