import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Twitter, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';

import { HugeiconsIcon } from '@hugeicons/react';
import { Rocket01Icon, TwitterSquareIcon } from '@hugeicons/core-free-icons';
import { FadeIn } from './shared/AnimatedLanding';

const Footer = () => {
    const footerSections = {
        Company: [
            'Home',
            'About Us',
            'Features',
            'Pricing',
            'Products',
            'Solutions'
        ],
        Legal: [
            'Privacy Policy',
            'Cookie Policy',
            'Terms of Service'
        ],
        Socials: [
            'X (Twitter)',
            'Instagram',
            'LinkedIn',
            'Facebook',
            'YouTube'
        ],
        Support: [
            'FAQs',
            'Contact Us'
        ]
    };

    const socialIcons = [
        { icon: Twitter, label: 'Twitter' },
        { icon: Instagram, label: 'Instagram' },
        { icon: Linkedin, label: 'LinkedIn' },
        { icon: Youtube, label: 'YouTube' },
        { icon: Facebook, label: 'Facebook' }
    ];

    return (
        <footer className="bg-navy border-t border-border">
            <div className="mx-auto px-6 p-[6.9544%]">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Footer Links - 4 columns */}
                    {Object.entries(footerSections).map(([title, links]) => (
                        <div key={title} className="lg:col-span-1">
                            <h3 className="font-semibold text-white mb-9 text-base">{title}</h3>
                            <ul className="space-y-6">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-white hover:text-white/90 font-normal text-sm transition-smooth"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Brand and Newsletter - 2 columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-lg">V</span>
                                </div>
                                <span className="text-xl font-bold text-white">Villeto</span>
                            </div>
                            <p className="text-white font-normal">
                                All Your Financial Tools, One Powerful Suite.
                            </p>
                        </div>

                        {/* Newsletter Signup */}
                        <div>
                            <h3 className="font-semibold text-white mb-2">Join our newsletter</h3>
                            <p className="text-white font-normal text-sm mb-4">
                                We will send you updates from time to time. No spam
                            </p>
                            <FadeIn className="flex  gap-4 border rounded-md border-[#E2E2E2] p-2 focus-within:border-muted-foreground max-w-[452px]">
                                <Input className='!border-none focus-visible:border-0 focus-visible:ring-0 !shadow-none !placeholder-white' placeholder='Enter your email address' />
                                <Button variant="hero" size="lg">
                                    Subscribe
                                    <HugeiconsIcon icon={Rocket01Icon} />
                                </Button>
                            </FadeIn>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-border/20">
                    <p className="text-white text-sm">
                        © 2025 Villeto. All rights reserved.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {socialIcons.map(({ icon: Icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                className="w-10 h-10 y transition-smooth flex items-center justify-center group"
                                aria-label={label}
                            >
                                <Icon className="w-5 h-5 text-white group-hover:text-white transition-smooth" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;