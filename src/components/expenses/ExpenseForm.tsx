"use client";
import { useState, useMemo, useEffect, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  UseFormReturn,
  SubmitHandler,
  FieldValue,
  FieldValues,
} from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Label } from "../ui/label";
import Link from "next/link";
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
  amount: z.coerce.number<number>().min(1, "Amount is required"),
  transactionDate: z.date().refine((val) => !!val, {
    message: "Transaction date is required",
  }),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  // Base64 data-url for the uploaded receipt image (set from upload step).
  // NOTE: Receipt is required for final "Submit", but optional for "Save as Draft".
  receipt: z.string().optional(),
  splits: z.array(splitExpenseSchema).optional(),
});

const expenseFormSchema = z.object({
  expenses: z
    .array(expenseItemSchema)
    .min(1, "At least one expense is required"),
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
  "Other",
];

const merchants = ["Uber", "Netflix", "Air Peace", "Eko Hotel", "Starbucks"];

type PersonalExpenseStatus = "draft" | "pending";
type PersonalExpenseRow = {
  id: number;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  hasReceipt: boolean;
  status: PersonalExpenseStatus;
  receiptImage?: string;
  reportName?: string;
};

function formatDateForTable(d: Date): string {
  // Matches the "DD-MM-YYYY" style shown in the screenshot.
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear());
  return `${day}-${month}-${year}`;
}

function getNextPersonalExpenseId(existing: PersonalExpenseRow[]): number {
  const maxId = existing.reduce((m, r) => Math.max(m, r.id ?? 0), 0);
  return maxId + 1;
}

