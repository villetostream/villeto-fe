import { useEffect, useRef } from "react";

interface LogoItem {
  id: string;
  name: string;
  svg: React.ReactNode;
  year?: string;
}

interface MarqueeProps {
  items: LogoItem[];
  speed?: number;
  gap?: number;
}

export default function Marquee({ items, speed = 30, gap = 28 }: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Clone items for seamless loop
    const container = marquee.querySelector(".marquee-content") as HTMLElement;
    if (!container) return;

    // Calculate total width for animation
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const itemWidth = firstChild.offsetWidth;
    const totalWidth = itemWidth * items.length;

    // Set CSS variable for animation
    marquee.style.setProperty("--marquee-width", `${totalWidth}px`);
    marquee.style.setProperty("--marquee-speed", `${speed}s`);

    // Start animation
    container.style.animation = `marquee ${speed}s linear infinite`;
  }, [items.length, speed]);

  return (
    <div
      ref={marqueeRef}
      className="w-full overflow-hidden bg-background py-8 md:py-12"
    >
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50%));
          }
        }

        .marquee-content {
          display: flex;
          gap: ${gap}px;
          width: fit-content;
        }

        .marquee-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: fit-content;
        }

        .marquee-item:hover .marquee-label {
          opacity: 1;
          transform: translateY(0);
        }

        .marquee-label {
          opacity: 0;
          transform: translateY(-8px);
          transition: all 200ms ease-out;
        }
      `}</style>

      <div className="marquee-content">
        {/* Original items */}
        {items.map((item) => (
          <div key={item.id} className="marquee-item group/logo">
            <div className="relative flex flex-col items-center">
              <div className="h-8 flex items-center justify-center opacity-40 transition-all duration-200 group-hover/logo:opacity-100">
                {item.svg}
              </div>
              {item.year && (
                <div className="marquee-label absolute top-10 mt-2 whitespace-nowrap rounded-full bg-gray-100 px-1.5 py-1">
                  <span className="text-xs leading-none text-gray-600">
                    Since {item.year}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Duplicate items for seamless loop */}
        {items.map((item) => (
          <div key={`${item.id}-duplicate`} className="marquee-item group/logo">
            <div className="relative flex flex-col items-center">
              <div className="h-8 flex items-center justify-center opacity-40 transition-all duration-200 group-hover/logo:opacity-100">
                {item.svg}
              </div>
              {item.year && (
                <div className="marquee-label absolute top-10 mt-2 whitespace-nowrap rounded-full bg-gray-100 px-1.5 py-1">
                  <span className="text-xs leading-none text-gray-600">
                    Since {item.year}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
