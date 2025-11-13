import React, { useState, useCallback, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Menu, MousePointer2Icon, SquareArrowOutUpRightIcon, X } from 'lucide-react';
import Link from 'next/link';

type ScrollContextType = {

    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
};

const ScrollContext = createContext<ScrollContextType>({

    isMenuOpen: false,
    setIsMenuOpen: () => { },
});

export const useScrollContext = () => useContext(ScrollContext);

// Context Provider Component
export const ScrollContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <ScrollContext.Provider value={{
            isMenuOpen,
            setIsMenuOpen
        }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const Header = () => {
    const { isMenuOpen, setIsMenuOpen } = useScrollContext();

    const menuItems = [
        { name: 'Company', href: '#company' },
        { name: 'Products', href: '#products' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Pricing Plans', href: '#pricing' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[999] max-w-[1560px] mx-auto bg-white">
            <div className="bg-white  border-b border-border/60">
                <div className={`px-6 py-[14px]  flex items-center justify-between bg-white `}>
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <span className={`font-bold text-xl `}>Villeto</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={` hover:text-foreground/80 transition-colors font-normal flex text-lg gap-2 items-center`}
                            >
                                {item.name}
                                {item.name !== 'Company' ? <ChevronDown className="mt-1" /> : null}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="outlinePrimary" size="lg" asChild className={" rounded-[16px] min-w-[171px]"}>
                            <Link href="/pre-onboarding" className='flex items-center'>

                                Sign-in
                                <SquareArrowOutUpRightIcon className="ml-2 h-5 w-5" />
                            </Link>

                        </Button>
                        <Button variant="hero" size="md" asChild className={""}>
                            <Link href="#" className='flex items-center'>
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
                            <X className={`h-5 w-5 ${""}`} />
                        ) : (
                            <Menu className={`h-5 w-5 ${""}`} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        className={`md:hidden bg-white border-t border-border/60 rounded-b-xl `}
                    >
                        <div className="px-6 py-4">
                            <nav className="flex flex-col space-y-4">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={` hover:text-foreground/80 transition-colors font-medium py-2`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="flex flex-col space-y-3 pt-4 border-t border-border/60">
                                    <Button variant="glass" size="sm" className={""}>
                                        Learn More
                                        <MousePointer2Icon className="ml-1 h-4 w-4" />
                                    </Button>
                                    <Button variant="hero" size="lg" asChild className={""}>
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
