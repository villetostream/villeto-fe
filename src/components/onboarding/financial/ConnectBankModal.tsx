"use client"

import { useState } from "react";
import { Building2, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { cn } from "@/lib/utils";

import { HugeiconsIcon } from '@hugeicons/react';
import { BankIcon } from '@hugeicons/core-free-icons';

export const ConnectBankModal = () => {
    const {
        showConnectModal,
        setShowConnectModal,
        setBankConnected,
        setBankProcessing,
        addConnectedAccount
    } = useOnboardingStore();

    const [selectedOption, setSelectedOption] = useState<'direct' | 'statement' | null>(null);
    const [quickbookUrl, setQuickbookUrl] = useState('');
    const [sageUrl, setSageUrl] = useState('');

    const handleClose = () => {
        setShowConnectModal(false);
        setSelectedOption(null);
        setQuickbookUrl('');
        setSageUrl('');
    };

    const handleConnect = () => {
        const accounts = [];

        if (quickbookUrl.trim()) {
            accounts.push({
                id: Math.random().toString(36).substr(2, 9),
                name: 'QuickBooks',
                url: quickbookUrl.trim(),
                type: 'quickbook' as const,
            });
        }

        if (sageUrl.trim()) {
            accounts.push({
                id: Math.random().toString(36).substr(2, 9),
                name: 'Sage',
                url: sageUrl.trim(),
                type: 'sage' as const,
            });
        }

        accounts.forEach(account => addConnectedAccount(account));

        if (accounts.length > 0) {
            setBankConnected(true);
            // Simulate processing delay
            setBankProcessing(true);
            setTimeout(() => {
                setBankProcessing(false);
            }, 3000);
        }

        handleClose();
    };

    const handleDirectConnect = () => {
        setBankConnected(true);
        setBankProcessing(false);
        addConnectedAccount({
            id: Math.random().toString(36).substr(2, 9),
            name: 'Mono Bank',
            url: 'bank.mono.com',
            type: 'quickbook',
        });
        handleClose();
    };

    return (
        <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
            <DialogContent className="p-10">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <HugeiconsIcon icon={BankIcon} className="w-10 h-10 text-villeto-gray " />
                            <div className="text-left">
                                <DialogTitle className="text-lg font-medium tracking-[0%] leading-[100%] text-black">Connect Bank</DialogTitle>

                                <p className="text-sm text-muted-foreground">
                                    We have provided two options to connect your bank
                                </p>
                            </div>
                        </div>

                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-[60px]">
                    {/* Connect Directly Option */}
                    <div>
                        <h4 className="text-lg font-normal tracking-[0%] leading-[100%] text-black mb-3">
                            Connect Directly<span className="text-red-500">*</span>
                        </h4>

                        <div className="space-y-3">
                            <div
                                className={cn(
                                    "p-3 border rounded-lg cursor-pointer transition-colors duration-200",
                                    selectedOption === 'direct'
                                        ? "border-villeto-primary bg-villeto-primary/5"
                                        : "border-villeto-light-gray hover:border-villeto-primary/50"
                                )}
                                onClick={() => setSelectedOption('direct')}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-4 h-4 rounded border-2 flex items-center justify-center",
                                        selectedOption === 'direct'
                                            ? "border-villeto-primary bg-villeto-primary"
                                            : "border-villeto-light-gray"
                                    )}>
                                        {selectedOption === 'direct' && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-sm text-villeto-gray">
                                        We need this to better understand your finances and make payments
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleDirectConnect}
                                className="w-full bg-villeto-light-gray text-villeto-dark hover:bg-villeto-light-gray/80"
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                Click here to connect your bank directly using Mono
                            </Button>
                        </div>
                    </div>

                    {/* Bank Statement Option */}
                    <div>
                        <h4 className="font-medium text-villeto-dark mb-3">
                            Bank Statement<span className="text-red-500">*</span>
                        </h4>

                        <div className="space-y-3">
                            <div
                                className={cn(
                                    "p-3 border rounded-lg cursor-pointer transition-colors duration-200",
                                    selectedOption === 'statement'
                                        ? "border-villeto-primary bg-villeto-primary/5"
                                        : "border-villeto-light-gray hover:border-villeto-primary/50"
                                )}
                                onClick={() => setSelectedOption('statement')}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-4 h-4 rounded border-2 flex items-center justify-center",
                                        selectedOption === 'statement'
                                            ? "border-villeto-primary bg-villeto-primary"
                                            : "border-villeto-light-gray"
                                    )}>
                                        {selectedOption === 'statement' && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-sm text-villeto-gray">
                                        We need this to add your accounting details to access your credit info
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Input
                                    placeholder="Enter quickbook account link"
                                    value={quickbookUrl}
                                    onChange={(e) => setQuickbookUrl(e.target.value)}
                                    className="bg-white"
                                />
                                <Input
                                    placeholder="Enter sage account link"
                                    value={sageUrl}
                                    onChange={(e) => setSageUrl(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <Button
                        onClick={handleConnect}
                        disabled={!selectedOption || (selectedOption === 'statement' && !quickbookUrl.trim() && !sageUrl.trim())}
                        className="w-full bg-villeto-primary hover:bg-villeto-primary-light text-white"
                    >
                        Connect
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};