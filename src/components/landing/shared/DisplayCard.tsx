import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import MaxWidth from '@/lib/constants/MaxWidth';



interface CardProps {
    image: string;
    title: string;
    subtitle: string;
    badge: string;
}

const Card = ({ image, title, subtitle, badge }: CardProps) => {
    return (
        <div className="relative h-80 w-[300px] mx-4 overflow-hidden rounded-2xl transition-all duration-500 ease-out transform hover:shadow-2xl group">
            {/* Badge */}
            <div className="absolute top-4 left-4 z-10 bg-[#EAEAEA4D] border-[#EAEAEA99] border px-3 py-1 rounded-full text-sm font-medium text-white uppercase shadow-md">
                {badge}
            </div>

            {/* Image with dark overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl z-0" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-1" />
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-2xl"
            />

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-2">
                <h3 className="text-[15px] leading-[23px] line-clamp-2 text-wrap text-ellipsis font-normal mb-1">{title}</h3>
            </div>
        </div>
    );
};

const CardCarousel = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const cards = [
        {
            id: 1,
            image: "/images/tech-glow.webp",
            title: "Mountain ",
            subtitle: "Breathtaking alpine landscapes",
            badge: "Nature"
        },
        {
            id: 2,
            image: "/images/tech-glow.webp",
            title: "Forest",
            subtitle: "Peaceful woodland adventures",
            badge: "Adventure"
        },
        {
            id: 3,
            image: "/images/tech-glow.webp",
            title: "Golden ",
            subtitle: "Serene evening moments",
            badge: "Relax"
        },
        {
            id: 1,
            image: "/images/tech-glow.webp",
            title: "Mountain Vista",
            subtitle: "Breathtaking alpine landscapes",
            badge: "Nature"
        },
        {
            id: 2,
            image: "/images/tech-glow.webp",
            title: "Forest Path",
            subtitle: "Peaceful woodland adventures",
            badge: "Adventure"
        },
        {
            id: 3,
            image: "/images/tech-glow.webp",
            title: "Golden Shore",
            subtitle: "Serene evening moments",
            badge: "Relax"
        },
        {
            id: 4,
            image: "/images/tech-glow.webp",
            title: "Lake Reflection",
            subtitle: "Tranquil water scenes",
            badge: "Serene"
        },
        {
            id: 5,
            image: "/images/tech-glow.webp",
            title: "Wild Coast",
            subtitle: "Dramatic ocean views",
            badge: "Coastal"
        }
    ];

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <MaxWidth className={"bg-white"}>

            <div className="relative w-full bg-background">
                <div className="relative">
                    <Carousel
                        setApi={setApi}
                        plugins={[
                            Autoplay({
                                delay: 4000,
                            }),
                        ]}
                        className="w-full"
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {cards.map((card) => (
                                <CarouselItem key={`${card.title}-${card.id}`} className="pl-2 basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    <div className="flex justify-center">
                                        <Card {...card} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] flex items-center justify-center w-12 h-12 rounded-full bg-navy/95 hover:bg-navy/70 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 border-0" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-[70] flex items-center justify-center w-12 h-12 rounded-full bg-navy/95 hover:bg-navy/70 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 border-0" />
                    </Carousel>

                </div>
            </div>
        </MaxWidth>
    );
};

export default CardCarousel;