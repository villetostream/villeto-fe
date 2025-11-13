"use client"

import { useOnboardingStore } from '@/stores/useVilletoStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, FileText, ArrowRight } from 'lucide-react';
import { CongratulationsModal } from '@/components/onboarding/CongratulationModal';
import { HugeiconsIcon } from '@hugeicons/react';
import OnboardingTitle from '@/components/onboarding/_shared/OnboardingTitle';
import { CheckmarkBadge03Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { OwnerCard } from '../leadership/page';
import { useRouter } from 'next/navigation';

export default function ReviewConfirmation() {
    const {
        businessSnapshot,
        userProfiles,
        financialPulse,
        villetoProducts,
        submitApplication,
        showCongratulations
    } = useOnboardingStore();

    const selectedProducts = villetoProducts;
    const router = useRouter()

    return (
        <div className="space-y-8">
            {showCongratulations && (<CongratulationsModal />)}
            {/* Header */}
            <div className="text-left mb-10 ">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <HugeiconsIcon icon={CheckmarkBadge03Icon} className="size-14 text-primary" />
                </div>
                <OnboardingTitle title={"Review & Confirmation"} subtitle={"Please go through the information you have provided before submission"} />

            </div>
            {/* Business Snapshot */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Business Snapshot</CardTitle>
                    <Button onClick={() => {
                        router.push("/onboarding/business")
                    }} variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10 gap-2.5">
                        Edit
                        <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />

                    </Button>
                </CardHeader>
                <CardContent className="grid  gap-6">
                    <div className='flex items-center justify-between'>
                        <p className="text-sm text-gray-500 mb-1">Business Name</p>
                        <p className="font-medium">{businessSnapshot.businessName}</p>
                    </div>
                    <div className='flex items-center justify-between'>

                        <p className="text-sm text-gray-500 mb-1">Country of Registration</p>
                        <p className="font-medium">{businessSnapshot.countryOfRegistration}</p>
                    </div>
                    <div className='flex items-center justify-between'>

                        <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                        <p className="font-medium">{businessSnapshot.contactNumber}</p>
                    </div>
                    <div className='flex items-center justify-between'>

                        <p className="text-sm text-gray-500 mb-1">Website</p>
                        <p className="font-medium text-villeto-primary">{businessSnapshot.website}</p>
                    </div>
                </CardContent>
            </Card>

            {/* User Profiles */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">User Profiles</CardTitle>
                    <Button onClick={() => {
                        router.push("/onboarding/leadership")
                    }} variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10 gap-2.5">
                        Edit
                        <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />

                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        {userProfiles.filter(p => p.ownershipPercentage).length} Beneficial Owners and {userProfiles.filter(p => !p.ownershipPercentage).length} Controlling Officers added
                    </p>
                    <div className="space-y-3">
                        {userProfiles.map((profile) => (
                            <OwnerCard owner={profile} onDelete={() => { }} onEdit={() => { }} type={profile.ownershipPercentage ? "beneficial" : "officer"} showIcons={false} />
                        ))}
                    </div>
                    <div className='flex justify-center'>
                        <Button variant="ghost" size="sm" className="mt-4 text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10">
                            Show All
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Pulse */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Financial Pulse</CardTitle>
                    <Button onClick={() => {
                        router.push("/onboarding/financial")
                    }} variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10 gap-2.5">
                        Edit
                        <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />

                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Teams Expected Monthly Spend</p>
                            <p className="font-medium">{financialPulse?.monthlySpend ?? 0}</p>
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
                    <Button onClick={() => {
                        router.push("/onboarding/products")
                    }} variant="ghost" size="sm" className="text-villeto-primary hover:text-villeto-primary hover:bg-villeto-primary/10 gap-2.5">
                        Edit
                        <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />

                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-5">
                        {selectedProducts.map((product) => (
                            <Badge
                                key={product.id}
                                variant="secondary"
                                className={`${product.color}  px-5 py-3 text-sm font-medium rounded-[50px]`}
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
                    size={"md"}
                    className="!px-12"
                >
                    Submit
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}