function readPersonalExpenses(): PersonalExpenseRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("personal-expenses");
    const parsed = raw ? (JSON.parse(raw) as PersonalExpenseRow[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePersonalExpenses(rows: PersonalExpenseRow[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("personal-expenses", JSON.stringify(rows));
  // Same-tab updates won't trigger the `storage` event; dispatch a custom event.
  window.dispatchEvent(new Event("personal-expenses-updated"));
}

export function ExpenseForm() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const reportName = decodeURIComponent(
    (searchParams.get("name") ?? "") as string,
  );
  const reportDate = decodeURIComponent(
    searchParams.get("date") ?? Date.now().toString(),
  );
  const { isOpen: IsSuccess, toggle: successToggle } = useModal();
  const router = useRouter();
  const ocrDataParam = searchParams.get("ocr");
  // Load receipt images from sessionStorage
  useEffect(() => {
    const storedImages = sessionStorage.getItem("uploadedReceipts");
    if (storedImages) {
      console.log({ storedImages });
      setFiles(JSON.parse(storedImages));
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

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      expenses: [defaultExpense], // Default to one expense
    },
  });

  // Load receipt images and initialize form fields
  useEffect(() => {
    const storedImages = sessionStorage.getItem("uploadedReceipts");
    if (storedImages) {
      const parsedImages = JSON.parse(storedImages);
      setFiles(parsedImages);

      const initialExpenses = parsedImages.map((receipt: string, index: number) => {
        return {
          ...defaultExpense,
          receipt,
        };
      });

      if (initialExpenses.length > 0) {
        form.reset({ expenses: initialExpenses });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrDataParam]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expenses",
  });



  // // Watch all amounts and debounce them
  // const watchedAmounts = fields.map((_, index) =>
  //     form.watch(`expenses.${index}.amount`)
  // )

  const amountFieldsNames = Array(fields.length)
    .fill(null)
    .map(
      (_, index) => `expenses.${index}.amount`,
    ) as Array<`expenses.${number}.amount`>;

  const amounts = form.watch(amountFieldsNames);

  const receiptFieldsNames = Array(fields.length)
    .fill(null)
    .map(
      (_, index) => `expenses.${index}.receipt`,
    ) as Array<`expenses.${number}.receipt`>;
  const receipts = form.watch(receiptFieldsNames);

  const hasAllReceipts = fields.every((_, idx) =>
    Boolean(files[idx] || receipts?.[idx]),
  );

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onReceiptSelect = async (
    expenseIndex: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image receipt.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFiles((prev) => {
        const next = [...(prev ?? [])];
        next[expenseIndex] = base64;
        return next;
      });
      form.setValue(`expenses.${expenseIndex}.receipt`, base64, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.clearErrors(`expenses.${expenseIndex}.receipt`);
    } catch {
      toast.error("Failed to upload receipt. Please try again.");
    } finally {
      // allow re-upload of the same file
      e.target.value = "";
    }
  };

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

  const persistToPersonalExpenses = (
    data: ExpenseFormValues,
    status: PersonalExpenseStatus,
  ) => {
    const existing = readPersonalExpenses();
    let nextId = getNextPersonalExpenseId(existing);

    const newRows: PersonalExpenseRow[] = data.expenses.map((expense, idx) => {
      const receiptImage = files[idx] || expense.receipt || undefined;
      const expenseId = nextId++;

      // Store report name and date for this expense
      if (typeof window !== "undefined" && reportName && reportDate) {
        sessionStorage.setItem(`expense-report-name-${expenseId}`, reportName);
        sessionStorage.setItem(`expense-report-date-${expenseId}`, reportDate);
      }

      return {
        id: expenseId,
        date: formatDateForTable(expense.transactionDate),
        vendor: expense.vendor,
        category: expense.category,
        amount: Number(expense.amount),
        hasReceipt: Boolean(receiptImage),
        status,
        receiptImage,
        reportName: reportName || undefined,
      };
    });

    writePersonalExpenses([...newRows, ...existing]);
  };

  const onSubmit = (data: ExpenseFormValues) => {
    // Receipt is mandatory for final submission.
    const missingReceiptIndexes = data.expenses
      .map((expense, idx) => {
        const receiptBase64 = files[idx] || expense.receipt;
        return receiptBase64 ? null : idx;
      })
      .filter((v): v is number => v !== null);

    if (missingReceiptIndexes.length > 0) {
      missingReceiptIndexes.forEach((idx) => {
        form.setError(`expenses.${idx}.receipt`, {
          type: "manual",
          message: "Receipt is required to submit.",
        });
      });
      toast.error("Please upload a receipt before submitting.");
      return;
    }

    // Validate splits
    const invalidSplits = data.expenses.some((expense) => {
      if (expense.splits && expense.splits.length > 0) {
        const totalSplitAmount = expense.splits.reduce(
          (sum, split) => sum + split.amount,
          0,
        );
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

    persistToPersonalExpenses(data, "pending");
    toast.success(
      `Your ${data.expenses.length} expense(s) have been submitted for review.`,
    );

    form.reset({
      expenses: [
        {
          vendor: "",
          amount: 0,
          category: "",
          description: "",
          transactionDate: new Date(),
          receipt: "",
          splits: [],
        },
      ],
    });
    successToggle();
    setUploadedFiles([]);
    sessionStorage.removeItem("uploadedReceipts");
    router.push("/expenses?tab=personal-expenses");
    // toggle();
  };

  return (
    <>
      <SuccessModal
        isOpen={IsSuccess}
        onClose={() => {
          successToggle();
        }}
        onClick={() => {}}
        title="Expense Submitted"
        description="Your expense has been successful submitted your expense."
        buttonText="Back to Dashboard"
      />
      <div>
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit as SubmitHandler<FieldValues>,
              )}
              className="space-y-6 px-6 pb-6"
            >
              {/* Modern Report Header */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Report Name</h3>
                      <p className="text-lg font-semibold text-foreground">{reportName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 4v10m4-10v10m-8-6v6" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <h3 className="text-sm font-medium text-muted-foreground">Report Date</h3>
                      <p className="text-lg font-semibold text-foreground">{reportDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Expense Forms */}
              <div className="space-y-6">
                {/* If multiple expenses, render each section inside an accordion; otherwise render plain */}
                {fields.length > 1 ? (
                  <Accordion type="multiple" className="w-full">
                    {fields.map((field, index) => {
                      const amount = amounts[index] || 0;
                      return (
                        <AccordionItem key={field.id} value={`expense-${index}`}>
                          <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-md text-left">
                            <div className="flex w-full justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">Expense {index + 1}</span>
                                <span className="text-sm text-muted-foreground flex items-center gap-3">
                                  <span>{form.getValues(`expenses.${index}.vendor`) || "No vendor"}</span>
                                  <span>•</span>
                                  <span>
                                    ${Number(form.getValues(`expenses.${index}.amount`) || 0).toLocaleString()}
                                  </span>
                                </span>
                              </div>
                              {fields.length > 1 && index != 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeExpense(index);
                                  }}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-0 gap-8 relative flex items-start px-6 justify-center">
                              <div className="space-y-5 max-w-lg flex flex-col pr-16">
                                <SplitExpense control={form.control} expenseIndex={index} totalAmount={amount} />

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
                                    label="Expense Category"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <FormFieldInput
                                    control={form.control}
                                    name={`expenses.${index}.vendor`}
                                    label="Merchant"
                                    placeholder="Enter Merchant"
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

                                {index === fields.length - 1 && (
                                  <Button
                                    type="button"
                                    variant={"link"}
                                    className="text-primary underline text-base font-bold leading-[150%] w-fit ml-auto place-self-end"
                                    onClick={addExpense}
                                  >
                                    Add Another
                                  </Button>
                                )}
                              </div>
                              <div className="max-w-sm">
                                <Label className="text-xs leading-[125%] font-normal text-foreground mb-1.5 block">
                                  Receipt
                                </Label>
                                <div className="rounded-lg border border-border bg-white p-3 h-[420px] overflow-hidden flex items-center justify-center">
                                  {files[index] ? (
                                    <img src={files[index]} alt="Uploaded receipt" className="w-full h-full object-contain" />
                                  ) : (
                                    <div className="text-sm text-muted-foreground text-center px-6 space-y-3">
                                      <div className="text-destructive font-medium">No receipt found for this item.</div>
                                      <div className="text-muted-foreground">You can’t submit without a receipt. Upload one to continue.</div>
                                      <input
                                        id={`receipt-input-${index}`}
                                        type="file"
                                        accept="image/*"
                                        aria-label={`Upload receipt for item ${index + 1}`}
                                        className="hidden"
                                        onChange={(e) => onReceiptSelect(index, e)}
                                      />
                                      <Button
                                        type="button"
                                        variant="outlinePrimary"
                                        onClick={() => {
                                          document.getElementById(`receipt-input-${index}`)?.click();
                                        }}
                                      >
                                        Continue to upload receipt
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`expenses.${index}.receipt`}
                                  render={() => (
                                    <FormItem className="pt-2">
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                ) : (
                  fields.map((field, index) => {
                    const amount = amounts[index] || 0;
                    return (
                      <div key={field.id} className="p-0 gap-8 relative flex items-start px-6 justify-center">
                        <div className="space-y-5 max-w-lg flex flex-col pr-16">
                          {fields.length > 1 && index != 0 && (
                            <div className="ml-auto w-fit flex">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="hover:bg-destructive/10"
                                onClick={() => removeExpense(index)}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}

                          <SplitExpense control={form.control} expenseIndex={index} totalAmount={amount} />

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
                              label="Expense Category"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormFieldInput
                              control={form.control}
                              name={`expenses.${index}.vendor`}
                              label="Merchant"
                              placeholder="Enter Merchant"
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

                          {index === fields.length - 1 && (
                            <Button
                              type="button"
                              variant={"link"}
                              className="text-primary underline text-base font-bold leading-[150%] w-fit ml-auto place-self-end"
                              onClick={addExpense}
                            >
                              Add Another
                            </Button>
                          )}
                        </div>
                        <div className="max-w-sm">
                          <Label className="text-xs leading-[125%] font-normal text-foreground mb-1.5 block">Receipt</Label>
                          <div className="rounded-lg border border-border bg-white p-3 h-[420px] overflow-hidden flex items-center justify-center">
                            {files[index] ? (
                              <img src={files[index]} alt="Uploaded receipt" className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-sm text-muted-foreground text-center px-6 space-y-3">
                                <div className="text-destructive font-medium">No receipt found for this item.</div>
                                <div className="text-muted-foreground">You can’t submit without a receipt. Upload one to continue.</div>
                                <input
                                  id={`receipt-input-${index}`}
                                  type="file"
                                  accept="image/*"
                                  aria-label={`Upload receipt for item ${index + 1}`}
                                  className="hidden"
                                  onChange={(e) => onReceiptSelect(index, e)}
                                />
                                <Button
                                  type="button"
                                  variant="outlinePrimary"
                                  onClick={() => {
                                    document.getElementById(`receipt-input-${index}`)?.click();
                                  }}
                                >
                                  Continue to upload receipt
                                </Button>
                              </div>
                            )}
                          </div>
                          <FormField
                            control={form.control}
                            name={`expenses.${index}.receipt`}
                            render={() => (
                              <FormItem className="pt-2">
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Form Actions */}
              <div className="flex space-x-4 pt-10">
                <Button type="submit" size={"md"} disabled={!hasAllReceipts}>
                  Submit{" "}
                  {fields.length > 1 ? `${fields.length} Expenses` : "Expense"}
                </Button>
                <Button
                  type="button"
                  variant="outlinePrimary"
                  onClick={() => {
                    const values = form.getValues();
                    // Trigger validation so required fields are respected.
                    form.handleSubmit((validData) => {
                      persistToPersonalExpenses(
                        validData as ExpenseFormValues,
                        "draft",
                      );
                      toast.success("Saved as draft.");
                      sessionStorage.removeItem("uploadedReceipts");
                      router.push("/expenses?tab=personal-expenses");
                    })();
                  }}
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
