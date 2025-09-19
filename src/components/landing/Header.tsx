import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, MousePointer2Icon, SquareArrowOutUpRightIcon, X } from 'lucide-react'

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const menuItems = [
        { name: 'Company', href: '#company' },
        { name: 'Products', href: '#products' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Pricing Plans', href: '#pricing' }
    ]

    return (
        <header className="fixed top-3 left-0 right-0  transform  z-50 w-[calc(100%-2rem)]  mx-auto max-w-[1440px]">
            <div className="bg-white/10 backdrop-blur-md rounded-4xl border border-border/60 shadow-sm xl:mx-[100px] xl:py-[25px]">
                <div className="px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-xl text-foreground">Villeto</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-foreground hover:text-foreground/80 transition-colors font-normal flex text-lg gap-2 items-center"
                            >
                                {item.name}
                                {item.name != "Company" ?
                                    <ChevronDown className='mt-1' /> : null}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="glass" size="sm">
                            Learn More
                            <MousePointer2Icon className="ml-1 h-4 w-4" />
                        </Button>
                        <Button variant="hero" size="sm">
                            See A Demo
                            <SquareArrowOutUpRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border/60 rounded-b-xl">
                        <div className="px-6 py-4">
                            <nav className="flex flex-col space-y-4">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="flex flex-col space-y-3 pt-4 border-t border-border/60">
                                    <Button variant="glass" size="sm">
                                        Learn More
                                        <MousePointer2Icon className="ml-1 h-4 w-4" />
                                    </Button>
                                    <Button variant="hero" size="sm">
                                        See A Demo
                                        <SquareArrowOutUpRightIcon className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}