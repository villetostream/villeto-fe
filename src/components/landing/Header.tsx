import React, { useState, useCallback, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Menu, MousePointer2Icon, SquareArrowOutUpRightIcon, X } from 'lucide-react';
import Link from 'next/link';

type ScrollContextType = {
    handleSectionEnter: (entry: IntersectionObserverEntry) => void;
    textColor: string;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
};

const ScrollContext = createContext<ScrollContextType>({
    handleSectionEnter: () => {
        console.log("default context function");
    },
    textColor: 'text-black',
    isMenuOpen: false,
    setIsMenuOpen: () => { },
});

export const useScrollContext = () => useContext(ScrollContext);

// Context Provider Component
export const ScrollContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [textColor, setTextColor] = useState('text-black'); // Default
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ✅ This gets called whenever a section enters view
    const handleSectionEnter = useCallback((entry: IntersectionObserverEntry) => {
        console.log("in the section enter callback");
        if (!entry.isIntersecting) return;

        const sectionEl = entry.target as HTMLElement;
        const dataBgColor = sectionEl.getAttribute('data-bg-color');
        console.log('Section entered view:', sectionEl.id, 'with data-bg-color:', dataBgColor);

        if (dataBgColor) {

            // Use the data-bg-color attribute for more reliable color detection
            const bgColor = dataBgColor;

            try {
                // Simple luminance calculation from hex values
                const hex = bgColor.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16) / 255;
                const g = parseInt(hex.substr(2, 2), 16) / 255;
                const b = parseInt(hex.substr(4, 2), 16) / 255;
                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                const newTextColor = luminance > 0.5 ? 'text-black' : 'text-white';
                console.log('Setting text color to:', newTextColor, 'for background:', bgColor);
                setTextColor(newTextColor);
            } catch (e) {
                console.warn('Invalid color:', bgColor, e);
                setTextColor('text-black');
            }
        } else {
            // Fallback to computed style
            const bgColor = window.getComputedStyle(sectionEl).backgroundColor;
            console.log('Using computed style:', bgColor);

            try {
                // Simple luminance calculation from RGB values
                const rgb = bgColor.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    const r = parseInt(rgb[0]) / 255;
                    const g = parseInt(rgb[1]) / 255;
                    const b = parseInt(rgb[2]) / 255;
                    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    const newTextColor = luminance > 0.5 ? 'text-black' : 'text-white';
                    setTextColor(newTextColor);
                } else {
                    setTextColor('text-black');
                }
            } catch (e) {
                console.warn('Invalid color:', bgColor, e);
                setTextColor('text-black');
            }
        }
    }, []);

    return (
        <ScrollContext.Provider value={{
            handleSectionEnter,
            textColor,
            isMenuOpen,
            setIsMenuOpen
        }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const Header = () => {
    const { textColor, isMenuOpen, setIsMenuOpen } = useScrollContext();

    const menuItems = [
        { name: 'Company', href: '#company' },
        { name: 'Products', href: '#products' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Pricing Plans', href: '#pricing' },
    ];

    return (
        <header className="fixed top-0 left-0 w-[calc(100%-2rem)] mx-auto max-w-[1440px] mt-10">
            <div className="bg-white/10 backdrop-blur-md rounded-4xl border border-border/60 shadow-sm xl:mx-[100px] xl:py-[12px]">
                <div className={`px-6 h-16 flex items-center justify-between ${textColor}`}>
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <span className={`font-bold text-xl ${textColor}`}>Villeto</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`${textColor} hover:text-foreground/80 transition-colors font-normal flex text-lg gap-2 items-center`}
                            >
                                {item.name}
                                {item.name !== 'Company' ? <ChevronDown className="mt-1" /> : null}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="glass" size="sm" className={textColor}>
                            Learn More
                            <MousePointer2Icon className="ml-1 h-4 w-4" />
                        </Button>
                        <Button variant="hero" size="lg" asChild className={textColor}>
                            <Link href="/pre-onboarding" className='flex items-center'>
                                See A demo <SquareArrowOutUpRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className={`h-5 w-5 ${textColor}`} />
                        ) : (
                            <Menu className={`h-5 w-5 ${textColor}`} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        className={`md:hidden bg-white/95 backdrop-blur-md border-t border-border/60 rounded-b-xl ${textColor}`}
                    >
                        <div className="px-6 py-4">
                            <nav className="flex flex-col space-y-4">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`${textColor} hover:text-foreground/80 transition-colors font-medium py-2`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="flex flex-col space-y-3 pt-4 border-t border-border/60">
                                    <Button variant="glass" size="sm" className={textColor}>
                                        Learn More
                                        <MousePointer2Icon className="ml-1 h-4 w-4" />
                                    </Button>
                                    <Button variant="hero" size="lg" asChild className={textColor}>
                                        <Link href="/pre-onboarding" className='flex items-center'>
                                            See A demo <SquareArrowOutUpRightIcon className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
