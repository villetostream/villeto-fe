import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Plus, 
  Target,
  TrendingUp,
  Award,
  Calendar,
  DollarSign
} from "lucide-react";

const programs = [
  {
    id: 1,
    name: "Q4 Marketing Campaign",
    department: "Marketing",
    budget: 50000,
    spent: 32500,
    participants: 8,
    endDate: "Dec 31, 2024",
    status: "active"
  },
  {
    id: 2,
    name: "Engineering Tools Budget",
    department: "Engineering",
    budget: 25000,
    spent: 18750,
    participants: 15,
    endDate: "Nov 30, 2024",
    status: "active"
  },
  {
    id: 3,
    name: "Office Supplies Program",
    department: "Operations",
    budget: 10000,
    spent: 9500,
    participants: 25,
    endDate: "Dec 15, 2024",
    status: "nearly_exhausted"
  }
];

export default function SpendPrograms() {
  const getUsagePercentage = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-status-success text-white`;
      case 'nearly_exhausted':
        return `${baseClasses} bg-status-warning text-white`;
      case 'completed':
        return `${baseClasses} bg-dashboard-text-secondary text-white`;
      default:
        return baseClasses;
    }
  };

  return (
    
      <div className="min-h-screen bg-dashboard-bg">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dashboard-text-primary">Spend Programs</h1>
              <p className="text-dashboard-text-secondary mt-1">
                Manage departmental budgets and spending programs
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Program Templates
              </Button>
              <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Program
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Active Programs</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">12</p>
                  </div>
                  <Target className="w-8 h-8 text-dashboard-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Total Budget</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">$425K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-status-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Utilized</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">$287K</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-status-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Participants</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">87</p>
                  </div>
                  <Users className="w-8 h-8 text-dashboard-text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programs List */}
          <div className="space-y-4">
            {programs.map((program) => {
              const usagePercentage = getUsagePercentage(program.spent, program.budget);
              return (
                <Card key={program.id} className="bg-dashboard-card border-dashboard-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                          <Target className="w-6 h-6 text-dashboard-accent" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dashboard-text-primary">
                            {program.name}
                          </h3>
                          <p className="text-sm text-dashboard-text-secondary">
                            {program.department} • {program.participants} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBadge(program.status)}>
                          <span className="capitalize">{program.status.replace('_', ' ')}</span>
                        </Badge>
                        <p className="text-sm text-dashboard-text-secondary mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Ends {program.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-dashboard-text-secondary">Budget Utilization</span>
                            <span className="font-medium text-dashboard-text-primary">
                              ${program.spent.toLocaleString()} / ${program.budget.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={usagePercentage} className="h-3" />
                          <p className="text-xs text-dashboard-text-secondary">
                            {usagePercentage}% utilized • ${(program.budget - program.spent).toLocaleString()} remaining
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Program Templates */}
          <Card className="bg-dashboard-card border-dashboard-border">
            <CardHeader>
              <CardTitle className="text-dashboard-text-primary">Popular Program Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-dashboard-hover rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-dashboard-accent" />
                    <h4 className="font-medium text-dashboard-text-primary">Department Budget</h4>
                  </div>
                  <p className="text-sm text-dashboard-text-secondary mb-3">
                    Set monthly spending limits for departments with automatic approvals
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </div>

                <div className="p-4 bg-dashboard-hover rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-dashboard-accent" />
                    <h4 className="font-medium text-dashboard-text-primary">Project Budget</h4>
                  </div>
                  <p className="text-sm text-dashboard-text-secondary mb-3">
                    Time-bound spending program for specific projects or campaigns
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </div>

                <div className="p-4 bg-dashboard-hover rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-dashboard-accent" />
                    <h4 className="font-medium text-dashboard-text-primary">Team Allowance</h4>
                  </div>
                  <p className="text-sm text-dashboard-text-secondary mb-3">
                    Individual spending allowances for team members with controls
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}