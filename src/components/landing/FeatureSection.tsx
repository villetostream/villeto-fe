import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PiMapPinSimpleLight } from "react-icons/pi";
import {
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  Users,
  Globe,
  ArrowUpRightFromSquareIcon,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { TbCreditCardFilled } from "react-icons/tb";
import {
  divTitleStyle,
  subTitleStyle,
  titleStyle,
} from "@/lib/constants/styles";
import SectionTitle from "./shared/SectionTitle";
import { FadeIn } from "./shared/AnimatedLanding";

const features = [
  {
    icon: TbCreditCardFilled,
    title: "Smart Card Corporate",
    description:
      "Empower teams to spend responsibly with our Smart Corporate Cards; track and control expenses in real time.",
    stats: "99.9% Uptime",
  },
  {
    icon: BarChart3,
    title: "Expense Automation",
    description:
      "Expense submissions and policy checks,  happen seamlessly, saving time while ensuring accuracy and compliance.",
    stats: "40% Cost Reduction",
  },
  {
    icon: Shield,
    title: "Vendor Onboarding & Payments",
    description:
      "With automated onboarding and built-in compliance checks we help you build trust and efficiency with every vendor.",
    stats: "SOC 2 Compliant",
  },
  {
    icon: Zap,
    title: "Accounting Automation",
    description:
      "Replace spreadsheets with real-time syncing and seamless reporting that keeps your books up to date.",
    stats: "10x Faster Processing",
  },
  {
    icon: Users,
    title: "Payroll Insight",
    description:
      "Villeto gives real-time visibility into payroll, highlighting trends and discrepancies to ensure accuracy and compliance.",
    stats: "500+ Integrations",
  },
  {
    icon: Globe,
    title: "Budgeting",
    description:
      "Easily track budgets, monitor spend, and align every expense with strategy using Villeto’s real-time insights.",
    stats: "180+ Countries",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="pt-5 pb-20 bg-background">
      <FadeIn className="text-center mb-16">
        <SectionTitle text="PRODUCT SUITE" />
        <div className="flex gap-6 items-center justify-between">
          <div className={divTitleStyle}>
            <h2 className={titleStyle}>
              All Your Financial Tools, One Powerful Suite.
            </h2>
            <p className={subTitleStyle}>
              Villeto brings together expense management, budgeting, and
              reporting in one seamless platform, designed to give your team
              clarity, control, and confidence with every transaction.
            </p>
          </div>
          <Button variant={"hero"}>
            {" "}
            See All Features <ArrowUpRightFromSquareIcon />
          </Button>
        </div>
      </FadeIn>

      <FadeIn className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/20  !p-5 rounded-3xl !gap-[14px]`}
          >
            <CardHeader className="flex items-center gap-2.5 !p-0">
              <div className="size-[50px] flex justify-center items-center rounded-full bg-[#EAEAEA] group-hover:bg-[#EAEAEA]/80 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base leading-[100%] font-semibold text-foreground">
                {feature.title}
              </h3>
            </CardHeader>
            <CardContent className="!p-0 !pr-4">
              <p className="text-foreground leading-[23px] text-[13px] font-normal">
                {feature.description}
              </p>
            </CardContent>
            <CardFooter className="!p-0">
              <ArrowRight className="size-4 text-muted" />
            </CardFooter>
          </Card>
        ))}
      </FadeIn>
    </section>
  );
};
