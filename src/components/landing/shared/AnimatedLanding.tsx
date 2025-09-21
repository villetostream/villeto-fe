"use client"
import React, { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedLandingProps {
    children: React.ReactNode
}

const AnimatedLanding = ({ children }: AnimatedLandingProps) => {
    const [hasInitialized, setHasInitialized] = useState(false)

    useEffect(() => {
        // Set initialized after a short delay to allow initial animation
        const timer = setTimeout(() => setHasInitialized(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            className="overflow-hidden relative w-full"
            initial={{ opacity: 0 }}
            animate={hasInitialized ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

// Scroll animation components
export const FadeIn = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

export const SlideLeft = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-15% 0px" })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ x: 100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

export const SlideRight = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-15% 0px" })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedLanding