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
import { LockPasswordFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

    // useEffect(() => {
    //     const storedEmail = localStorage.getItem("userEmail");
    //     if (!storedEmail) {
    //         router.replace("/");
    //     } else {
    //         setEmail(storedEmail);
    //     }
    // }, [router]);

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
        <div className="min-h-screen w-full  bg-[#E6F8F6] flex items-center justify-center p-4">
            <header className="fixed p-10 top-0 left-0 ">
                <img src="/images/logo.png" className='h-14 w-32 object-cover' alt="Logo" />
            </header>

            <div className="w-full max-w-[600px] bg-card rounded-3xl shadow-2xl p-8 md:p-9">
                <div className="flex flex-col items-center mb-8">
                    <HugeiconsIcon icon={LockPasswordFreeIcons} className="size-10 text-primary mb-10" />

                    <h1 className="text-2xl leading-[100%] font-semibold text-center mb-2.5">Set New Password</h1>
                    <p className="text-muted-foreground text-center text-sm leading-[100%]">
                        Set your password to enhance account security.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                        <div className="flex flex-wrap gap-2.5">
                            <Badge
                                variant={hasMinLength ? "default" : "outline"}
                                className={`px-4 py-2.5 rounded-full text-sm leading-[100%] font-normal ${hasMinLength
                                    ? "bg-primary/5 text-foreground border-primary"
                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                8+ characters
                            </Badge>
                            <Badge
                                variant={hasNumber ? "default" : "outline"}
                                className={`px-4 py-2.5 rounded-full text-sm leading-[100%] font-normal ${hasNumber
                                    ? "bg-primary/5 text-foreground border-primary"
                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                Number
                            </Badge>
                            <Badge
                                variant={hasUppercase ? "default" : "outline"}
                                className={`px-4 py-2.5 !rounded-full text-sm leading-[100%] font-normal ${hasUppercase
                                    ? "bg-primary/5 text-foreground border-primary"

                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                Uppercase Letter
                            </Badge>
                            <Badge
                                variant={hasLowercase ? "default" : "outline"}
                                className={`px-4 py-2.5 rounded-full text-sm leading-[100%] font-normal ${hasLowercase
                                    ? "bg-primary/5 text-foreground border-primary"

                                    : "border-border text-muted-foreground"
                                    }`}
                            >
                                Lowercase Letter
                            </Badge>
                        </div>

                        <Button
                            type="submit"
                            disabled={!allRequirementsMet}
                            size={"md"}
                            className="w-full"
                        >
                            Save Password
                        </Button>

                        {/* <button
                            type="button"
                            onClick={handleSkip}
                            className="w-full text-center text-primary hover:underline font-medium"
                        >
                            Skip for now
                        </button> */}
                    </form>
                </Form>
            </div>
        </div>
    );
};
