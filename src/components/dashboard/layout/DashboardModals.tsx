"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

export default function DashboardModals() {
    const user = useAuthStore((state) => state.user);
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        if (!hasChecked && user) {
            // Only trigger if conditions are met
            if (user.loginCount === 1 && user.position === "CONTROLLING_OFFICER") {
                setShowPasswordModal(true);
            }
            // Mark as checked so we don't re-trigger during this session
            setHasChecked(true);
        }
    }, [user, hasChecked]);

    const handlePasswordSuccess = () => {
        setShowPasswordModal(false);
        setShowCategoryModal(true);
    };

    const handleCategoryCompletion = () => {
        setShowCategoryModal(false);
    };

    if (!user) return null;

    return (
        <>
            <ChangePasswordModal 
                open={showPasswordModal} 
                onOpenChange={setShowPasswordModal}
                email={user.email}
                onSuccess={handlePasswordSuccess} 
            />
            <AddCategoryModal
                open={showCategoryModal}
                onOpenChange={setShowCategoryModal}
                onSuccess={handleCategoryCompletion}
                onSkip={handleCategoryCompletion}
                cancelText="Skip for now"
            />
        </>
    );
}
