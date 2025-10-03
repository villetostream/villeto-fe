import React from 'react'
import { Button } from '@/components/ui/button'

import { divTitleStyle, subTitleStyle, titleStyle } from '@/lib/constants/styles'
import SectionTitle from './shared/SectionTitle'
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import { SlideRight, SlideLeft, FadeIn } from './shared/AnimatedLanding'

const techFeatures = [
    {
        title: 'Speed up expense process',
        description: 'Villeto accelerates the entire expense cycle; from submission to approval and reimbursement. Employees capture receipts instantly, policies are enforced automatically, and managers approve with a click. With faster turnaround times and fewer bottlenecks, your organization saves time, reduces errors, and keeps teams focused on what matters most.',
        image: "/images/benefit-1.webp",
        reverse: true
    },
    {
        title: 'Reduce Policy Breaches',
        description: 'Villeto embeds compliance into every stage of the expense process. Automated checks flag out-of-policy spend instantly, while spending limits and approval workflows keep teams aligned with company guidelines. With real-time visibility and transparent reporting, finance leaders can reduce violations, strengthen accountability, and protect the organization from unnecessary risk.',
        image: "/images/benefit-2.webp",
        reverse: false
    },
    {
        title: 'Automate Approvals',
        description: 'Villeto streamlines approval workflows by automating every step of the process. Expenses and payments are routed to the right managers instantly, with built-in policy checks to ensure compliance. Approvals happen faster, bottlenecks are eliminated, and finance teams gain real-time visibility; freeing leaders to focus on strategy, not paperwork.',
        image: "/images/benefit-3.webp",
        reverse: true
    },
    {
        title: 'Accurate month-end close',
        description: 'Villeto speeds up the close process by automating reconciliations, consolidating data, and ensuring accuracy every ledger. With real-time syncing and built-in compliance, finance teams can eliminate manual errors, reduce delays, and finalize reports faster. The result: a smooth, more efficient month-end close that gives leaders timely insights and peace of mind.',
        image: "/images/benefit-4.webp",
        reverse: false
    }
]

export const TechSection = () => {
    return (
        <section id="solutions" className=" bg-navy p-[6.944%]">
            <SectionTitle text={"BENEFIT & VALUES"} className="text-white" />
            {/* Section Header */}
            <FadeIn className={`${divTitleStyle} text-white !max-w-11/12`}>
                <h2 className={titleStyle}>
                    Empowering Finance, Enabling Growth.
                </h2>
                <p className={subTitleStyle}>
                    Villeto helps organizations streamline financial operations, improve visibility,
                    and stay in control. With smarter tools and automated workflows, your team gains the clarity,
                    efficiency, and confidence to make better decisions and drive sustainable growth.
                </p>
            </FadeIn>

            {/* Tech Features */}
            <div className="space-y-[12.5%] mt-[6.944%] w-full">
                {techFeatures.map((feature, index) => (
                    <div
                        key={feature.title}
                        className={`grid lg:grid-cols-2 gap-[6.25%] items-center ${feature.reverse ? 'lg:grid-flow-col-dense' : ''}`}
                    >
                        {/* Content */}
                        <div className={` ${feature.reverse ? 'lg:col-start-2' : ''}`}>
                            <SlideRight>
                                <h3 className="text-[28px] leading-[100%] font-semibold text-navy-foreground tracking-[0%] mb-5">
                                    {feature.title}
                                </h3>
                                <p className="text-lg leading-[30px] text-navy-foreground/80 font-normal whitespace-break-spaces mb-8">
                                    {feature.description}
                                </p>
                                <Button variant="ghost" size="lg" className="group text-white text-xl font-medium">
                                    Learn More
                                    <HiOutlineArrowUpRight className="size-[22px] group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SlideRight>
                        </div>

                        {/* Image */}
                        <div className={`relative ${feature.reverse ? 'lg:col-start-1' : ''}`}>
                            <SlideLeft>
                                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                                </div>

                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-primary/20 rounded-xl blur-xl opacity-30" />
                            </SlideLeft>
                        </div>
                    </div>
                ))}
            </div>



        </section>
    )
}