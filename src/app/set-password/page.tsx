"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function SetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (!storedEmail) {
            router.replace("/");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Password validation checks
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    const allRequirementsMet = hasMinLength && hasNumber && hasUppercase && hasLowercase;

    // Calculate password strength
    const getPasswordStrength = () => {
        let strength = 0;
        if (hasMinLength) strength++;
        if (hasNumber) strength++;
        if (hasUppercase) strength++;
        if (hasLowercase) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength();

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return "bg-[hsl(var(--strength-weak))]";
        if (passwordStrength <= 2) return "bg-[hsl(var(--strength-medium))]";
        return "bg-[hsl(var(--strength-strong))]";
    };

    const onSubmit = (data: FormData) => {
        if (!allRequirementsMet) {
            toast.error("Please meet all password requirements");
            return;
        }
        console.log(data);
        toast.success("Password set successfully!");
        // Navigate to dashboard or next step
        setTimeout(() => router.replace("/"), 1500);
    };

    const handleSkip = () => {
        router.replace("/");
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[hsl(174,72%,66%)] to-[hsl(203,89%,78%)] flex items-center justify-center p-4">
            {/* <div className="absolute top-8 left-8">
                <VilletoLogo />
            </div> */}

            <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 md:p-12">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center mb-4">
                        <Lock className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{email}</p>

                    <h1 className="text-3xl font-bold text-center mb-2">Set Password</h1>
                    <p className="text-muted-foreground text-center">
                        Set your password to enhance account security.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>
                                            Create a Password<span className="text-destructive">*</span>
                                        </FormLabel>
                                        {password && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Security level</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`w-6 h-1 rounded-full ${level <= passwordStrength ? getStrengthColor() : "bg-muted"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••••••"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setPassword(e.target.value);
                                                }}
                                                className="h-12 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Confirm Password<span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••••••"
                                                {...field}
                                                className="h-12 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={hasMinLength ? "default" : "outline"}
                                className={`px-4 py-2 ${hasMinLength
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                8+ characters
                            </Badge>
                            <Badge
                                variant={hasNumber ? "default" : "outline"}
                                className={`px-4 py-2 ${hasNumber
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                Number
                            </Badge>
                            <Badge
                                variant={hasUppercase ? "default" : "outline"}
                                className={`px-4 py-2 ${hasUppercase
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                Uppercase Letter
                            </Badge>
                            <Badge
                                variant={hasLowercase ? "default" : "outline"}
                                className={`px-4 py-2 ${hasLowercase
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                Lowercase Letter
                            </Badge>
                        </div>

                        <Button
                            type="submit"
                            disabled={!allRequirementsMet}
                            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted"
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

                        <button
                            type="button"
                            onClick={handleSkip}
                            className="w-full text-center text-primary hover:underline font-medium"
                        >
                            Skip for now
                        </button>
                    </form>
                </Form>
            </div>
        </div>
    );
};
