// components/booking/BookingTabs.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BookingTab = "flight" | "hotel";

interface BookingTabsProps {
    activeTab: BookingTab;
    onTabChange: (tab: BookingTab) => void;
}

const BookingTabs = ({ activeTab, onTabChange }: BookingTabsProps) => {
    return (
        <div className="flex border-b">
            <Button
                variant="ghost"
                onClick={() => onTabChange("flight")}
                className={cn(
                    "flex-1 py-4 text-sm font-medium transition-colors relative",
                    activeTab === "flight"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Flight Booking
                {activeTab === "flight" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
            </Button>
            <Button
                variant="ghost"
                onClick={() => onTabChange("hotel")}
                className={cn(
                    "flex-1 py-4 text-sm font-medium transition-colors relative",
                    activeTab === "hotel"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Hotel Accommodation
                {activeTab === "hotel" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
            </Button>
        </div>
    );
};

export default BookingTabs;