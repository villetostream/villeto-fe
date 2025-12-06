import { cn } from "@/lib/utils";
import { Link, FileUp } from "lucide-react";

interface IntegrationMethodCardProps {
    type: "integration" | "csv";
    selected: boolean;
    onClick: () => void;
}

export const IntegrationMethodCard = ({ type, selected, onClick }: IntegrationMethodCardProps) => {
    const isIntegration = type === "integration";

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-start rounded-xl border-2 py-5 px-[10%] text-center transition-all hover:border-primary/50 shadow-xl",
                selected ? "border-primary bg-background" : "border-border bg-background"
            )}
        >
            <h3 className="mb-1 text-base font-extrabold text-foreground ">
                {isIntegration ? "Connect Via Integration" : "Upload a CSV File"}
            </h3>
            <p className="mb-8 text-sm font-normal text-foreground">
                {isIntegration
                    ? "Sync data automatically from your CRM or other services"
                    : "Import data automatically from a spreadsheet etc."}
            </p>

            <div className="flex  items-center justify-center w-full">
                {isIntegration ? (
                    <div className="relative ">
                        <div className="">

                            <img src={"/images/cloud-connect.webp"} alt="csv-upload" loading="eager" className="aspect-square size-32 text-primary" />
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="">

                            <img src={"/images/csv-upload.webp"} alt="csv-upload" loading="eager" className="aspect-square size-32 text-primary" />
                        </div>
                    </div>
                )}
            </div>
        </button>
    );
};
