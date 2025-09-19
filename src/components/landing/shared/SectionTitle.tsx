import { cn } from '@/lib/utils'
import React from 'react'
import { PiMapPinSimpleLight } from 'react-icons/pi'

const SectionTitle = ({ text, className }: { text: String, className?: String }) => {
    return (
        <div className={cn("flex items-center gap-2 mb-5", className)}>

            <PiMapPinSimpleLight className="-rotate-90 text-[#CECECE]" />
            <span className=" px-5 py-4 text-base font-medium">
                {text}
            </span>
            <PiMapPinSimpleLight className="rotate-90 text-[#CECECE]" />
        </ div>
    )
}

export default SectionTitle