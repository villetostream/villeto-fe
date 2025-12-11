"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2, Info, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { AddBeneficialOwnerModal } from "@/components/onboarding/AddBeneficialOwner";
import OnboardingTitle from "@/components/onboarding/_shared/OnboardingTitle";
import { useOnboardingStore } from "@/stores/useVilletoStore";
import { LeaderShipPayload, useUpdateOnboardingLeadersApi } from "@/actions/onboarding/update-leadership";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02FreeIcons, UserGroup03FreeIcons, UserGroup03Icon } from "@hugeicons/core-free-icons";

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    ownershipPercentage?: number;
    avatar?: string;
    phone?: string; // Add this
}

interface BeneficialOwner extends Person {
    ownershipPercentage: number;
}

interface Officer extends Person {
    role: string;
}

interface ComplianceNoticeProps {
    title: string;
    description: string;
}

export function ComplianceNotice({ title, description }: ComplianceNoticeProps) {
    return (
        <Card className="bg-primary/15 border-primary p-5">
            <div className="flex items-start gap-3.5">
                <Info className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                    <p className="text-base font-semibold leading-[100%] tracking-[0%] text-black mb-2">{title}</p>
                    <p className="text-xs font-normal leading-[100%] tracking-[0%] text-black">{description}</p>
                </div>
            </div>
        </Card>
    );
}

interface EmptyStateProps {
    imageSrc: string;
    imageAlt: string;
    message: string;
}

export function EmptyState({ imageSrc, imageAlt, message }: EmptyStateProps) {
    return (
        <div className="text-center space-y-10">
            <div className="flex justify-center">
                <img src={imageSrc} alt={imageAlt} className="w-48 h-48" />
            </div>
            <p className="text-muted-foreground text-base tracking-[0%] leading-[100%]">{message}</p>
        </div>
    );
}

interface OwnerCardProps {
    owner: {
        id: string;
        firstName: string;
        lastName: String;
        role: string;
        email: string;
        ownershipPercentage?: number;
        position?: string;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    type: "beneficial" | "officer";
    showIcons: boolean
}

export function OwnerCard({ owner, onEdit, onDelete, type, showIcons = true }: OwnerCardProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                            {owner.firstName.split('')[0] + owner.lastName.split('')[0]}
                        </span>
                    </div>

                    {/* Owner Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold font-base">{owner.firstName} {owner.lastName}</span>
                            <span className="text-sm">
                                {type === "beneficial" ? owner.role : owner.position}
                            </span>
                            {type === "beneficial" && (
                                <span className="text-sm flex-auto">
                                    {owner.ownershipPercentage}%
                                </span>
                            )}
                        </div>

                    </div>
                </div>

                {/* Actions */}
                {showIcons && (<div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(owner.id)}>
                        <HugeiconsIcon icon={PencilEdit02FreeIcons} className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(owner.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>)}
            </div>
        </Card>
    );
}

interface ActionButtonsProps {
    onAdd: () => void;
    onContinue: () => void;
    hasOwners: boolean;
    loading: boolean;
    addButtonText: string;
    continueButtonText: string;
    layout?: "default" | "equal";
}

