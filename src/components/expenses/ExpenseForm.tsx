"use client"
import { useState, useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, UseFormReturn, SubmitHandler, FieldValue, FieldValues } from "react-hook-form";
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
import { useRouter, useSearchParams } from "next/navigation";

interface OCRData {
    vendor: string;
    amount: number;
    transactionDate: string;
    category: string;
    description: string;
}
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
    amount: z.number().min(1, "Amount is required"),
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

export function ExpenseForm() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [files, setFiles] = useState<string[]>([]);
    const searchParams = useSearchParams()
    const reportName = decodeURIComponent((searchParams.get("name") ?? "") as string)
    const reportDate = decodeURIComponent(searchParams.get("date") ?? Date.now().toString());
    const { isOpen: IsSuccess, toggle: successToggle } = useModal()
    const router = useRouter()
    const ocrDataParam = searchParams.get("ocr");
    // Load receipt images from sessionStorage
    useEffect(() => {
        const storedImages = sessionStorage.getItem("uploadedReceipts");
        if (storedImages) {
            console.log({ storedImages })
            setFiles((JSON.parse(storedImages)));
        }
    }, []);
    // Parse OCR data if available
    const ocrData: OCRData[] = ocrDataParam ? JSON.parse(ocrDataParam) : [];

    const defaultExpense = {
        vendor: "",
        amount: 0,
        transactionDate: new Date(),
        category: "",
        description: "",
        receipt: "",
    };

    // Pre-fill from OCR data if available
    const initialExpenses = ocrData.length > 0
        ? ocrData.map((data) => ({
            vendor: data.vendor,
            amount: data.amount,
            transactionDate: new Date(data.transactionDate),
            category: data.category,
            description: data.description,
            receipt: "receipt-uploaded",
        }))
        : [defaultExpense];

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            expenses: initialExpenses,
        },
    });

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

                }}
                onClick={() => {

                }}
                title="Expense Submitted"
                description="Your expense has been successful submitted your expense."
                buttonText="Back to Dashboard"
            />
            <div>
                <>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-6 px-4 pb-6">
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
                            <div className="space-y-6">
                                {fields.map((field, index) => {
                                    // Use the debounced amount instead of directly watching
                                    const amount = amounts[index] || 0;
                                    console.log({ amount }, { amounts })

                                    return (
                                        <div key={field.id} className=" p-4 gap-10 relative grid lg:grid-cols-3" >
                                            <div className="col-span-2 space-y-5">
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



                                                <FormFieldTextArea
                                                    control={form.control}
                                                    label="Description"
                                                    name={`expenses.${index}.description`}
                                                    placeholder=""
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
                                                            originalUpload={files[0]}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
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
                                    onClick={() => router.push("/expense")}
                                    size={"md"}
                                >
                                    Save As Draft
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            </div>
        </>
    );
}