"use client"

import { useOnboardingStore } from '@/stores/useVilletoStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, FileText, ArrowRight } from 'lucide-react';
import { CongratulationsModal } from '@/components/onboarding/CongratulationModal';

export default function ReviewConfirmation() {
    const {
        businessSnapshot,
        userProfiles,
        financialPulse,
        villetoProducts,
        submitApplication,
        showCongratulations
    } = useOnboardingStore();

    const selectedProducts = villetoProducts.filter(product => product.selected);

    return (
        <div className="space-y-8">
            {showCongratulations && (<CongratulationsModal />)}
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-villeto-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-villeto-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Confirmation</h1>
                <p className="text-gray-600">Please go through the information you have provided before submission</p>
            </div>

            {/* Business Snapshot */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Business Snapshot</CardTitle>
                    <Button variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Business Name</p>
                        <p className="font-medium">{businessSnapshot.businessName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Country of Registration</p>
                        <p className="font-medium">{businessSnapshot.countryOfRegistration}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                        <p className="font-medium">{businessSnapshot.contactNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Website</p>
                        <p className="font-medium text-villeto-primary">{businessSnapshot.website}</p>
                    </div>
                </CardContent>
            </Card>

            {/* User Profiles */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">User Profiles</CardTitle>
                    <Button variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        {userProfiles.filter(p => p.percentage).length} Beneficial Owners and {userProfiles.filter(p => !p.percentage).length} Controlling Officers added
                    </p>
                    <div className="space-y-3">
                        {userProfiles.map((profile) => (
                            <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-villeto-primary text-white">
                                            {profile.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{profile.name}</p>
                                        <p className="text-sm text-gray-500">{profile.role}</p>
                                    </div>
                                </div>
                                {profile.percentage && (
                                    <span className="text-sm font-medium text-gray-700">{profile.percentage}%</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10">
                        Show All
                    </Button>
                </CardContent>
            </Card>

            {/* Financial Pulse */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Financial Pulse</CardTitle>
                    <Button variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Teams Expected Monthly Spend</p>
                            <p className="font-medium">{financialPulse.monthlySpend}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Bank Connection</p>
                            <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">{financialPulse.bankConnection}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Integrations</p>
                        <p className="font-medium">{financialPulse.integrations.join(', ')}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Your Villeto Products */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Your Villeto Products</CardTitle>
                    <Button variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {selectedProducts.map((product) => (
                            <Badge
                                key={product.id}
                                variant="secondary"
                                className={`${product.color} border-0 px-4 py-2 text-sm font-medium`}
                            >
                                {product.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
                <Button
                    onClick={submitApplication}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                >
                    Submit
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}