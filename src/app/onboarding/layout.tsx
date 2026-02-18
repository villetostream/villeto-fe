
import { Metadata } from "next";
import { OnboardingSidebar } from "@/components/onboarding/_shared/OnboardingSidebar";
import QueryProvider from "@/providers/queryClientProvider";
import OnboardingGuard from "@/components/onboarding/_shared/OnboardingGuard";
export const metadata: Metadata = {
  title: "Onboarding ",
  description: "Company onboarding process",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Determine current step from pathname if needed, or let each page handle
  return (
    <div className="flex p-5 gap-5 bg-background h-screen overflow-hidden">
      <OnboardingSidebar />
      <QueryProvider>
        <OnboardingGuard>
          <div className="flex-1  p-8 px-[5.43777%] w-full h-full min-[]: bg-white overflow-y-auto">

            {children}

          </div>
        </OnboardingGuard>
      </QueryProvider>
    </div>
  );
}
