"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import SetPasswordModal from "@/components/invitation/SetPasswordModal";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

export default function DashboardModals() {
    const user = useAuthStore((state) => state.user);
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    useEffect(() => {
        if (user) {
            // Trigger for any first-time user (loginCount <= 1) or users flagged to change password.
            // Using <= 1 specifically catches systems where fresh accounts start at 0 before first session logs.
            const isFirstLogin = typeof user.loginCount === 'number' && user.loginCount <= 1;
            const mustChangePassword = (user as any).shouldChangePassword === true;
            
            if (isFirstLogin || mustChangePassword) {
                setShowPasswordModal(true);
            }
        }
    }, [user?.loginCount, (user as any)?.shouldChangePassword]);

    const handlePasswordSuccess = () => {
        setShowPasswordModal(false);
        setShowCategoryModal(true);
        
        // Optimistically update the store so the modal doesn't immediately pop back open
        useAuthStore.setState((state) => ({
            user: state.user ? { ...state.user, loginCount: 2, shouldChangePassword: false } : null
        }));
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
