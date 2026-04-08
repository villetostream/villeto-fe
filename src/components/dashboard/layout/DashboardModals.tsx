"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import SetPasswordModal from "@/components/invitation/SetPasswordModal";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

export default function DashboardModals() {
    const user = useAuthStore((state) => state.user);
    const shouldChangePassword = (user as { shouldChangePassword?: boolean } | null)?.shouldChangePassword === true;
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [hasCompletedFlow, setHasCompletedFlow] = useState(false);

    const flowGuardKey = useMemo(
        () => (user?.userId ? `dashboard-modals-flow-complete:${user.userId}` : null),
        [user?.userId]
    );

    const isCompanyFounder = user?.position === "CONTROLLING_OFFICER" &&
        user?.createdAt === user?.company?.createdAt;
    const isFirstLogin = typeof user?.loginCount === "number" && user.loginCount < 1;
    const mustChangePassword = shouldChangePassword;
    const shouldShowCategoryAfterPassword = Boolean(isCompanyFounder && isFirstLogin);

    useEffect(() => {
        if (!flowGuardKey) return;
        const done = sessionStorage.getItem(flowGuardKey) === "1";
        if (done) setHasCompletedFlow(true);
    }, [flowGuardKey]);

    useEffect(() => {
        if (hasCompletedFlow) return;
        if (user && ((isFirstLogin && isCompanyFounder) || mustChangePassword)) {
            setShowPasswordModal(true);
        }
    }, [user, isFirstLogin, isCompanyFounder, mustChangePassword, hasCompletedFlow]);

    const markFlowComplete = () => {
        setHasCompletedFlow(true);
        setShowPasswordModal(false);
        setShowCategoryModal(false);
        if (flowGuardKey) sessionStorage.setItem(flowGuardKey, "1");
    };

    const handlePasswordSuccess = () => {
        setShowPasswordModal(false);
        if (shouldShowCategoryAfterPassword) {
            setShowCategoryModal(true);
        } else {
            markFlowComplete();
        }
        
        // Optimistically update the store so the modal doesn't immediately pop back open
        useAuthStore.setState((state) => ({
            user: state.user ? { ...state.user, loginCount: 2, shouldChangePassword: false } : null
        }));
    };

    const handleCategoryCompletion = () => {
        markFlowComplete();
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
                requireOldPassword={true}
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
