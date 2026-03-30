"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import SetPasswordModal from "@/components/invitation/SetPasswordModal";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

export default function DashboardModals() {
    const user = useAuthStore((state) => state.user);
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        if (!hasChecked && user) {
            // Trigger for any first-time user (loginCount === 1) or users flagged to change password.
            // Previously this was gated on CONTROLLING_OFFICER only — fixed to cover all invited roles.
            const isFirstLogin = user.loginCount === 1;
            const mustChangePassword = (user as any).shouldChangePassword === true;
            if (isFirstLogin || mustChangePassword) {
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
            <SetPasswordModal 
                open={showPasswordModal} 
                onOpenChange={setShowPasswordModal}
                email={user.email}
                onSuccess={handlePasswordSuccess}
                preventDismiss={true}
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
