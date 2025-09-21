import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SectionTitle from "./shared/SectionTitle"
import { divTitleStyle, subTitleStyle, titleStyle } from "@/lib/constants/styles"
import { cn } from "@/lib/utils"
import { Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { FadeIn } from "./shared/AnimatedLanding"

const faqs = [
    {
        question: "How quickly can we get started with FinFlow?",
        answer:
            "You can get started immediately with our free trial. Most businesses are up and running within 24 hours, with full onboarding support from our team.",
    },
    {
        question: "Is my financial data secure?",
        answer:
            "Absolutely. We use bank-level 256-bit SSL encryption and are SOC 2 Type II certified. Your data is stored in secure, compliant data centers with regular security audits.",
    },
    {
        question: "Can FinFlow integrate with our existing accounting software?",
        answer:
            "Yes, we integrate with popular accounting platforms like QuickBooks, Xero, and many others. We also provide API access for custom integrations.",
    },
    {
        question: "What kind of support do you provide?",
        answer:
            "We offer 24/7 customer support via chat, email, and phone. Plus, dedicated account managers for enterprise customers and comprehensive onboarding assistance.",
    },
    {
        question: "Do you offer custom pricing for large organizations?",
        answer:
            "Yes, we offer flexible pricing plans for enterprises with custom features, dedicated support, and volume discounts. Contact our sales team for a personalized quote.",
    },
]

export default function FAQSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <section className="p-[6.9544%]">
            <SectionTitle text="ENQUIRIES" />
            <FadeIn className={divTitleStyle}>
                <h2 className={cn(titleStyle, "text-black")}>Frequently Asked Questions</h2>
                <p className={cn(subTitleStyle, "max-w-11/12, text-black")}>
                    Lorem ipsum dolor sit amet consectetur. Odio diam nulla massa metus dignissim nibh urna mauris. Ut amet risus
                    malesuada orci bibendum. A volutpat maecenas nunc urna vel commodo.
                </p>
            </FadeIn>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                className="w-full space-y-5 mt-10"
            >
                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <AccordionItem
                                value={`item-${index}`}
                                className={cn(
                                    "group rounded-lg border overflow-hidden bg-[#F6F6F6] transition-colors duration-300",
                                    "data-[state=open]:bg-primary data-[state=open]:text-white"
                                )}
                            >
                                <AccordionTrigger className="flex items-center justify-between w-full text-left text-lg leading-[100%] tracking-[0%] font-semibold px-7 py-7">
                                    {faq.question}
                                    <span className="ml-4 transition-transform duration-300  bg-primary size-5 flex justify-center items-center text-white rounded-full">
                                        <Plus className="h-3 w-3 group-data-[state=open]:hidden" /> {/* plus when closed */}
                                        <Minus className="h-3 w-3 hidden group-data-[state=open]:block" /> {/* minus when open */}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-7 pb-7 text-sm leading-[23px] tracking-[0%] font-normal">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </motion.div>
        </section>
    )
}
