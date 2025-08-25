"use client"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
    Bell,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    DollarSign,
    CreditCard,
    Users,
    FileText,
    Filter,
    Search,
    MoreHorizontal,
    Eye,
    Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const notifications = [
    {
        id: 1,
        type: "approval",
        title: "Expense Report Approval Required",
        description: "Travel expense report from John Doe needs approval - $2,340.50",
        time: "2 minutes ago",
        priority: "high",
        status: "pending",
        avatar: "/api/placeholder/32/32",
        initiator: "John Doe",
        amount: "$2,340.50"
    },
    {
        id: 2,
        type: "alert",
        title: "Budget Limit Exceeded",
        description: "Marketing department has exceeded monthly budget by 15%",
        time: "1 hour ago",
        priority: "high",
        status: "unread",
        department: "Marketing"
    },
    {
        id: 3,
        type: "message",
        title: "New Policy Update",
        description: "Updated expense policy regarding meal allowances",
        time: "3 hours ago",
        priority: "medium",
        status: "read"
    },
    {
        id: 4,
        type: "approval",
        title: "Card Request Approval",
        description: "New card request from Sarah Wilson - Marketing Manager",
        time: "5 hours ago",
        priority: "medium",
        status: "pending",
        avatar: "/api/placeholder/32/32",
        initiator: "Sarah Wilson",
        department: "Marketing"
    },
    {
        id: 5,
        type: "system",
        title: "Monthly Report Generated",
        description: "November expense report is ready for download",
        time: "1 day ago",
        priority: "low",
        status: "read"
    }
];

const approvals = [
    {
        id: 1,
        type: "expense",
        title: "Business Travel - Conference",
        requester: "John Doe",
        amount: "$2,340.50",
        date: "2024-01-15",
        status: "pending",
        description: "Attendance at Tech Conference 2024 including flights, hotel, and meals",
        attachments: 3
    },
    {
        id: 2,
        type: "card",
        title: "Corporate Card Request",
        requester: "Sarah Wilson",
        limit: "$5,000",
        date: "2024-01-14",
        status: "pending",
        description: "New corporate card for marketing activities and client entertainment",
        department: "Marketing"
    },
    {
        id: 3,
        type: "budget",
        title: "Budget Increase Request",
        requester: "Mike Johnson",
        amount: "$15,000",
        date: "2024-01-13",
        status: "pending",
        description: "Additional budget for Q1 software licenses and tools",
        department: "IT"
    }
];

const messages = [
    {
        id: 1,
        sender: "Finance Team",
        subject: "Monthly Closing Reminder",
        preview: "Please ensure all expenses are submitted by January 25th for month-end closing...",
        time: "2 hours ago",
        priority: "high",
        unread: true
    },
    {
        id: 2,
        sender: "HR Department",
        subject: "New Expense Policy Guidelines",
        preview: "We've updated our meal allowance policy. Please review the new guidelines...",
        time: "1 day ago",
        priority: "medium",
        unread: false
    },
    {
        id: 3,
        sender: "System Admin",
        subject: "System Maintenance Scheduled",
        preview: "ExpenseFlow will undergo maintenance this weekend from 10 PM to 2 AM...",
        time: "2 days ago",
        priority: "low",
        unread: false
    }
];

export default function Inbox() {
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "approval": return <FileText className="w-4 h-4" />;
            case "alert": return <AlertTriangle className="w-4 h-4" />;
            case "message": return <Mail className="w-4 h-4" />;
            case "system": return <Bell className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "destructive";
            case "medium": return "default";
            case "low": return "secondary";
            default: return "default";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-800";
            case "approved": return "bg-green-100 text-green-800";
            case "rejected": return "bg-red-100 text-red-800";
            case "unread": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
                        <p className="text-muted-foreground">
                            Manage notifications, approvals, and messages
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search inbox..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 w-[300px]"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[130px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">New messages</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div>
                            <p className="text-xs text-muted-foreground">Need immediate action</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="approvals">Approvals</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>All notifications, approvals, and messages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[600px]">
                                    <div className="space-y-4">
                                        {notifications.map((notification) => (
                                            <Sheet key={notification.id}>
                                                <SheetTrigger asChild>
                                                    <div className="flex items-start space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors">
                                                        <div className="flex-shrink-0">
                                                            {notification.avatar ? (
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage src={notification.avatar} />
                                                                    <AvatarFallback>{notification.initiator?.charAt(0) || 'S'}</AvatarFallback>
                                                                </Avatar>
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                                                                    {getNotificationIcon(notification.type)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                                                <div className="flex items-center space-x-2">
                                                                    <Badge variant={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                                                                    <Badge className={getStatusColor(notification.status)}>{notification.status}</Badge>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                                                                {notification.amount && (
                                                                    <span className="text-sm font-medium text-green-600">{notification.amount}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>{notification.title}</SheetTitle>
                                                        <SheetDescription>{notification.time}</SheetDescription>
                                                    </SheetHeader>
                                                    <div className="mt-6 space-y-4">
                                                        <div className="p-4 bg-accent rounded-lg">
                                                            <p className="text-sm">{notification.description}</p>
                                                        </div>
                                                        {notification.type === "approval" && (
                                                            <div className="flex space-x-2">
                                                                <Button className="flex-1">
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Approve
                                                                </Button>
                                                                <Button variant="destructive" className="flex-1">
                                                                    <XCircle className="w-4 h-4 mr-2" />
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Mark as Read
                                                            </Button>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="approvals" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Approvals</CardTitle>
                                <CardDescription>Items requiring your approval</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {approvals.map((approval) => (
                                        <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-start space-x-4">
                                                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                                                    {approval.type === "expense" ? (
                                                        <DollarSign className="w-5 h-5" />
                                                    ) : approval.type === "card" ? (
                                                        <CreditCard className="w-5 h-5" />
                                                    ) : (
                                                        <Users className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{approval.title}</h4>
                                                    <p className="text-sm text-muted-foreground">by {approval.requester}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">{approval.description}</p>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <span className="text-sm">
                                                            {approval.amount && `Amount: ${approval.amount}`}
                                                            {approval.limit && `Limit: ${approval.limit}`}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{approval.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button size="sm">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="destructive">
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="messages" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Messages</CardTitle>
                                <CardDescription>System messages and communications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`flex items-start space-x-4 p-4 rounded-lg border ${message.unread ? 'bg-blue-50' : ''}`}>
                                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{message.subject}</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant={getPriorityColor(message.priority)}>{message.priority}</Badge>
                                                        {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">From: {message.sender}</p>
                                                <p className="text-sm mt-1">{message.preview}</p>
                                                <span className="text-xs text-muted-foreground mt-2 block">{message.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}