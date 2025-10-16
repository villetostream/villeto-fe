import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: ReactNode;
    trend?: "up" | "down" | "neutral";
    icon?: ReactNode;
}

export const StatsCard = ({ title, value, subtitle, trend, icon }: StatsCardProps) => {
    return (
        <Card className="p-1 border border-muted gap-1">
            <div className="p-3 pb-[11px] space-y-1 border border-muted rounded">
                <div className="flex items-center justify-between">
                    <p className="text-xs leading-[125%] text-foreground font-normal">{title}</p>
                    {icon}
                </div>
                <p className="text-xl leading-[150%] font-bold">{value}</p>
            </div>
            {subtitle && (
                <div className="p-3.5 px-3 border border-muted rounded">
                    <p className={`mt-auto text-[8px] leading-[100%] ${trend === "up" ? "text-success" :
                        trend === "down" ? "text-destructive" :
                            "text-muted-foreground"
                        }`}>
                        {subtitle}
                    </p>
                </div>
            )}
        </Card>
    );
};