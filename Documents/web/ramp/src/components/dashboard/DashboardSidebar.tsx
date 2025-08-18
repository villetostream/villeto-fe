import { cn } from "@/lib/utils";
import { 
  Home, 
  CreditCard, 
  Receipt, 
  Plane, 
  Settings, 
  Users, 
  FileText,
  Building,
  HelpCircle,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { icon: Home, label: "Dashboard", active: false },
  { icon: CreditCard, label: "Expenses", active: true, subItems: [
    { label: "Card transactions", active: true },
    { label: "Reimbursements", active: false },
    { label: "Travel", active: false }
  ]},
  { icon: Receipt, label: "Cards", active: false },
  { icon: Users, label: "Spend programs", active: false },
  { icon: Building, label: "Procurement", active: false },
  { icon: FileText, label: "Bill Pay", active: false },
  { icon: Settings, label: "Accounting", active: false },
];

const bottomItems = [
  { icon: Building, label: "Business Account", badge: "New" },
  { icon: Users, label: "People", active: false },
  { icon: Settings, label: "Settings", active: false },
  { icon: HelpCircle, label: "Chat for help", active: false },
];

interface DashboardSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function DashboardSidebar({ isCollapsed = false, onToggle }: DashboardSidebarProps) {
  return (
    <div className={cn(
      "bg-dashboard-sidebar border-r border-dashboard-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with toggle */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-dashboard-accent rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dashboard-text-primary">ExpenseFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-dashboard-text-secondary hover:text-dashboard-text-primary"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform duration-200",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigationItems.map((item, index) => (
          <div key={index}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal group relative",
                item.active 
                  ? "bg-dashboard-accent/10 text-dashboard-accent border-l-2 border-dashboard-accent" 
                  : "text-dashboard-text-secondary hover:bg-dashboard-hover hover:text-dashboard-text-primary",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && item.label}
            </Button>
            
            {item.subItems && !isCollapsed && (
              <div className="ml-7 mt-1 space-y-1">
                {item.subItems.map((subItem, subIndex) => (
                  <Button
                    key={subIndex}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left font-normal relative",
                      subItem.active 
                        ? "bg-dashboard-accent/5 text-dashboard-accent font-medium border-l-2 border-dashboard-accent/50 pl-4" 
                        : "text-dashboard-text-secondary hover:bg-dashboard-hover hover:text-dashboard-text-primary"
                    )}
                  >
                    {subItem.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-1 border-t border-dashboard-border">
        {bottomItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full text-left font-normal text-dashboard-text-secondary hover:bg-dashboard-hover hover:text-dashboard-text-primary",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && (
              <>
                {item.label}
                {item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-dashboard-accent text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}