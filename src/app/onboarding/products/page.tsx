"use client"

import { useOnboardingStore } from '@/stores/useVilletoStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { ProductLoadingIcon, CreditCardIcon, Invoice04Icon, Store01Icon, Coins01Icon, Invoice03Icon } from '@hugeicons/core-free-icons';
import OnboardingTitle from '@/components/onboarding/_shared/OnboardingTitle';
import { useRouter } from 'next/navigation';

const products = [
    {
        id: '1',
        name: 'Corporate Cards',
        description: 'Smart cards with spend controls',
        icon: CreditCardIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        id: '2',
        name: 'Expense Management',
        description: 'Automated tracking + approvals',
        icon: Invoice04Icon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        id: '3',
        name: 'Vendor Payments',
        description: 'Pay suppliers locally & globally',
        icon: Store01Icon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        id: '4',
        name: 'Payroll Automation',
        description: 'Seamless employee payouts',
        icon: Coins01Icon,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
    },
    {
        id: '5',
        name: 'Accounts Payable/Receivable',
        description: 'Simplify invoices & collections',
        icon: Invoice03Icon,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
    },
];

export default function ChooseProducts() {
    const { villetoProducts, toggleProduct, setCurrentStep } = useOnboardingStore();
    const router = useRouter()

    const handleContinue = () => {
        router.push("/onboarding/review");
    };

    const isProductSelected = (productId: string) => {
        return villetoProducts.find(p => p.id === productId)?.selected || false;
    };

    return (
        <div className="flex-1 ">

            {/* Header */}
            <div className="text-left mb-10 ">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <HugeiconsIcon icon={ProductLoadingIcon} className="size-16 text-primary" />
                </div>
                <OnboardingTitle title={"Choos your Villeto Product"} subtitle={"Villeto offers a wide array of products to choose from."} />

            </div>

            {/* Products Grid */}
            <div className="space-y-4 mb-12">
                {products.map((product) => {
                    const Icon = product.icon;
                    const isSelected = isProductSelected(product.id);

                    return (
                        <Card
                            key={product.id}
                            className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-md border ${isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-villeto-primary/30'
                                }`}
                            onClick={() => toggleProduct(product.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-11 h-11 rounded-full ${product.bgColor} flex items-center justify-center`}>
                                        <HugeiconsIcon icon={Icon} className={`w-6 h-6 ${product.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium  text-base tracking-[0%] leading-[100%] mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-muted-foreground text-[13px] font-normal tracking-[0%] leading-[100%]">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => toggleProduct(product.id)}
                                        className="w-5 h-5"
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleContinue}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
                >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}