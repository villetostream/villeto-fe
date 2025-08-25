"use client"

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Users, 
  AlertTriangle,
  Calendar,
  Building,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

const monthlySpendData = [
  { month: "Jan", amount: 45000, transactions: 320, budget: 50000 },
  { month: "Feb", amount: 52000, transactions: 380, budget: 50000 },
  { month: "Mar", amount: 48000, transactions: 350, budget: 50000 },
  { month: "Apr", amount: 61000, transactions: 420, budget: 60000 },
  { month: "May", amount: 55000, transactions: 390, budget: 60000 },
  { month: "Jun", amount: 67000, transactions: 450, budget: 60000 },
];

const departmentSpendData = [
  { name: "Marketing", amount: 85000, percentage: 35, color: "#8884d8" },
  { name: "Sales", amount: 65000, percentage: 27, color: "#82ca9d" },
  { name: "Engineering", amount: 45000, percentage: 18, color: "#ffc658" },
  { name: "Operations", amount: 30000, percentage: 12, color: "#ff7300" },
  { name: "HR", amount: 20000, percentage: 8, color: "#00ff00" },
];

const expenseCategories = [
  { category: "Travel", amount: 125000, trend: 8.2, transactions: 450 },
  { category: "Meals", amount: 78000, trend: -3.5, transactions: 890 },
  { category: "Software", amount: 65000, trend: 12.1, transactions: 120 },
  { category: "Office Supplies", amount: 42000, trend: -1.2, transactions: 350 },
  { category: "Marketing", amount: 95000, trend: 15.7, transactions: 280 },
  { category: "Training", amount: 38000, trend: 5.4, transactions: 180 },
];

const topSpenders = [
  { name: "John Doe", department: "Sales", amount: 8500, transactions: 45, avatar: "/api/placeholder/32/32" },
  { name: "Sarah Wilson", department: "Marketing", amount: 7200, transactions: 38, avatar: "/api/placeholder/32/32" },
  { name: "Mike Johnson", department: "Engineering", amount: 6800, transactions: 32, avatar: "/api/placeholder/32/32" },
  { name: "Emily Brown", department: "Operations", amount: 6200, transactions: 41, avatar: "/api/placeholder/32/32" },
  { name: "David Lee", department: "HR", amount: 5900, transactions: 28, avatar: "/api/placeholder/32/32" },
];

const complianceData = [
  { metric: "Policy Violations", value: 12, change: -25, status: "improved" },
  { metric: "Missing Receipts", value: 8, change: -40, status: "improved" },
  { metric: "Late Submissions", value: 15, change: 20, status: "worsened" },
  { metric: "Duplicate Expenses", value: 3, change: -60, status: "improved" },
];

const budgetUtilization = [
  { department: "Marketing", budget: 100000, spent: 85000, remaining: 15000, utilization: 85 },
  { department: "Sales", budget: 80000, spent: 65000, remaining: 15000, utilization: 81 },
  { department: "Engineering", budget: 60000, spent: 45000, remaining: 15000, utilization: 75 },
  { department: "Operations", budget: 40000, spent: 30000, remaining: 10000, utilization: 75 },
  { department: "HR", budget: 30000, spent: 20000, remaining: 10000, utilization: 67 },
];

export default function Insights() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTab, setSelectedTab] = useState("overview");
  const { currentUser } = useRole();

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Insights</h2>
            <p className="text-muted-foreground">
              Advanced analytics and spend intelligence
              <RoleGuard requiredRole="owner" fallback={null}>
                <Badge className="ml-2 bg-purple-100 text-purple-800">Owner View</Badge>
              </RoleGuard>
              <RoleGuard requiredRole="manager" fallback={null}>
                <Badge className="ml-2 bg-blue-100 text-blue-800">Manager View</Badge>
              </RoleGuard>
              <RoleGuard requiredRole="employee" fallback={null}>
                <Badge className="ml-2 bg-green-100 text-green-800">Employee View</Badge>
              </RoleGuard>
              <RoleGuard requiredRole="auditor" fallback={null}>
                <Badge className="ml-2 bg-orange-100 text-orange-800">Auditor View</Badge>
              </RoleGuard>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <WithPermission permission="view_insights">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </WithPermission>
            <ManagementOnly>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </ManagementOnly>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <WithPermission permission="export_data">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </WithPermission>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$328,000</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% from last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$186</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -2.1% from last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,763</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5.2% from last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Within target range
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spend-analysis">Spend Analysis</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spend Trend</CardTitle>
                  <CardDescription>Spend vs budget over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlySpendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                      <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="budget" stroke="#82ca9d" fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Spend by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentSpendData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                      >
                        {departmentSpendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Expense Categories</CardTitle>
                  <CardDescription>Highest spending categories with trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{category.category}</h4>
                          <p className="text-sm text-muted-foreground">{category.transactions} transactions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${category.amount.toLocaleString()}</p>
                          <div className={`flex items-center text-sm ${getTrendColor(category.trend)}`}>
                            {getTrendIcon(category.trend)}
                            <span className="ml-1">{Math.abs(category.trend)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Spenders</CardTitle>
                  <CardDescription>Users with highest expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSpenders.map((spender, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{spender.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{spender.name}</p>
                            <p className="text-sm text-muted-foreground">{spender.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${spender.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{spender.transactions} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="spend-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Spend Analysis</CardTitle>
                <CardDescription>Transaction volume and amount trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlySpendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Amount ($)" />
                    <Bar yAxisId="right" dataKey="transactions" fill="#82ca9d" name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization by Department</CardTitle>
                <CardDescription>Track spending against allocated budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetUtilization.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">
                          ${dept.spent.toLocaleString()} / ${dept.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dept.utilization > 90 ? 'bg-red-500' : 
                            dept.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${dept.utilization}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{dept.utilization}% utilized</span>
                        <span>${dept.remaining.toLocaleString()} remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {complianceData.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`flex items-center text-xs ${
                      metric.status === 'improved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.status === 'improved' ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(metric.change)}% vs last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance Details</CardTitle>
                <CardDescription>Detailed breakdown of policy compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-green-600">Compliant Expenses</h4>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-muted-foreground">92% of total</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-yellow-600">Pending Review</h4>
                      <p className="text-2xl font-bold">87</p>
                      <p className="text-sm text-muted-foreground">6% of total</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-red-600">Non-Compliant</h4>
                      <p className="text-2xl font-bold">28</p>
                      <p className="text-sm text-muted-foreground">2% of total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends Analysis</CardTitle>
                <CardDescription>Historical patterns and forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlySpendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} />
                    <Line type="monotone" dataKey="budget" stroke="#82ca9d" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}