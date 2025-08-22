import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { PaymentDetails } from "./PaymentDetails";

export function DashboardHeader() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dashboard-text-primary">Card transactions</h1>
          <p className="text-dashboard-text-secondary mt-1">
            Monitor and manage your company card expenses
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <ExpenseForm />
          <Badge variant="secondary" className="bg-status-warning text-white">
            Reminders 1.1K
          </Badge>
          <Button variant="outline">Statements</Button>
          <PaymentDetails />
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-dashboard-card border-dashboard-border">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-dashboard-text-secondary text-sm">Current balance</p>
              <p className="text-4xl font-bold text-dashboard-text-primary">
                $452,062.97 <span className="text-lg font-normal text-dashboard-text-secondary">USD</span>
              </p>
              <p className="text-dashboard-text-secondary text-sm">
                Pending $1,681.22
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-card border-dashboard-border">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-dashboard-text-secondary text-sm">Next payment</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-dashboard-text-primary">December 14</p>
                <ArrowRight className="w-4 h-4 text-dashboard-text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-card border-dashboard-border">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-dashboard-text-secondary text-sm">Available cashback</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-dashboard-text-primary">$2,045.85</p>
                <ArrowRight className="w-4 h-4 text-dashboard-text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Limit */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-dashboard-text-secondary">Total limit</p>
          <p className="text-2xl font-bold text-dashboard-text-primary">$2,000,000</p>
          <button className="text-sm text-dashboard-accent hover:underline">
            Manage limit
          </button>
        </div>
      </div>
    </div>
  );
}