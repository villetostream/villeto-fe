"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        const storedName = localStorage.getItem("userName");
        if (!storedEmail) {
            router.replace("/");
        } else {
            setEmail(storedEmail);
            setUserName(storedName || "User");
        }
    }, [router]);

    const handleContinue = () => {
        if (otp.length === 6) {
            router.push("/set-password");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[hsl(174,72%,66%)] to-[hsl(203,89%,78%)] flex items-center justify-center p-4">
            {/* <div className="absolute top-8 left-8">
                <VilletoLogo />
            </div> */}

            <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 md:p-12">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center mb-4">
                        <User className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{email}</p>

                    <h1 className="text-3xl font-bold text-center mb-2">Welcome {userName}!</h1>
                    <p className="text-muted-foreground text-center">
                        You have been invited by <span className="text-primary font-semibold">XYZ TECHNOLOGIES</span>.
                    </p>
                    <p className="text-muted-foreground text-center mt-1">
                        Enter your 6-digit OTP code to access your dashboard.
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        className="gap-3"
                    >
                        <InputOTPGroup className="gap-3">
                            <InputOTPSlot index={0} className="w-14 h-14 text-lg border-2 rounded-xl" />
                            <InputOTPSlot index={1} className="w-14 h-14 text-lg border-2 rounded-xl" />
                            <InputOTPSlot index={2} className="w-14 h-14 text-lg border-2 rounded-xl" />
                            <InputOTPSlot index={3} className="w-14 h-14 text-lg border-2 rounded-xl" />
                            <InputOTPSlot index={4} className="w-14 h-14 text-lg border-2 rounded-xl" />
                            <InputOTPSlot index={5} className="w-14 h-14 text-lg border-2 rounded-xl" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <Button
                    onClick={handleContinue}
                    disabled={otp.length !== 6}
                    className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                    Continue
                    <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};
