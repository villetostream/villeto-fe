import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { getStatusIcon } from '@/lib/helper';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
interface ExpenseDetailsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ExpenseDetails = ({ open, onOpenChange }: ExpenseDetailsProps) => {
    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="text-xl font-semibold text-dashboard-text-primary">
                            Expense Report Details
                        </SheetTitle>

                    </SheetHeader>
                    <div className="space-y-4 overflow-auto p-5">
                        {/* Report Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Name of Report</p>
                                <p className="text-base font-medium text-foreground">Exp Lunch 2020</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Report Date</p>
                                <p className="text-base font-medium text-foreground">12/08/2025</p>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Amount</p>
                            <p className="text-2xl font-semibold text-foreground">$7,500</p>
                        </div>

                        {/* Expense Category */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Expense Category</p>
                            <p className="text-base text-foreground">Software Subscription</p>
                        </div>

                        {/* Vendor */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Vendor</p>
                            <p className="text-base text-foreground">Atlassian</p>
                        </div>

                        {/* Transaction Date */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Transaction Date</p>
                            <p className="text-base text-foreground">12/08/2025</p>
                        </div>

                        {/* Status */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            <Badge variant="pending" className="mt-1">
                                {getStatusIcon("pending")}
                                Pending
                            </Badge>
                        </div>

                        {/* Receipt */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-3">Receipt</p>
                            <div className="bg-background rounded-lg overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop"
                                    alt="Receipt"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="text-base text-foreground">
                                Engineering department share of Jira/Confluence subscription.
                            </p>
                        </div>

                        {/* Action Link */}
                        <div className="pt-2 text-right">
                            <Button variant="link" className="text-primary font-semibold">
                                View Split Expense
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default ExpenseDetails