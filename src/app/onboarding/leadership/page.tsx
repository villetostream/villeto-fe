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

interface Person {
    id: string;
    name: string;
    role: string;
    email: string;
    ownership?: number;
    avatar?: string;
}

interface BeneficialOwner extends Person {
    ownership: number;
}

interface Officer extends Person {
    position: string;
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
        name: string;
        role: string;
        email: string;
        ownership?: number;
        position?: string;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    type: "beneficial" | "officer";
}

export function OwnerCard({ owner, onEdit, onDelete, type }: OwnerCardProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                            {owner.name.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>

                    {/* Owner Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold font-base">{owner.name}</span>
                            <span className="text-sm">
                                {type === "beneficial" ? owner.role : owner.position}
                            </span>
                            {type === "beneficial" && (
                                <span className="text-sm flex-auto">
                                    {owner.ownership}%
                                </span>
                            )}
                        </div>

                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(owner.id)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(owner.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

interface ActionButtonsProps {
    onAdd: () => void;
    onContinue: () => void;
    hasOwners: boolean;
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
    layout = "default"
}: ActionButtonsProps) {
    if (layout === "equal") {
        return (
            <div className="flex items-center pt-8 w-full gap-4 mt-auto">
                <Button
                    variant="outline"
                    onClick={onAdd}
                    className="flex items-center gap-2 flex-1"
                >
                    {addButtonText}
                    <Plus className="h-4 w-4" />
                </Button>

                <Button
                    onClick={onContinue}
                    className={`flex items-center gap-2 flex-1 ${!hasOwners ? 'opacity-50' : ''}`}
                    disabled={!hasOwners}
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
            >
                {addButtonText}
                <Plus className="h-4 w-4" />
            </Button>

            <Button
                onClick={onContinue}
                className={`flex items-center gap-2 flex-1 ${!hasOwners ? 'opacity-50' : ''}`}
                disabled={!hasOwners}
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
    const beneficialOwners = userProfiles.filter(profile => profile.percentage !== undefined) as BeneficialOwner[];
    const officers = userProfiles.filter(profile => profile.percentage === undefined) as Officer[];

    const handleAddPerson = (person: Omit<BeneficialOwner, "id"> | Omit<Officer, "id">) => {
        console.log({ person })

        if (editingPerson) {
            // Editing existing person
            const updatedProfiles = userProfiles.map(p =>
                p.id === editingPerson.id
                    ? { ...p, ...person, avatar: `${person.name.split(' ').map(n => n[0]).join('')}` }
                    : p
            );
            updateUserProfiles(updatedProfiles);
        } else {
            // Adding new person
            const newPerson = {
                ...person,
                id: Date.now().toString(),
                avatar: `${person.name.split(' ').map(n => n[0]).join('')}`,
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
            const type = person.percentage !== undefined ? "beneficial" : "officer";
            setEditingPerson({ id, type });
            setIsModalOpen(true);
        }
    };

    const handleDeletePerson = (id: string) => {
        const updatedProfiles = userProfiles.filter(profile => profile.id !== id);
        updateUserProfiles(updatedProfiles);
    };

    const handleContinue = () => {
        router.push("/onboarding/financial");
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
                            />
                        ))}
                    </div>
                )}

                <ActionButtons
                    onAdd={() => setIsModalOpen(true)}
                    onContinue={handleContinue}
                    hasOwners={hasPeople}
                    addButtonText={type === "beneficial" ? "Add Beneficial Owner" : "Add Officer"}
                    continueButtonText="Continue"
                    layout={layout}
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
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-primary" />
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
                        Officer
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