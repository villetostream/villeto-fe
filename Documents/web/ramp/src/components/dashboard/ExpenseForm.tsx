import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    CalendarIcon,
    Upload,
    X,
    Receipt,
    CreditCard,
    Building,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const expenseFormSchema = z.object({
    merchant: z.string().min(1, "Merchant name is required"),
    amount: z.string().min(1, "Amount is required"),
    date: z.date().refine((val) => !!val, {
        message: "Transaction date is required",
    }),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    employee: z.string().min(1, "Employee is required"),
    department: z.string().min(1, "Department is required"),
    businessPurpose: z.string().min(1, "Business purpose is required"),
    paymentMethod: z.string().min(1, "Payment method is required"),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const categories = [
    "Meals & Entertainment",
    "Travel & Transportation",
    "Office Supplies",
    "Software & Subscriptions",
    "Professional Services",
    "Marketing & Advertising",
    "Training & Education",
    "Equipment & Hardware",
    "Utilities",
    "Insurance",
    "Other"
];

const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance & Accounting",
    "Operations",
    "Support",
    "Legal",
    "IT"
];

const employees = [
    "Oscar Hernandez",
    "Lawrence Wang",
    "Leila Iqbal",
    "Bill Joy",
    "Sarah Chen",
    "Michael Rodriguez",
    "Emma Thompson"
];

const paymentMethods = [
    "Corporate Credit Card",
    "Personal (Reimbursement)",
    "Company Account",
    "Cash"
];

interface ExpenseFormProps {
    trigger?: React.ReactNode;
}

export function ExpenseForm({ trigger }: ExpenseFormProps) {
    const [open, setOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            merchant: "",
            amount: "",
            category: "",
            description: "",
            employee: "",
            department: "",
            businessPurpose: "",
            paymentMethod: "",
        },
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (data: ExpenseFormValues) => {
        console.log("Expense submitted:", data);
        console.log("Uploaded files:", uploadedFiles);

        toast.success("Your expense has been submitted for review.",
        );

        form.reset();
        setUploadedFiles([]);
        setOpen(false);
    };

    const defaultTrigger = (
        <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-dashboard-text-primary">
                        Submit New Expense
                    </DialogTitle>
                    <DialogDescription className="text-dashboard-text-secondary">
                        Fill out the details below to submit your expense for approval.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-dashboard-text-primary flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-dashboard-accent" />
                                Transaction Details
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="merchant"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Merchant Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Starbucks" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input placeholder="$0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Transaction Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-dashboard-text-secondary"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date > new Date()}
                                                        initialFocus
                                                        className={cn("p-3 pointer-events-auto")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Additional details about this expense..."
                                                className="resize-none"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Employee Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-dashboard-text-primary flex items-center gap-2">
                                <User className="w-5 h-5 text-dashboard-accent" />
                                Employee Information
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="employee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Employee</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select employee" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {employees.map((employee) => (
                                                        <SelectItem key={employee} value={employee}>
                                                            {employee}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((department) => (
                                                        <SelectItem key={department} value={department}>
                                                            {department}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Business Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-dashboard-text-primary flex items-center gap-2">
                                <Building className="w-5 h-5 text-dashboard-accent" />
                                Business Information
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="businessPurpose"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Purpose</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Client meeting" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="How was this paid?" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {paymentMethods.map((method) => (
                                                        <SelectItem key={method} value={method}>
                                                            <div className="flex items-center gap-2">
                                                                <CreditCard className="w-4 h-4" />
                                                                {method}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-dashboard-text-primary flex items-center gap-2">
                                <Upload className="w-5 h-5 text-dashboard-accent" />
                                Receipt & Documents
                            </h3>

                            <div className="border-2 border-dashed border-dashboard-border rounded-lg p-6">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-dashboard-text-secondary" />
                                    <div className="mt-4">
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <span className="mt-2 block text-sm font-medium text-dashboard-text-primary">
                                                Upload receipt or document
                                            </span>
                                            <span className="mt-1 block text-sm text-dashboard-text-secondary">
                                                PNG, JPG, PDF up to 10MB
                                            </span>
                                        </label>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            multiple
                                            accept=".png,.jpg,.jpeg,.pdf"
                                            className="sr-only"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        Choose Files
                                    </Button>
                                </div>
                            </div>

                            {/* Uploaded Files */}
                            {uploadedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-dashboard-text-primary">
                                        Uploaded Files ({uploadedFiles.length})
                                    </p>
                                    <div className="space-y-2">
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-dashboard-hover rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <Receipt className="w-4 h-4 text-dashboard-accent" />
                                                    <span className="text-sm text-dashboard-text-primary">{file.name}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </Badge>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-dashboard-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-dashboard-accent hover:bg-dashboard-accent/90 text-white"
                            >
                                Submit Expense
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}