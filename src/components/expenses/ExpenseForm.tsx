"use client"
import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "../ui/label";
import Link from "next/link";
import FileUpload from "../onboarding/_shared/FileUpload";
import FormFieldInput from "../form fields/formFieldInput";
import FormFieldSelect from "../form fields/formFieldSelect";
import FormFieldTextArea from "../form fields/formFieldTextArea";
import { Trash } from "iconsax-reactjs";
import FormFieldCalendar from "../form fields/FormFieldCalendar";
import useModal from "@/hooks/useModal";
import SuccessModal from "../modals/SuccessModal";
import { SplitExpense } from "./split/SplitExpenseform";
import { splitExpenseSchema } from "./split/splitSchema";

// Custom debounce hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useMemo(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const expenseItemSchema = z.object({
    vendor: z.string().min(1, "Vendor name is required"),
    amount: z.coerce.number().min(1, "Amount is required"),
    transactionDate: z.date().refine((val) => !!val, {
        message: "Transaction date is required",
    }),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    receipt: z.string().min(1, "Receipt is required"),
    splits: z.array(splitExpenseSchema).optional(),
});

const expenseFormSchema = z.object({
    expenses: z.array(expenseItemSchema).min(1, "At least one expense is required"),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
type ExpenseItemValues = z.infer<typeof expenseItemSchema>;

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

export interface ExpenseFormProps {
    trigger?: React.ReactNode;
    isOpen: boolean,
    open: () => void,
    toggle: () => void,
    reportName?: string,
    reportDate?: string,
}

export function ExpenseForm({ trigger, isOpen, open, toggle, reportDate, reportName }: ExpenseFormProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const { isOpen: IsSuccess, toggle: successToggle } = useModal()

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            expenses: [{
                vendor: "",
                amount: 0 as unknown as number,
                category: "",
                description: "",
                transactionDate: new Date(),
                receipt: "",
                splits: []
            }]
        },
    }) as unknown as UseFormReturn<ExpenseFormValues>;

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "expenses",
    });

    // // Watch all amounts and debounce them
    // const watchedAmounts = fields.map((_, index) =>
    //     form.watch(`expenses.${index}.amount`)
    // )

    const amountFieldsNames = Array(fields.length).fill(null).map((_, index) => `expenses.${index}.amount`) as Array<`expenses.${number}.amount`>

    const amounts = form.watch(amountFieldsNames)

    // const debouncedAmounts = useDebounce(watchedAmounts, 300); // 300ms delay

    const addExpense = () => {
        append({
            vendor: "",
            amount: 0,
            category: "",
            description: "",
            transactionDate: new Date(),
            receipt: "",
        });
    };

    const removeExpense = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        } else {
            toast.error("You must have at least one expense item");
        }
    };

    const onSubmit = (data: ExpenseFormValues) => {
        // Validate splits
        const invalidSplits = data.expenses.some(expense => {
            if (expense.splits && expense.splits.length > 0) {
                const totalSplitAmount = expense.splits.reduce((sum, split) => sum + split.amount, 0);
                return Math.abs(totalSplitAmount - expense.amount) > 0.01; // Allow small floating point differences
            }
            return false;
        });

        if (invalidSplits) {
            toast.error("Total split amounts must equal the expense amount");
            return;
        }

        console.log("Expenses submitted:", data.expenses);
        console.log("Uploaded files:", uploadedFiles);

        toast.success(`Your ${data.expenses.length} expense(s) have been submitted for review.`);

        form.reset({
            expenses: [{
                vendor: "",
                amount: 0,
                category: "",
                description: "",
                transactionDate: new Date(),
                receipt: "",
                splits: [],
            }]
        });
        successToggle()
        setUploadedFiles([]);
        // toggle();
    };

    return (
        <>
            <SuccessModal
                isOpen={IsSuccess}
                onClose={() => {
                    successToggle()
                    toggle()
                }}
                onClick={() => {
                    toggle()
                }}
                title="Expense Submitted"
                description="Your expense has been successful submitted your expense."
                buttonText="Back to Dashboard"
            />
            <Sheet open={isOpen} onOpenChange={toggle}>
                <SheetContent side="right" className="w-full lg:w-[500px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-semibold text-dashboard-text-primary">
                            Continue {reportName} Report
                        </SheetTitle>
                        <SheetDescription className="text-dashboard-text-secondary">

                        </SheetDescription>
                    </SheetHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-6">
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                                <div>
                                    <Label className="text-xs leading-[125%] font-normal text-foreground mb-1.5 block">
                                        Name of Report
                                    </Label>
                                    <p className="text-foreground text-sm font-medium leading-[125%]">{reportName}</p>
                                </div>
                                <div>
                                    <Label className="text-xs leading-[125%] font-normal text-foreground mb-1.5 block">
                                        Report Date
                                    </Label>
                                    <p className="text-foreground text-sm font-medium leading-[125%]">{reportDate}</p>
                                </div>
                            </div>

                            {/* Dynamic Expense Forms */}
                            <div className="space-y-5">
                                {fields.map((field, index) => {
                                    // Use the debounced amount instead of directly watching
                                    const amount = amounts[index] || 0;
                                    console.log({ amount }, { amounts })

                                    return (
                                        <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 relative">
                                            {/* Remove button for additional forms */}
                                            {fields.length > 1 && index != 0 && (
                                                <div className="ml-auto w-fit flex">
                                                    <Button
                                                        type="button"
                                                        variant="ghostNavy"
                                                        size="sm"
                                                        className="hover:bg-destructive/10 ml-auto"
                                                        onClick={() => removeExpense(index)}
                                                    >
                                                        <Trash className="h-4 w-4 text-destructive" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}

                                            <SplitExpense
                                                control={form.control}
                                                expenseIndex={index}
                                                totalAmount={amount}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormFieldInput
                                                    control={form.control}
                                                    name={`expenses.${index}.amount`}
                                                    label="Amount"
                                                    placeholder="Enter Amount"
                                                    type="number"
                                                    inputMode="numeric"
                                                />
                                                <FormFieldSelect
                                                    control={form.control}
                                                    name={`expenses.${index}.category`}
                                                    values={categories.map((category) => ({ label: category, value: category }))}
                                                    placeholder="Select Category"
                                                    label="Category"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormFieldSelect
                                                    control={form.control}
                                                    name={`expenses.${index}.vendor`}
                                                    values={categories.map((category) => ({ label: category, value: category }))}
                                                    placeholder="Select Vendor"
                                                    label="Vendor"
                                                />
                                                <FormFieldCalendar
                                                    control={form.control}
                                                    name={`expenses.${index}.transactionDate`}
                                                    label="Transaction Date"
                                                />
                                            </div>

                                            {/* File Upload */}
                                            <FormField
                                                control={form.control}
                                                name={`expenses.${index}.receipt`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FileUpload
                                                            label="Upload Receipt"
                                                            helper="Add Picture or drop here"
                                                            maxSize={5 * 1024 * 1024}
                                                            onUploaded={({ name }) => field.onChange(name)}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormFieldTextArea
                                                control={form.control}
                                                label="Description"
                                                name={`expenses.${index}.description`}
                                                placeholder=""
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add Another Button */}
                            <Button
                                type="button"
                                variant={"link"}
                                className="text-primary underline text-base font-bold leading-[150%] w-fit ml-auto"
                                onClick={addExpense}
                            >
                                Add Another
                            </Button>

                            {/* Form Actions */}
                            <div className="flex space-x-4 pt-10">
                                <Button
                                    type="submit"
                                    size={"md"}
                                >
                                    Submit {fields.length > 1 ? `${fields.length} Expenses` : 'Expense'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outlinePrimary"
                                    onClick={toggle}
                                    size={"md"}
                                >
                                    Save As Draft
                                </Button>
                            </div>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    );
}