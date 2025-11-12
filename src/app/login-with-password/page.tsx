// app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore, User } from '@/stores/auth-stores';
import { Key01Icon, MailAtSign01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import FormFieldInput from '@/components/form fields/formFieldInput';
import CircleProgress from '@/components/HalfProgressCircle';
import { loginSchema } from '@/lib/schemas/schemas';
import { useLogin } from '@/actions/auth/auth-login';


type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const isLoading = useAuthStore(state => state.isLoading);
    const router = useRouter();
    const searchParams = useSearchParams()
    const login = useLogin()
    const setUser = useAuthStore().login;


    const form = useForm<FormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: searchParams.get("email") as string,
            password: ""
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await login.mutateAsync(data);
            setUser(response.data.user as User)
            router.push('/dashboard');

        } catch (err) {

        }
    };


    return (
        <div className="h-full flex-col flex items-center justify-center">
            <div className='absolute top-0 left-0 mb-auto p-10 flex w-full items-center justify-between'>
                <div>
                    <img src="/images/logo.png" className='h-14 w-32 object-cover' alt="Logo" />
                </div>
                <CircleProgress currentStep={2} />
            </div>

            <Card className="w-full bg-white !border-0 ">
                <CardHeader className="space-y-2.5">
                    <HugeiconsIcon icon={Key01Icon} className="w-10 h-10 text-primary mb-2.5" />
                    <CardTitle className="text-2xl font-semibold leading-[100%]">Password</CardTitle>
                    <CardDescription>
                        Enter your password to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent className='pt-6'>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormFieldInput
                                label='Password'
                                placeholder="Enter your password"
                                control={form.control}
                                name='password' // Fixed typo: was 'passord'
                                type={'password'}
                                inputMode='text'
                                showPasswordToggle={true}
                            />
                            <div className='flex justify-end'>
                                <Button type='button' size={"sm"} variant={"link"} onClick={() => {
                                    router.push("/forgot-password")
                                }} className='text-no-underline text-primary !p-0'>
                                    Forgot Password?
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-2"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}