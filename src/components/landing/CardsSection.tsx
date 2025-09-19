import React from 'react'
import SectionTitle from './shared/SectionTitle'
import { subTitleStyle, titleStyle } from '@/lib/constants/styles'
import { cn } from '@/lib/utils'
import CardCarousel from './shared/DisplayCard'

const CardsSection = () => {
    return (

        <section className="bg-white">
            <div className='p-[6.9544%] pb-[60px]'>
                <SectionTitle text={"How is Villeto Different"} />
                <h2 className={cn(titleStyle)}>
                    Not Just Another Expense Tool
                </h2>
                <p className={cn(subTitleStyle)}>
                    Unlike generic platforms, Villeto is built to automate approvals, enforce policies, and accelerate close, so finance teams save hours, not add more work
                </p>
            </div>
            <CardCarousel />
        </section>
    )
}

export default CardsSection