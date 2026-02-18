import QueryProvider from "@/providers/queryClientProvider";

export default function VerifyOtpLayout({ children }: { children: React.ReactNode }) {
    // This layout overrides the pre-onboarding layout for the OTP page
    // The OTP page renders its own sidebar internally
    return (
        <QueryProvider>
            {children}
        </QueryProvider>
    );
}
