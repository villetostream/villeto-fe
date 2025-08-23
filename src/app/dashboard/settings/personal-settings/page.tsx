import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    Palette,
    Globe,
    Clock,
    CreditCard,
    Key,
    Camera,
    Download,
    Trash2
} from "lucide-react";

export default function PersonalSettings() {
    return (
        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">Personal Settings</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Manage your personal profile, preferences, and account security
                        </p>
                    </div>
                    <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                        Save Changes
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card className="bg-dashboard-card border-dashboard-border">
                            <CardHeader>
                                <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Profile Picture */}
                                <div className="flex items-center gap-6">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium text-dashboard-text-primary">Profile Picture</h3>
                                        <p className="text-sm text-dashboard-text-secondary">
                                            JPG, GIF or PNG. 1MB max.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <Camera className="w-4 h-4 mr-2" />
                                                Upload new
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-status-error hover:text-status-error">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First Name</Label>
                                            <Input id="first-name" defaultValue="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last Name</Label>
                                            <Input id="last-name" defaultValue="Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" defaultValue="john.doe@expenseflow.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" defaultValue="+1 (555) 123-4567" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="job-title">Job Title</Label>
                                            <Input id="job-title" defaultValue="Senior Product Manager" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Select defaultValue="product">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="product">Product</SelectItem>
                                                    <SelectItem value="engineering">Engineering</SelectItem>
                                                    <SelectItem value="design">Design</SelectItem>
                                                    <SelectItem value="sales">Sales</SelectItem>
                                                    <SelectItem value="marketing">Marketing</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="manager">Direct Manager</Label>
                                            <Select defaultValue="sarah">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sarah">Sarah Johnson - VP Product</SelectItem>
                                                    <SelectItem value="mike">Mike Chen - Director</SelectItem>
                                                    <SelectItem value="lisa">Lisa Wang - Senior Manager</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Office Location</Label>
                                            <Select defaultValue="sf">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                                                    <SelectItem value="ny">New York, NY</SelectItem>
                                                    <SelectItem value="remote">Remote</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        className="min-h-[100px]"
                                        placeholder="Tell us about yourself..."
                                        defaultValue="Product manager passionate about building user-friendly expense management solutions."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Mail className="w-5 h-5" />
                                        Account Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Employee ID</Label>
                                        <Input defaultValue="EMP-2024-001" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input defaultValue="January 15, 2024" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Account Status</Label>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-status-success text-white">Active</Badge>
                                            <span className="text-sm text-dashboard-text-secondary">Full Access</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">Employee</Badge>
                                            <span className="text-sm text-dashboard-text-secondary">Standard permissions</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Expense Card
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-dashboard-accent to-dashboard-accent/80 rounded-lg text-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm opacity-90">ExpenseFlow Card</p>
                                                <p className="text-xs opacity-75">•••• •••• •••• 4242</p>
                                            </div>
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs opacity-75">Monthly Limit</p>
                                                <p className="text-lg font-semibold">$2,500</p>
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-75">Remaining</p>
                                                <p className="text-lg font-semibold">$1,847</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dashboard-text-secondary">Card Status</span>
                                            <Badge className="bg-status-success text-white">Active</Badge>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dashboard-text-secondary">This Month</span>
                                            <span className="text-dashboard-text-primary">$653 spent</span>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full">
                                        View Card Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Email Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Expense submissions</Label>
                                                <p className="text-sm text-dashboard-text-secondary">When you submit an expense</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Approval updates</Label>
                                                <p className="text-sm text-dashboard-text-secondary">When expenses are approved/rejected</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Card transactions</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Real-time card transaction alerts</p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Monthly reports</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Monthly expense summaries</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Phone className="w-5 h-5" />
                                        Push Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Card alerts</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Instant transaction notifications</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Spending limits</Label>
                                                <p className="text-sm text-dashboard-text-secondary">When approaching limits</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Policy violations</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Expense policy alerts</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Reminders</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Expense submission reminders</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Palette className="w-5 h-5" />
                                        Display Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Theme</Label>
                                        <Select defaultValue="system">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Español</SelectItem>
                                                <SelectItem value="fr">Français</SelectItem>
                                                <SelectItem value="de">Deutsch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Currency Display</Label>
                                        <Select defaultValue="usd">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usd">USD ($)</SelectItem>
                                                <SelectItem value="eur">EUR (€)</SelectItem>
                                                <SelectItem value="gbp">GBP (£)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Regional Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Timezone</Label>
                                        <Select defaultValue="pst">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pst">Pacific Standard Time</SelectItem>
                                                <SelectItem value="est">Eastern Standard Time</SelectItem>
                                                <SelectItem value="cst">Central Standard Time</SelectItem>
                                                <SelectItem value="mst">Mountain Standard Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date Format</Label>
                                        <Select defaultValue="mm-dd-yyyy">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                                                <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                                                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Number Format</Label>
                                        <Select defaultValue="us">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="us">1,234.56 (US)</SelectItem>
                                                <SelectItem value="eu">1.234,56 (EU)</SelectItem>
                                                <SelectItem value="in">1,23,456.78 (IN)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Key className="w-5 h-5" />
                                        Password & Authentication
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Two-factor authentication</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Extra security for your account</p>
                                            </div>
                                            <Badge className="bg-status-success text-white">Enabled</Badge>
                                        </div>
                                        <Button variant="outline" className="w-full">
                                            Change Password
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Manage 2FA Settings
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Privacy & Data
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Profile visibility</Label>
                                                <p className="text-sm text-dashboard-text-secondary">Who can see your profile</p>
                                            </div>
                                            <Select defaultValue="company">
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="public">Public</SelectItem>
                                                    <SelectItem value="company">Company</SelectItem>
                                                    <SelectItem value="private">Private</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button variant="outline" className="w-full">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download My Data
                                        </Button>
                                        <Button variant="outline" className="w-full text-status-error hover:text-status-error">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}