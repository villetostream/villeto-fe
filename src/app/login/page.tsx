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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore(state => state.login);
    const isLoading = useAuthStore(state => state.isLoading);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const success = await login(email, password);
            console.log(`succes is ${success}`)
            if (success) {
                router.push('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login to ExpenseFlow</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="owner@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Use &quot;password&quot; as password for any demo account
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">Demo accounts:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="font-medium">Owner</p>
                                <p>owner@example.com</p>
                            </div>
                            <div>
                                <p className="font-medium">Admin</p>
                                <p>admin@example.com</p>
                            </div>
                            <div>
                                <p className="font-medium">Manager</p>
                                <p>manager@example.com</p>
                            </div>
                            <div>
                                <p className="font-medium">Auditor</p>
                                <p>auditor@example.com</p>
                            </div>
                            <div>
                                <p className="font-medium">Employee</p>
                                <p>employee@example.com</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}