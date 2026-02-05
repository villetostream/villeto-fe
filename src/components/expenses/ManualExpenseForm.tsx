"use client";
import { useState, useEffect, type ChangeEvent } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseCategory {
  categoryId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface CategoryApiResponse {
  message: string;
  status: number;
  data: ExpenseCategory[];
}

const expenseItemSchema = z.object({
  title: z.string().min(1, "Expense title is required"),
  vendor: z.string().min(1, "Vendor name is required"),
  amount: z.coerce.number<number>().min(1, "Amount is required"),
  transactionDate: z.date().refine((val) => !!val, {
    message: "Transaction date is required",
  }),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  receipt: z.string().optional(),
  splits: z.array(splitExpenseSchema).optional(),
});

const expenseFormSchema = z.object({
  expenses: z
    .array(expenseItemSchema)
    .min(1, "At least one expense is required"),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

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
  title?: string;
  description?: string;
  groupId?: string; // For grouping multiple expenses with same report name
  isGrouped?: boolean; // True if this is a grouped entry
  groupedExpenses?: PersonalExpenseRow[]; // Array of individual expenses in the group
  totalAmount?: number; // Total amount for grouped expenses
};

function formatDateForTable(d: Date): string {
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
  window.dispatchEvent(new Event("personal-expenses-updated"));
}

// Helper to format date to ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)
const toISODateString = (date: Date | string) => {
  const d = new Date(date);
  // Set time to midnight UTC for the date
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
};

interface ManualExpenseFormProps {
  isEditMode?: boolean;
  reportDetail?: any;
  reportId?: string;
  onDeleteExpense?: (expenseId: string, title: string) => void;
  onUpdateSuccess?: () => void; // Callback to refetch report details after successful update
}

export function ManualExpenseForm({
  isEditMode = false,
  reportDetail,
  reportId,
  onDeleteExpense,
  onUpdateSuccess,
}: ManualExpenseFormProps = {}) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [originalFiles, setOriginalFiles] = useState<string[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const reportName = isEditMode
    ? reportDetail?.reportTitle || ""
    : decodeURIComponent((searchParams.get("name") ?? "") as string);
  const reportDate = isEditMode
    ? new Date().toDateString()
    : decodeURIComponent(searchParams.get("date") ?? Date.now().toString());
  const { isOpen: IsSuccess, toggle: successToggle } = useModal();
  const router = useRouter();
  const axios = useAxios();
  const queryClient = useQueryClient();

  // Fetch expense categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await axios.get<CategoryApiResponse>(
          API_KEYS.EXPENSE.CATEGORIES,
        );
        console.log(response.data);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          toast.error("Failed to load expense categories");
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to load expense categories. Please try again.",
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [axios]);

  // Load receipt images from sessionStorage
  useEffect(() => {
    const storedImages = sessionStorage.getItem("uploadedReceipts");
    if (storedImages) {
      console.log({ storedImages });
      setFiles(JSON.parse(storedImages));
    }
  }, []);

  const defaultExpense = {
    title: "",
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
      expenses: [defaultExpense],
    },
  });

  // Load receipt images and initialize form fields
  useEffect(() => {
    if (isEditMode && reportDetail && reportDetail.expenses) {
      // Load existing expenses for edit mode
      const existingExpenses = reportDetail.expenses.map((expense: any) => ({
        title: expense.title || "",
        vendor: expense.merchantName || "",
        amount: parseFloat(expense.amount) || 0,
        transactionDate: new Date(expense.transactionDate),
        category: expense.categoryName || "",
        description: expense.description || "",
        receipt: expense.receiptUrl || "",
      }));

      // Load receipt images
      const receiptImages = reportDetail.expenses
        .map((expense: any) => expense.receiptUrl)
        .filter((url: string) => url);
      setFiles(receiptImages);
      setOriginalFiles([...receiptImages]); // Store original for change detection

      form.reset({ expenses: existingExpenses });
    } else {
      const storedImages = sessionStorage.getItem("uploadedReceipts");
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages);
        setFiles(parsedImages);
        setOriginalFiles([...parsedImages]);

        const initialExpenses = parsedImages.map(
          (receipt: string, index: number) => {
            return {
              ...defaultExpense,
              title: "",
              receipt,
            };
          },
        );

        if (initialExpenses.length > 0) {
          form.reset({ expenses: initialExpenses });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, reportDetail]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

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
      e.target.value = "";
    }
  };

  // Watch form values to trigger re-renders when form changes
  const watchedValues = form.watch();
  const formDirty = form.formState.isDirty;

  // Check if form has been modified from original state (for edit mode)
  const hasFormChanges = (() => {
    if (!isEditMode || !reportDetail) return true; // Always enabled for create mode

    // Check if files have changed
    const filesChanged =
      files.length !== originalFiles.length ||
      files.some((file, idx) => file !== originalFiles[idx]);

    // Check if expense count changed
    const expenseCountChanged =
      watchedValues.expenses?.length !== reportDetail.expenses.length;

    return formDirty || filesChanged || expenseCountChanged;
  })();

  const addExpense = () => {
    append({
      title: "",
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

  const handleRemoveOrDelete = (index: number) => {
    if (isEditMode && onDeleteExpense && reportDetail?.expenses?.[index]) {
      const expense = reportDetail.expenses[index];
      onDeleteExpense(expense.expenseId, expense.title);
    } else {
      removeExpense(index);
    }
  };

  // Helper to extract pure base64 string from data URL
  const extractBase64 = (dataUrl: string): string => {
    if (!dataUrl || typeof dataUrl !== "string") return "";

    // If it's already a pure base64 string (no data: prefix), return as-is
    if (!dataUrl.startsWith("data:")) {
      return dataUrl.trim();
    }

    // Remove data:image/...;base64, prefix if present
    const base64Match = dataUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
    if (base64Match && base64Match[1]) {
      return base64Match[1].trim();
    }

    // If it's a data URL but doesn't match the pattern, try to extract after comma
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex !== -1) {
      return dataUrl.substring(commaIndex + 1).trim();
    }

    // Fallback: return empty string if we can't parse it
    console.warn("Could not extract base64 from:", dataUrl.substring(0, 50));
    return "";
  };

  // Build payload for backend submission (reusable for both submit and draft)
  const buildExpensePayload = (
    data: ExpenseFormValues,
    includeReceipts: boolean,
    status: "draft" | "pending",
  ) => {
    // Validate all categories exist
    const invalidCategories = data.expenses.filter(
      (expense) => !categories.find((cat) => cat.name === expense.category),
    );

    if (invalidCategories.length > 0) {
      throw new Error(
        "Invalid category selected. Please ensure all expenses have valid categories.",
      );
    }

    // Build expenses array
    const expensesPayload = data.expenses.map((expense, idx) => {
      const category = categories.find((cat) => cat.name === expense.category);
      if (!category) {
        throw new Error(`Category not found: ${expense.category}`);
      }

      // Build base expense object
      const expenseObj: {
        title: string;
        merchantName: string;
        description: string;
        expenseCategoryId: string;
        amount: number;
        transactionDate: string;
        receiptImage?: string;
      } = {
        title: expense.title,
        merchantName: expense.vendor,
        description: expense.description || "",
        expenseCategoryId: category.categoryId,
        amount: Number(expense.amount),
        transactionDate: toISODateString(expense.transactionDate || new Date()),
      };

      // Only include receiptImage if it's a new base64 upload (starts with data:)
      if (includeReceipts) {
        const receiptSource = files[idx] || expense.receipt || "";
        if (receiptSource.startsWith("data:")) {
          const receiptImage = extractBase64(receiptSource);
          if (receiptImage && receiptImage.trim() !== "") {
            expenseObj.receiptImage = receiptImage;
          }
        }
      }

      return expenseObj;
    });

    return {
      reportTitle: reportName || "Expense Report",
      status,
      expenses: expensesPayload,
    };
  };

  // Build payload for PATCH /reports/{reportId} - updates entire report with all expenses
  const buildPatchReportPayload = (
    data: ExpenseFormValues,
    includeReceipts: boolean,
  ) => {
    // Validate all categories exist
    const invalidCategories = data.expenses.filter(
      (expense) => !categories.find((cat) => cat.name === expense.category),
    );

    if (invalidCategories.length > 0) {
      throw new Error(
        "Invalid category selected. Please ensure all expenses have valid categories.",
      );
    }

    // Build expenses array with all expenses (existing + new)
    const expensesPayload = data.expenses.map((expense, idx) => {
      const category = categories.find((cat) => cat.name === expense.category);
      if (!category) {
        throw new Error(`Category not found: ${expense.category}`);
      }

      // Build base expense object
      const expenseObj: {
        title: string;
        merchantName: string;
        description: string;
        expenseCategoryId: string;
        amount: number;
        transactionDate: string;
        receiptImage?: string;
        expenseId?: string;
      } = {
        title: expense.title,
        merchantName: expense.vendor,
        description: expense.description || "",
        expenseCategoryId: category.categoryId,
        amount: Number(expense.amount),
        transactionDate: toISODateString(expense.transactionDate || new Date()),
      };

      // Include expenseId for existing expenses (from reportDetail)
      if (isEditMode && reportDetail?.expenses?.[idx]) {
        expenseObj.expenseId = reportDetail.expenses[idx].expenseId;
      }

      // Only include receiptImage if it's a new base64 upload (starts with data:)
      if (includeReceipts) {
        const receiptSource = files[idx] || expense.receipt || "";
        if (receiptSource.startsWith("data:")) {
          const receiptImage = extractBase64(receiptSource);
          if (receiptImage && receiptImage.trim() !== "") {
            expenseObj.receiptImage = receiptImage;
          }
        }
      }

      return expenseObj;
    });

    return {
      reportTitle: reportName || reportDetail?.reportTitle || "Expense Report",
      expenses: expensesPayload,
    };
  };

  const persistToPersonalExpenses = (
    data: ExpenseFormValues,
    status: PersonalExpenseStatus,
  ) => {
    const existing = readPersonalExpenses();
    let nextId = getNextPersonalExpenseId(existing);

    // If multiple expenses submitted in a single session, group them
    if (data.expenses.length > 1) {
      const groupId = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalAmount = data.expenses.reduce(
        (sum, exp) => sum + Number(exp.amount),
        0,
      );

      // Create individual expense entries for detail view
      const individualExpenses: PersonalExpenseRow[] = data.expenses.map(
        (expense, idx) => {
          const receiptImage = files[idx] || expense.receipt || undefined;
          const expenseId = nextId++;

          // Store report name and date for this expense
          if (typeof window !== "undefined" && reportName && reportDate) {
            sessionStorage.setItem(
              `expense-report-name-${expenseId}`,
              reportName,
            );
            sessionStorage.setItem(
              `expense-report-date-${expenseId}`,
              reportDate,
            );
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
            title: expense.title,
            description: expense.description || undefined,
            groupId,
          };
        },
      );

      // Create a single grouped entry for the table
      const groupedEntry: PersonalExpenseRow = {
        id: nextId++,
        date: formatDateForTable(data.expenses[0].transactionDate), // Use first expense date
        vendor: "", // Not displayed in table
        category: data.expenses[0].category, // Use first expense category
        amount: totalAmount,
        hasReceipt: individualExpenses.some((e) => e.hasReceipt),
        status,
        reportName: reportName || undefined,
        groupId,
        isGrouped: true,
        groupedExpenses: individualExpenses,
        totalAmount,
      };

      // Store all individual expenses in sessionStorage for detail view
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `expense-group-${groupId}`,
          JSON.stringify(individualExpenses),
        );
        sessionStorage.setItem(
          `expense-report-name-${groupedEntry.id}`,
          reportName,
        );
        sessionStorage.setItem(
          `expense-report-date-${groupedEntry.id}`,
          reportDate,
        );
      }

      writePersonalExpenses([groupedEntry, ...existing]);
    } else {
      // Single expense or no report name - create individual entries
      const newRows: PersonalExpenseRow[] = data.expenses.map(
        (expense, idx) => {
          const receiptImage = files[idx] || expense.receipt || undefined;
          const expenseId = nextId++;

          // Store report name and date for this expense
          if (typeof window !== "undefined" && reportName && reportDate) {
            sessionStorage.setItem(
              `expense-report-name-${expenseId}`,
              reportName,
            );
            sessionStorage.setItem(
              `expense-report-date-${expenseId}`,
              reportDate,
            );
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
            title: expense.title,
            description: expense.description || undefined,
          };
        },
      );

      writePersonalExpenses([...newRows, ...existing]);
    }
  };

  const onSubmit = async (data: ExpenseFormValues) => {
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
        return Math.abs(totalSplitAmount - expense.amount) > 0.01;
      }
      return false;
    });

    if (invalidSplits) {
      toast.error("Total split amounts must equal the expense amount");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && reportId && reportDetail?.expenses) {
        // Use single PATCH /reports/{reportId} endpoint to update entire report
        const basePayload = buildPatchReportPayload(data, true);
        const reportPayload = {
          ...basePayload,
          status: "pending", // Explicitly set to pending on final submit
        };
        await axios.patch(`reports/${reportId}`, reportPayload);

        toast.success(
          `Your ${data.expenses.length} expense(s) have been updated and submitted successfully.`,
        );
        // Refetch report details if callback is provided
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        // Use POST for creating new expenses
        const payload = buildExpensePayload(data, true, "pending");
        await axios.post(API_KEYS.EXPENSE.REPORTS, payload);
        toast.success(
          `Your ${data.expenses.length} expense(s) have been submitted successfully.`,
        );
      }

      // Invalidate React Query cache to refetch personal expenses
      queryClient.invalidateQueries({
        queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES],
      });

      form.reset({
        expenses: [
          {
            title: "",
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
      const returnTab =
        sessionStorage.getItem("expensesReturnTab") || "personal-expenses";
      const returnPage = sessionStorage.getItem("expensesReturnPage") || "1";
      router.push(`/expenses?tab=${returnTab}&page=${returnPage}`);
    } catch (error: any) {
      console.error("Error submitting expenses:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit expenses. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare category options for FormFieldSelect
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.name,
  }));

  return (
    <>
      <SuccessModal
        isOpen={IsSuccess}
        onClose={() => {
          successToggle();
        }}
        onClick={() => {}}
        title="Expense Submitted"
        description="Your expense has been successfully submitted."
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
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl px-6 py-3 border border-primary/20 shadow-sm w-full flex items-center justify-between">
                <p className="text-base font-semibold text-foreground">
                  {reportName || "Expense Report"}
                </p>
                <p className="text-base font-semibold text-foreground">
                  {reportDate}
                </p>
              </div>

              {/* Loading state for categories */}
              {isLoadingCategories && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading expense categories...
                  </span>
                </div>
              )}

              {/* Dynamic Expense Forms */}
              {!isLoadingCategories && (
                <div className="space-y-6">
                  {/* If multiple expenses, render each section inside an accordion; otherwise render plain */}
                  {fields.length > 1 ? (
                    <Accordion
                      type="multiple"
                      defaultValue={["expense-0"]}
                      className="w-full"
                    >
                      {fields.map((field, index) => {
                        const amount = amounts[index] || 0;
                        return (
                          <AccordionItem
                            key={field.id}
                            value={`expense-${index}`}
                          >
                            <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-md text-left">
                              <div className="flex w-full justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">
                                    {form.getValues(
                                      `expenses.${index}.title`,
                                    ) || `Expense ${index + 1}`}
                                  </span>
                                  <span className="text-sm text-muted-foreground flex items-center gap-3">
                                    <span>
                                      {form.getValues(
                                        `expenses.${index}.vendor`,
                                      ) || "No vendor"}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      $
                                      {Number(
                                        form.getValues(
                                          `expenses.${index}.amount`,
                                        ) || 0,
                                      ).toLocaleString()}
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
                                      handleRemoveOrDelete(index);
                                    }}
                                  >
                                    <Trash className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="p-0 gap-8 relative flex items-start px-6 justify-between w-full">
                                <div className="space-y-5 max-w-lg flex flex-col pr-16">
                                  <SplitExpense
                                    control={form.control}
                                    expenseIndex={index}
                                    totalAmount={amount}
                                  />

                                  <FormFieldInput
                                    control={form.control}
                                    name={`expenses.${index}.title`}
                                    label="Expense Title"
                                    placeholder="Enter a title for this expense"
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
                                      values={categoryOptions}
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
                                  <div className="rounded-lg border border-border bg-white p-3 h-[420px] flex items-center justify-center relative">
                                    <input
                                      id={`receipt-input-${index}`}
                                      type="file"
                                      accept="image/*"
                                      aria-label={`Upload receipt for item ${index + 1}`}
                                      className="hidden"
                                      onChange={(e) => onReceiptSelect(index, e)}
                                    />
                                    {files[index] ? (
                                      <div className="w-full h-full flex flex-col items-center justify-center relative">
                                        <img
                                          src={files[index]}
                                          alt="Uploaded receipt"
                                          className="w-full h-full object-contain"
                                        />
                                        <Button
                                          type="button"
                                          variant="outlinePrimary"
                                          size="sm"
                                          className="mt-3"
                                          onClick={() => {
                                            document
                                              .getElementById(
                                                `receipt-input-${index}`,
                                              )
                                              ?.click();
                                          }}
                                        >
                                          Change Receipt
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground text-center px-6 space-y-3">
                                        <div className="text-muted-foreground font-medium">
                                          No receipt uploaded for this item.
                                        </div>
                                        <div className="text-muted-foreground">
                                          Receipt is required for final
                                          submission. You can save as draft
                                          without a receipt.
                                        </div>
                                        <Button
                                          type="button"
                                          variant="outlinePrimary"
                                          onClick={() => {
                                            document
                                              .getElementById(
                                                `receipt-input-${index}`,
                                              )
                                              ?.click();
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
                        <div
                          key={field.id}
                          className="p-0 gap-8 relative flex items-start px-6 justify-between w-full"
                        >
                          <div className="space-y-5 max-w-lg flex flex-col pr-16">
                            {fields.length > 1 && index != 0 && (
                              <div className="ml-auto w-fit flex">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-destructive/10"
                                  onClick={() => handleRemoveOrDelete(index)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}

                            <SplitExpense
                              control={form.control}
                              expenseIndex={index}
                              totalAmount={amount}
                            />

                            <FormFieldInput
                              control={form.control}
                              name={`expenses.${index}.title`}
                              label="Expense Title"
                              placeholder="Enter a title for this expense"
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
                                values={categoryOptions}
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
                            <div className="rounded-lg border border-border bg-white p-3 h-[420px] flex items-center justify-center relative">
                              <input
                                id={`receipt-input-${index}`}
                                type="file"
                                accept="image/*"
                                aria-label={`Upload receipt for item ${index + 1}`}
                                className="hidden"
                                onChange={(e) => onReceiptSelect(index, e)}
                              />
                              {files[index] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center relative">
                                  <img
                                    src={files[index]}
                                    alt="Uploaded receipt"
                                    className="w-full h-full object-contain"
                                  />
                                  <Button
                                    type="button"
                                    variant="outlinePrimary"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => {
                                      document
                                        .getElementById(
                                          `receipt-input-${index}`,
                                        )
                                        ?.click();
                                    }}
                                  >
                                    Change Receipt
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground text-center px-6 space-y-3">
                                  <div className="text-muted-foreground font-medium">
                                    No receipt uploaded for this item.
                                  </div>
                                  <div className="text-muted-foreground">
                                    Receipt is required for final submission.
                                    You can save as draft without a receipt.
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outlinePrimary"
                                    onClick={() => {
                                      document
                                        .getElementById(
                                          `receipt-input-${index}`,
                                        )
                                        ?.click();
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
              )}

              {/* Form Actions */}
              <div className="flex space-x-4 pt-10">
                <Button
                  type="submit"
                  size={"md"}
                  disabled={
                    !hasAllReceipts ||
                    isSubmitting ||
                    isLoadingCategories ||
                    (isEditMode && !hasFormChanges)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit{" "}
                      {fields.length > 1
                        ? `${fields.length} Expenses`
                        : "Expense"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outlinePrimary"
                  onClick={async () => {
                    const values = form.getValues();
                    // Trigger validation so required fields are respected.
                    form.handleSubmit(async (validData) => {
                      try {
                        setIsSubmitting(true);

                        if (
                          isEditMode &&
                          reportId &&
                          reportDetail?.expenses
                        ) {
                          const basePayload = buildPatchReportPayload(
                            validData as ExpenseFormValues,
                            true,
                          );
                          const reportPayload = {
                            ...basePayload,
                            status: "draft", // Explicitly keep as draft
                          };
                          await axios.patch(`reports/${reportId}`, reportPayload);
                          if (onUpdateSuccess) {
                            onUpdateSuccess();
                          }
                        } else {
                          const payload = buildExpensePayload(
                            validData as ExpenseFormValues,
                            true,
                            "draft",
                          );
                          await axios.post(API_KEYS.EXPENSE.REPORTS, payload);
                          persistToPersonalExpenses(
                            values as ExpenseFormValues,
                            "draft",
                          );
                        }

                        queryClient.invalidateQueries({
                          queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES],
                        });

                        toast.success("Saved as draft.");
                        sessionStorage.removeItem("uploadedReceipts");
                        const returnTab =
                          sessionStorage.getItem("expensesReturnTab") ||
                          "personal-expenses";
                        const returnPage =
                          sessionStorage.getItem("expensesReturnPage") || "1";
                        router.push(
                          `/expenses?tab=${returnTab}&page=${returnPage}`,
                        );
                      } catch (error: any) {
                        console.error("Error saving draft:", error);
                        const errorMessage =
                          error?.response?.data?.message ||
                          error?.response?.data?.error ||
                          error?.message ||
                          "Failed to save draft. Please try again.";
                        toast.error(errorMessage);
                      } finally {
                        setIsSubmitting(false);
                      }
                    })();
                  }}
                  size={"md"}
                  disabled={
                    isSubmitting ||
                    isLoadingCategories ||
                    (isEditMode && !hasFormChanges)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save As Draft"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </>
      </div>
    </>
  );
}