"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionTitle from "./shared/SectionTitle";
import { divTitleStyle, subTitleStyle, titleStyle } from "@/lib/constants/styles";

const testimonials = [
    {
        name: "James David",
        role: "CEO, Banex Finances",
        image: "/avatars/avatar1.jpg",
        text: "Lorem ipsum dolor sit amet consectetur. Urna adipiscing aliquam est in euismod platea non amet. Lorem ipsum dolor sit amet consectetur. Urna adipiscing aliquam est in euismod platea non amet.",
    },
    {
        name: "James David",
        role: "CEO, Banex Finances",
        image: "/avatars/avatar2.jpg",
        text: "Lorem ipsum dolor sit amet consectetur. Urna adipiscing aliquam est in euismod platea non amet. Lorem ipsum dolor sit amet consectetur. Urna adipiscing aliquam est in euismod platea non amet.",
    },
    {
        name: "James David",
        role: "CEO, Banex Finances",
        image: "/avatars/avatar3.jpg",
        text: "Lorem ipsum dolor sit amet consectetur. Urna adipiscing aliquam est in euismod platea non amet. Lorem ipsum dolor sit amet consectetur. Urna adipiscing aliquam est in euismod platea non amet.",
    },
];


const centerImages = [
    { src: "/images/testimonial-6.webp", height: 300 },
    { src: "/images/testimonial-7.webp", height: 300 },
    { src: "/images/testimonial-8.webp", height: 300 },
    { src: "/images/testimonial-9.webp", height: 300 },
];

// Define masonry image layouts with proper heights to match reference
const leftColumnImages = [
    { src: "/images/testimonial-1.jpg", height: 180 },
    { src: "/images/testimonial-2.jpg", height: 180 },

];

const leftColumnImagesSecond = [
    { src: "/images/testimonial-3.jpg", height: 150 },
    { src: "/images/testimonial-4.jpg", height: 150 },
    { src: "/images/testimonial-5.jpg", height: 150 },
];

const rightColumnImages = [
    { src: "/images/testimonial-10.webp", height: 150 },
    { src: "/images/testimonial-11.webp", height: 150 },
    { src: "/images/testimonial-12.webp", height: 150 },
];

const rightColumnImagesSecond = [
    { src: "/images/testimonial-13.webp", height: 180 },
    { src: "/images/testimonial-14.webp", height: 180 },
];

export default function Testimonials() {
    return (
        <section className=" bg-white relative overflow-hidden px-[6.9544%] pt-40">
            {/* Masonry grid of images */}
            <div className="grid xl:grid-cols-10  gap-5">
                {/* Left column */}
                {/* Left Column - Two sub-columns */}
                <div className="hidden lg:flex gap-5 col-span-2 col-start-2">
                    {/* Left Sub-column */}
                    <div className="space-y-5 mt-12">
                        {leftColumnImages.map((img, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl"
                                style={{ height: `${img.height}px` }}
                            >
                                <img
                                    src={img.src}
                                    alt="Professional business environment"
                                    className="w-[137px] h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Sub-column */}
                    <div className="space-y-5 ">
                        {leftColumnImagesSecond.map((img, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl"
                                style={{ height: `${img.height}px` }}
                            >
                                <img
                                    src={img.src}
                                    alt="Professional business environment"
                                    className="w-[137px] h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Center column with testimonials */}
                <div className="flex flex-col w-fit col-span-4">
                    {/* Top images */}
                    <div className="flex gap-5">
                        {centerImages.map((img, i) => (
                            <div
                                key={i}
                                className={cn("overflow-hidden rounded-2xl w-fit relative ", (i == 0 || i == 3) ? "mt-12" : "-mt-12")}
                                style={{ height: `${img.height}px` }}
                            >
                                <img
                                    src={img.src}
                                    alt="team"
                                    className="w-[137px] h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Testimonials title */}
                    <div className={cn("flex flex-col w-full items-center", divTitleStyle, "mx-auto !max-w-full")}>
                        <SectionTitle text={"Testimonial"} className={"w-fit"} />
                        <h1 className={cn(titleStyle, "w-fit")}>Trusted by Teams Everywhere</h1>
                        <span className={cn(subTitleStyle, "text-wrap text-center ")}>Don’t just take our word for it, discover how Villeto helps businesses save time, reduce errors, and stay in control.</span>
                    </div>

                </div>

                {/* Right Column - Two sub-columns */}
                <div className="hidden lg:flex col-span-2 gap-4">
                    {/* Left Sub-column */}
                    <div className="space-y-4">
                        {rightColumnImages.map((img, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl"
                                style={{ height: `${img.height}px` }}
                            >
                                <img
                                    src={img.src}
                                    alt="Professional business environment"
                                    className="w-[137px] h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Sub-column */}
                    <div className="space-y-4 mt-12">
                        {rightColumnImagesSecond.map((img, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl"
                                style={{ height: `${img.height}px` }}
                            >
                                <img
                                    src={img.src}
                                    alt="Professional business environment"
                                    className="w-[137px] h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Testimonials Cards */}
            <div className=" mx-auto grid gap-5 md:grid-cols-3 mt-20 ">
                {testimonials.map((item, i) => (
                    <Card
                        key={i}
                        className="bg-white text-black shadow-xl rounded-2xl p-5"
                    >
                        <CardContent className="space-y-0">
                            {/* Stars */}
                            <div className="flex gap-1 text-yellow-500">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} size={18} fill="currentColor" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-sm leading-6 tracking-[0%]  font-normal mt-5 mb-[30px]">{item.text}</p>

                            {/* User info */}
                            <div className="flex items-center gap-3">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={44}
                                    height={44}
                                    className="rounded-full"
                                />
                                <div>
                                    <h4 className="font-semibold text-base">{item.name}</h4>
                                    <p className="text-sm font-normal ">{item.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}