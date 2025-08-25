
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Permission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-stores';

interface ProtectedComponentProps {
    children: ReactNode;
    requiredPermission: Permission;
    fallback?: ReactNode;
}

export function ProtectedComponent({
    children,
    requiredPermission,
    fallback
}: ProtectedComponentProps) {
    const hasPermission = useAuthStore(state => state.hasPermission(requiredPermission));
    const isLoading = useAuthStore(state => state.isLoading);

    if (hasPermission) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }
    if (isLoading) {

    }

    return (
        <Card className="bg-muted/50">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                <p className="text-sm text-muted-foreground">
                    You don't have permission to view this content.
                </p>
            </CardContent>
        </Card>
    );
}