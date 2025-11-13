import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AuthCardProps {
    children: ReactNode;
    icon: ReactNode;
    title: string;
    description: string;
}

const AuthCard = ({ children, icon, title, description }: AuthCardProps) => {
    return (
        <Card className="w-full  max-w-[600px] p-8 space-y-1 bg-card rounded-3xl shadow-lg">
            <div className="flex justify-center">
                {icon}

            </div>
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-card-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
        </Card>
    );
};

export default AuthCard;