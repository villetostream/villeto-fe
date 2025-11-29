import React from 'react'

const FormSectionHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <div>
            <h1 className="text-lg leading-[150%] font-medium">{title}</h1>
            <p className="text-xs text-muted-foreground font-normal">
                {description}
            </p>
        </div>
    )
}

export default FormSectionHeader