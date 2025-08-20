
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Settings
} from "lucide-react";

const employees = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    department: "Marketing",
    role: "Marketing Manager",
    cardNumber: "••••4521",
    cardLimit: 5000,
    monthlySpend: 1250,
    status: "active",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    email: "michael.r@company.com",
    department: "Engineering",
    role: "Senior Developer",
    cardNumber: "••••8934",
    cardLimit: 3000,
    monthlySpend: 890,
    status: "active",
    location: "Austin, TX",
    phone: "+1 (555) 234-5678"
  },
  {
    id: 3,
    name: "Emma Thompson",
    email: "emma.t@company.com",
    department: "Operations",
    role: "Operations Director",
    cardNumber: "••••2567",
    cardLimit: 8000,
    monthlySpend: 2100,
    status: "active",
    location: "New York, NY",
    phone: "+1 (555) 345-6789"
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@company.com",
    department: "Sales",
    role: "Sales Representative",
    cardNumber: "Not assigned",
    cardLimit: 0,
    monthlySpend: 0,
    status: "pending",
    location: "Chicago, IL",
    phone: "+1 (555) 456-7890"
  }
];

export default function People() {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-status-success text-white`;
      case 'pending':
        return `${baseClasses} bg-status-warning text-white`;
      case 'inactive':
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
              <h1 className="text-3xl font-bold text-dashboard-text-primary">People</h1>
              <p className="text-dashboard-text-secondary mt-1">
                Manage team members and their spending permissions
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Permissions
              </Button>
              <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Total Employees</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">24</p>
                  </div>
                  <Users className="w-8 h-8 text-dashboard-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Active Cards</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">18</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-status-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Pending Setup</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">6</p>
                  </div>
                  <Shield className="w-8 h-8 text-status-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dashboard-card border-dashboard-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dashboard-text-secondary text-sm">Total Limits</p>
                    <p className="text-2xl font-bold text-dashboard-text-primary">$125K</p>
                  </div>
                  <Users className="w-8 h-8 text-dashboard-text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary w-4 h-4" />
              <Input placeholder="Search team members..." className="pl-10" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Department
            </Button>
          </div>

          {/* Team Members List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id} className="bg-dashboard-card border-dashboard-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-dashboard-accent text-white font-medium">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-dashboard-text-primary">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-dashboard-text-secondary">
                            {employee.role} • {employee.department}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-dashboard-text-secondary">
                          <Mail className="w-3 h-3" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dashboard-text-secondary">
                          <Phone className="w-3 h-3" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dashboard-text-secondary">
                          <MapPin className="w-3 h-3" />
                          {employee.location}
                        </div>
                      </div>

                      {employee.cardNumber !== "Not assigned" ? (
                        <div className="mt-4 p-3 bg-dashboard-hover rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-dashboard-accent" />
                              <span className="text-sm font-medium text-dashboard-text-primary">
                                Card {employee.cardNumber}
                              </span>
                            </div>
                            <span className="text-sm text-dashboard-text-secondary">
                              ${employee.monthlySpend} / ${employee.cardLimit}
                            </span>
                          </div>
                          <div className="w-full bg-dashboard-border rounded-full h-1.5">
                            <div 
                              className="bg-dashboard-accent h-1.5 rounded-full" 
                              style={{ width: `${(employee.monthlySpend / employee.cardLimit) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-dashboard-text-secondary mt-1">
                            {Math.round((employee.monthlySpend / employee.cardLimit) * 100)}% of limit used this month
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 p-3 bg-status-warning/10 rounded-lg border border-status-warning/20">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-status-warning" />
                            <span className="text-sm font-medium text-status-warning">
                              Card not assigned
                            </span>
                          </div>
                          <Button size="sm" className="mt-2 w-full bg-dashboard-accent hover:bg-dashboard-accent/90">
                            Issue Card
                          </Button>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit Permissions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department Overview */}
          <Card className="bg-dashboard-card border-dashboard-border">
            <CardHeader>
              <CardTitle className="text-dashboard-text-primary">Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-dashboard-text-primary">8</p>
                  <p className="text-sm text-dashboard-text-secondary">Engineering</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-dashboard-text-primary">6</p>
                  <p className="text-sm text-dashboard-text-secondary">Marketing</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-dashboard-text-primary">5</p>
                  <p className="text-sm text-dashboard-text-secondary">Sales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-dashboard-text-primary">5</p>
                  <p className="text-sm text-dashboard-text-secondary">Operations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
}