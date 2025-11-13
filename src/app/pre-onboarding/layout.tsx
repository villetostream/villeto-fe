import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pre-Onboarding ",
    description: "Email registration",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    // Determine current step from pathname if needed, or let each page handle
    return (
        <div className="flex bg-background h-screen overflow-hidden items-center justify-center">
            <div className="flex-1  w-full h-full bg-white overflow-y-auto relative">

                {children}

            </div>
            <div style={{
                backgroundImage: "url('/layout.png')"
            }} className='hidden lg:flex lg:flex-1 bg-[#E6F8F6] h-full p-8 flex-col bg-no-repeat bg-contain  bg-center '></div>

        </div>
    );
}