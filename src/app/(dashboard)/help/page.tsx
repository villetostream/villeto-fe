import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    HelpCircle,
    MessageCircle,
    Search,
    Book,
    Video,
    Mail,
    Phone,
    Clock,
    CheckCircle,
    ExternalLink
} from "lucide-react";

const faqs = [
    {
        question: "How do I submit an expense report?",
        answer: "Click the 'Add Expense' button in the dashboard, fill out the form with transaction details, and upload your receipt.",
        category: "Expenses"
    },
    {
        question: "What's my spending limit?",
        answer: "Your spending limits are set by your manager and can be viewed in your card details. Contact your admin to request changes.",
        category: "Cards"
    },
    {
        question: "How long does approval take?",
        answer: "Most expenses under $50 are auto-approved. Others typically take 1-3 business days for manager review.",
        category: "Approvals"
    },
    {
        question: "Can I use my card for personal expenses?",
        answer: "No, corporate cards should only be used for business expenses. Personal use may result in policy violations.",
        category: "Policy"
    }
];

const supportChannels = [
    {
        name: "Live Chat",
        description: "Get instant help from our support team",
        availability: "24/7",
        responseTime: "< 2 minutes",
        icon: MessageCircle,
        status: "online"
    },
    {
        name: "Email Support",
        description: "Send us detailed questions via email",
        availability: "Business hours",
        responseTime: "< 4 hours",
        icon: Mail,
        status: "available"
    },
    {
        name: "Phone Support",
        description: "Call us for urgent issues",
        availability: "Mon-Fri 9AM-6PM PST",
        responseTime: "< 30 seconds",
        icon: Phone,
        status: "available"
    }
];

export default function Help() {
    return (
        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">Help & Support</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Find answers to your questions and get help when you need it
                        </p>
                    </div>
                    <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Live Chat
                    </Button>
                </div>

                {/* Search */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary w-5 h-5" />
                            <Input
                                placeholder="Search for help articles, FAQs, or features..."
                                className="pl-12 h-12 text-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Support Channels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supportChannels.map((channel, index) => (
                        <Card key={index} className="bg-dashboard-card border-dashboard-border">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                                        <channel.icon className="w-6 h-6 text-dashboard-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-dashboard-text-primary">{channel.name}</h3>
                                            <Badge
                                                className={`text-xs ${channel.status === 'online'
                                                    ? 'bg-status-success text-white'
                                                    : 'bg-dashboard-accent text-white'
                                                    }`}
                                            >
                                                {channel.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-dashboard-text-secondary mb-3">
                                            {channel.description}
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-dashboard-text-secondary">
                                                <Clock className="w-3 h-3" />
                                                {channel.availability}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-dashboard-text-secondary">
                                                <CheckCircle className="w-3 h-3" />
                                                Response time: {channel.responseTime}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-4"
                                        >
                                            {channel.name === 'Live Chat' ? 'Start Chat' :
                                                channel.name === 'Email Support' ? 'Send Email' : 'Call Now'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                <Book className="w-5 h-5" />
                                Documentation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Getting Started Guide
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                API Documentation
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Integration Guides
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Best Practices
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                <Video className="w-5 h-5" />
                                Video Tutorials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Platform Overview
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Expense Management
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Card Administration
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Reporting & Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Community
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                User Forum
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Feature Requests
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Release Notes
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Status Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQs */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="p-4 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <HelpCircle className="w-5 h-5 text-dashboard-accent mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium text-dashboard-text-primary">
                                                    {faq.question}
                                                </h3>
                                                <Badge variant="secondary" className="text-xs">
                                                    {faq.category}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-dashboard-text-secondary">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Button variant="outline">
                                View All FAQs
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Still need help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-dashboard-text-primary mb-3">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-dashboard-accent" />
                                        <span className="text-dashboard-text-secondary">support@expenseflow.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-dashboard-accent" />
                                        <span className="text-dashboard-text-secondary">+1 (555) 123-HELP</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-dashboard-accent" />
                                        <span className="text-dashboard-text-secondary">Mon-Fri 9AM-6PM PST</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-dashboard-text-primary mb-3">Emergency Support</h4>
                                <div className="space-y-2 text-sm">
                                    <p className="text-dashboard-text-secondary">
                                        For card security issues or urgent account problems:
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-status-error" />
                                        <span className="text-dashboard-text-primary font-medium">+1 (555) 911-CARD</span>
                                    </div>
                                    <p className="text-xs text-dashboard-text-secondary">Available 24/7</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}