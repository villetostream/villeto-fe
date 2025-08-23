
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Settings
} from "lucide-react";

export default function CompanySettings() {
  return (
    
      <div className="min-h-screen bg-dashboard-bg">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dashboard-text-primary">Company Settings</h1>
              <p className="text-dashboard-text-secondary mt-1">
                Manage your company profile, preferences, and system configuration
              </p>
            </div>
            <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
              Save Changes
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Company Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Company Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-dashboard-card border-dashboard-border">
                <CardHeader>
                  <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="legal-name">Legal Company Name</Label>
                        <Input id="legal-name" defaultValue="ExpenseFlow Inc." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dba-name">DBA Name</Label>
                        <Input id="dba-name" defaultValue="ExpenseFlow" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-id">Tax ID (EIN)</Label>
                        <Input id="tax-id" defaultValue="12-3456789" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incorporation">Incorporation State</Label>
                        <Select defaultValue="ca">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="de">Delaware</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select defaultValue="technology">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-size">Company Size</Label>
                        <Select defaultValue="50-200">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="50-200">50-200 employees</SelectItem>
                            <SelectItem value="200+">200+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founded">Founded</Label>
                        <Input id="founded" type="date" defaultValue="2020-01-01" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://expenseflow.com" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea 
                      id="description" 
                      className="min-h-[100px]"
                      defaultValue="A modern expense management platform helping businesses streamline their financial operations."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dashboard-card border-dashboard-border">
                <CardHeader>
                  <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Primary Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" defaultValue="123 Business Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit/Suite</Label>
                      <Input id="unit" defaultValue="Suite 400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue="CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" defaultValue="94105" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="gb">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-dashboard-card border-dashboard-border">
                  <CardHeader>
                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      System Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD - US Dollar</SelectItem>
                            <SelectItem value="eur">EUR - Euro</SelectItem>
                            <SelectItem value="gbp">GBP - British Pound</SelectItem>
                            <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dashboard-card border-dashboard-border">
                  <CardHeader>
                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Business Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Fiscal Year Start</Label>
                        <Select defaultValue="january">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="january">January</SelectItem>
                            <SelectItem value="april">April</SelectItem>
                            <SelectItem value="july">July</SelectItem>
                            <SelectItem value="october">October</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Working Days</Label>
                        <Select defaultValue="monday-friday">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday-friday">Monday - Friday</SelectItem>
                            <SelectItem value="sunday-thursday">Sunday - Thursday</SelectItem>
                            <SelectItem value="monday-saturday">Monday - Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Multi-currency support</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Automatic currency conversion</Label>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding" className="space-y-6">
              <Card className="bg-dashboard-card border-dashboard-border">
                <CardHeader>
                  <CardTitle className="text-dashboard-text-primary">Company Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company Logo</Label>
                        <div className="border-2 border-dashed border-dashboard-border rounded-lg p-6 text-center">
                          <Building className="w-8 h-8 mx-auto text-dashboard-text-secondary mb-2" />
                          <p className="text-sm text-dashboard-text-secondary">Upload logo (PNG, JPG)</p>
                          <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-dashboard-accent rounded border"></div>
                          <Input defaultValue="#6366f1" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company Favicon</Label>
                        <div className="border-2 border-dashed border-dashboard-border rounded-lg p-6 text-center">
                          <Globe className="w-8 h-8 mx-auto text-dashboard-text-secondary mb-2" />
                          <p className="text-sm text-dashboard-text-secondary">Upload favicon (16x16 px)</p>
                          <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-slate-500 rounded border"></div>
                          <Input defaultValue="#64748b" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show logo in emails</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Custom email templates</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>White-label branding</Label>
                      <Badge variant="outline">Pro Plan</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-6">
              <Card className="bg-dashboard-card border-dashboard-border">
                <CardHeader>
                  <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Office Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-dashboard-hover rounded-lg">
                      <div>
                        <h4 className="font-medium text-dashboard-text-primary">San Francisco HQ</h4>
                        <p className="text-sm text-dashboard-text-secondary">123 Business St, San Francisco, CA 94105</p>
                      </div>
                      <Badge>Primary</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-dashboard-hover rounded-lg">
                      <div>
                        <h4 className="font-medium text-dashboard-text-primary">New York Office</h4>
                        <p className="text-sm text-dashboard-text-secondary">456 Corporate Ave, New York, NY 10001</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Add New Location
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-dashboard-card border-dashboard-border">
                  <CardHeader>
                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Billing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Billing Email</Label>
                      <Input defaultValue="billing@expenseflow.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="p-3 bg-dashboard-hover rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5" />
                          <span>•••• 4242</span>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Billing Cycle</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dashboard-card border-dashboard-border">
                  <CardHeader>
                    <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-dashboard-accent/10 rounded-lg">
                      <h3 className="text-2xl font-bold text-dashboard-text-primary">Professional</h3>
                      <p className="text-dashboard-text-secondary">$49/month</p>
                      <Badge className="mt-2">Active</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Users</span>
                        <span>24/50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Next billing</span>
                        <span>Feb 15, 2024</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Upgrade Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}