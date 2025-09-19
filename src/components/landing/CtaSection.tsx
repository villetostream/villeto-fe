import { Button } from "@/components/ui/button"
import { subTitleStyle } from "@/lib/constants/styles"
import { ArrowRight, ArrowUpRightFromSquare } from "lucide-react"
import { HugeiconsIcon } from '@hugeicons/react';
import { CursorInfo02Icon } from '@hugeicons/core-free-icons';

export default function CTASection() {
    return (
        <section className=" bg-navy flex h-full">
            <div className="flex-1">
                <div className="bg-navy h-full flex flex-col   text-left text-white p-[13.9088%]">
                    <h2 className="text-[40px] leading-[60px] font-bold tracking-tight mb-[14px]">
                        Ready to transform your finance operations?
                    </h2>
                    <p className={subTitleStyle}>
                        Join thousands of businesses that trust Villetto to manage their finances. Start your free trial today and
                        see the difference.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-start mt-[50px]">
                        <Button size="lg" variant="hero" className="text-base hover:bg-gray-50">
                            Request Demo <ArrowUpRightFromSquare className="ml-2 h-4 w-4" />

                        </Button>
                        <Button
                            size="lg"
                            variant="hero"
                            className="text-base border-white/20 text-black bg-white hover:bg-white/10"
                        >
                            Talk To Sales <HugeiconsIcon icon={CursorInfo02Icon} />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <img src={"/images/tech-glow.webp"} className="w-full h-full object-cover" />
            </div>
        </section>
    )
}
