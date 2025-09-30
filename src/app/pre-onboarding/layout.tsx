import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pre-Onboarding ",
    description: "Email registration",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    // Determine current step from pathname if needed, or let each page handle
    return (
        <div className="flex p-5 gap-5 bg-background h-screen overflow-hidden">
            <div className='flex-1 bg-gradient-to-br from-[#84ECE4]  via-[#00B1A2] to-[#A4F3ED] h-full p-8 flex flex-col rounded-[30px]'></div>

            <div className="flex-1  p-8 px-[5.43777%] w-full h-full bg-white overflow-y-auto">

                {children}

            </div>
        </div>
    );
}