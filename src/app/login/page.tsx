// app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-stores';
import { MailAtSign01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import FormFieldInput from '@/components/form fields/formFieldInput';
import CircleProgress from '@/components/HalfProgressCircle';
import { useAuthCheck } from '@/actions/auth/auth-check';

const formSchema = z.object({
    email: z.email().min(1, "email is required").max(100),

});

export default function LoginPage() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    });
    const [error, setError] = useState('');

    const checkAsync = useAuthCheck()
    const isLoading = checkAsync.isPending;
    const router = useRouter();

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {

        setError('');

        try {

            await checkAsync.mutateAsync(data.email);
            router.push(`/login-with-password?email=${encodeURIComponent(data.email)}`);
            // const success = await login(email, password);
            // console.log(`succes is ${success}`)
            // if (success) {
            // } else {
            //     setError('Invalid email or password');
            // }
        } catch (err) {
            //    toast.error()
        }
    };


    return (
        <div className="h-full flex-col flex items-center justify-center">
            <div className='absolute top-0 left-0 mb-auto p-10 flex w-full items-center justify-between'>
                <div>
                    <img src="/images/logo.png" className='h-14 w-32 object-cover' />
                </div>
                <CircleProgress currentStep={1} />
            </div>
            <Card className="w-full bg-white !border-0">
                <CardHeader className="space-y-2.5 ">

                    <HugeiconsIcon icon={MailAtSign01Icon} className="w-10 h-10 text-primary mb-2.5" />

                    <CardTitle className="text-2xl font-semibold leading-[100%]">Sign In to Villeto</CardTitle>
                    <CardDescription>
                        Enter your email address to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className='pt-10'>
                    <Form {...form}>

                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">



                            <FormFieldInput
                                label='Email Address'
                                placeholder="Enter official email"
                                control={form.control}
                                name='email'
                                type='email'
                                inputMode='email'
                            />




                            <Button
                                type="submit"
                                className="w-full mt-10"
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