export function ActionButtons({
    onAdd,
    onContinue,
    hasOwners,
    addButtonText,
    continueButtonText,
    loading,
    layout = "default"
}: ActionButtonsProps) {
    if (layout === "equal") {
        return (
            <div className="flex items-center pt-8 w-full gap-4 mt-auto">
                <Button
                    variant="outline"
                    onClick={onAdd}
                    className="flex items-center gap-2 flex-1"
                    disabled={loading}
                >
                    {addButtonText}
                    <Plus className="h-4 w-4" />
                </Button>

                <Button
                    onClick={onContinue}
                    className={`flex items-center gap-2 flex-1 ${!hasOwners ? 'opacity-50' : ''}`}
                    disabled={!loading && !hasOwners}
                >
                    {hasOwners ? continueButtonText : "Next Step"}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center pt-8 mt-auto gap-5">
            <Button
                variant="outline"
                onClick={onAdd}
                className="flex items-center gap-2 flex-1"
                disabled={loading}

            >
                {addButtonText}
                <Plus className="h-4 w-4" />
            </Button>

            <Button
                onClick={onContinue}
                className={`flex items-center gap-2 flex-1 ${!hasOwners ? 'opacity-50' : ''}`}
                disabled={!loading && !hasOwners}
            >
                {hasOwners ? continueButtonText : "Next Step"}
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function Leadership() {
    const router = useRouter();
    const { userProfiles, updateUserProfiles } = useOnboardingStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"beneficial" | "officer">("beneficial");
    const [editingPerson, setEditingPerson] = useState<{ id: string; type: "beneficial" | "officer" } | null>(null);

    // Separate profiles into beneficial owners and officers
    const beneficialOwners = userProfiles.filter(profile => profile.ownershipPercentage !== undefined) as BeneficialOwner[];
    const officers = userProfiles.filter(profile => profile.ownershipPercentage === undefined) as Officer[];

    const updateOnboarding = useUpdateOnboardingLeadersApi()
    const loading = updateOnboarding.isPending;

    const handleAddPerson = (person: Omit<BeneficialOwner, "id"> | Omit<Officer, "id">) => {
        console.log({ person })

        if (editingPerson) {
            // Editing existing person
            const updatedProfiles = userProfiles.map(p =>
                p.id === editingPerson.id
                    ? { ...p, ...person, avatar: `${person.firstName.split(' ')[0] + person.lastName.split(' ')[0]}` }
                    : p
            );
            updateUserProfiles(updatedProfiles);
        } else {
            // Adding new person
            const newPerson = {
                ...person,
                id: Date.now().toString(),
                avatar: `${person.firstName.split(' ')[0] + person.lastName.split(' ')[0]}`,
            };
            const updatedProfiles = [...userProfiles, newPerson];
            updateUserProfiles(updatedProfiles);
        }

        setIsModalOpen(false);
        setEditingPerson(null);
    };

    const handleEditPerson = (id: string) => {
        const person = userProfiles.find(p => p.id === id);
        if (person) {
            const type = person.ownershipPercentage !== undefined ? "beneficial" : "officer";
            setEditingPerson({ id, type });
            setIsModalOpen(true);
        }
    };

    const handleDeletePerson = (id: string) => {
        const updatedProfiles = userProfiles.filter(profile => profile.id !== id);
        updateUserProfiles(updatedProfiles);
    };

    // Transform the data to match the payload format
    const transformDataForPayload = () => {
        const payload: LeaderShipPayload = {
            businessOwners: beneficialOwners.map(owner => ({
                firstName: owner.firstName,
                lastName: owner.lastName,
                email: owner.email,
                // Add default or make phone required in your interface
                ownershipPercentage: owner.ownershipPercentage || 0,

            })),
            officers: officers.map(officer => ({
                firstName: officer.firstName,
                lastName: officer.lastName,
                email: officer.email,

            }))
        };
        return payload;
    };

    const handleContinue = async () => {
        try {
            const payload = transformDataForPayload();

            // Submit the data
            const response = await updateOnboarding.mutateAsync(payload);
            toast.success("Leader details updated successfully!");
            router.push("/onboarding/financial");
        } catch (error) {
            console.error("Error updating company details:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update company details");
        }
    };

    console.log({ beneficialOwners }, { officers })

    const beneficialHasOwners = beneficialOwners.length > 0;
    const officersHasPeople = officers.length > 0;

    const renderTabContent = (type: "beneficial" | "officer", layout: "default" | "equal" = "default") => {
        const people = type === "beneficial" ? beneficialOwners : officers;
        const hasPeople = beneficialHasOwners && officersHasPeople;
        const hasContent = type === "beneficial" ? beneficialHasOwners : officersHasPeople

        return (
            <div className="mt-7 h-full flex-col flex">
                <ComplianceNotice
                    title={type === "beneficial"
                        ? "No Single Owner holds 25% or more"
                        : "Accepted User Roles:"}
                    description={type === "beneficial"
                        ? "We ask for this to stay compliant with financial regulations"
                        : "Chief Executive Officers, Chief Financial Officers, Admin Officers etc"}
                />

                {!hasContent ? (
                    <EmptyState
                        imageSrc="/images/leadership.png"
                        imageAlt={type === "beneficial" ? "Add beneficial owners" : "Add company officers"}
                        message={"No user has been added yet, click button below to add."}
                    />
                ) : (
                    <div className="space-y-4 mt-5">
                        {people.map((person) => (
                            <OwnerCard
                                key={person.id}
                                owner={person}
                                onEdit={handleEditPerson}
                                onDelete={handleDeletePerson}
                                type={type}
                                showIcons
                            />
                        ))}
                    </div>
                )}

                <ActionButtons
                    onAdd={() => setIsModalOpen(true)}
                    onContinue={handleContinue}
                    hasOwners={hasPeople}
                    addButtonText={type === "beneficial" ? "Add Beneficial Owner" : "Add Controlling Officer"}
                    continueButtonText="Continue"
                    layout={layout}
                    loading={loading}
                />

                <AddBeneficialOwnerModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingPerson(null);
                    }}
                    onAdd={handleAddPerson}
                    mode={type}
                    isOwner={type == "beneficial" ? true : false}
                    editingPerson={editingPerson ? userProfiles.find(p => p.id === editingPerson.id) : undefined}
                />
            </div>
        );
    };

    return (
        <div className="h-full flex-col flex">
            <div className="text-left space-y-4">
                <div className=" size-24 flex items-center justify-center bg-primary-light rounded-full mb-10">
                    <HugeiconsIcon icon={UserGroup03FreeIcons} className="size-16 text-primary" />

                </div>

                <OnboardingTitle
                    title="User Profiles"
                    subtitle="Add company employees and assign roles"
                />
            </div>

            <Tabs defaultValue="beneficial" className="w-full mt-7 h-full" onValueChange={(value) => setSelectedTab(value as "beneficial" | "officer")}>
                <TabsList className="w-full flex">
                    <TabsTrigger value="beneficial" className="flex-1">
                        Beneficial Owner
                    </TabsTrigger>
                    <TabsTrigger value="officer" className="flex-1">
                        Controlling  Officer
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="beneficial" className="h-full">
                    {renderTabContent("beneficial", "default")}
                </TabsContent>

                <TabsContent value="officer" className="h-full">
                    {renderTabContent("officer", "equal")}
                </TabsContent>
            </Tabs>
        </div>
    );
}