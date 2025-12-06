import React from 'react'

const DataIntegrationLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <div className='px-7 space-y-7'>
            <div>
                <h2 className="font-bold text-3xl ">Business Data Integration</h2>
                <p className="text-base font-normal leading-[100%] text-muted-foreground mt-3.5 ">Choose a method to import your company infomation. You can connect to an existing service or upload a file directly.</p>
            </div>
            {children}

        </div>
    )
}

export default DataIntegrationLayout