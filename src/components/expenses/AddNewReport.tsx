"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormFieldInput from "../form fields/formFieldInput";
import { Form } from "../ui/form";
import { useRouter } from "next/navigation";

// Zod schema for form validation
const reportSchema = z.object({
  reportName: z
    .string()
    .min(1, "Report name is required")
    .max(100, "Report name is too long"),
});

type ReportFormData = z.infer<typeof reportSchema>;

const AddNewReport = ({
  isOpen,
  close,
  toggle,
}: {
  isOpen: boolean;
  close: () => void;
  toggle: (open: boolean) => void;
}) => {
  const router = useRouter();

  // Get preserved values from sessionStorage
  const getPreservedValues = () => {
    if (typeof window === "undefined")
      return { reportName: "" };
    const reportName = sessionStorage.getItem("pendingReportName") || "";
    return { reportName };
  };

  // Initialize react-hook-form with zod resolver
  const formHook = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: "onChange",
    defaultValues: {
      reportName: "",
    },
  });

  // Restore values when modal opens
  React.useEffect(() => {
    if (isOpen) {
      formHook.reset();
      const { reportName } = getPreservedValues();
      if (reportName) {
        formHook.setValue("reportName", reportName);
      }
      // Clear sessionStorage after restoring
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pendingReportName");
        sessionStorage.removeItem("pendingReportDate");
      }
    }
  }, [isOpen]);
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    control,
  } = formHook;

  const onSubmit = (data: ReportFormData) => {
    // Ensure a brand-new report starts with a clean receipt state.
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("uploadedReceipts");
    }
    router.push(
      `/expenses/new-expense/upload?name=${encodeURIComponent(
        data.reportName,
      )}&date=${encodeURIComponent(new Date().toDateString())}`,
    );
    close();
    reset();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => (open ? toggle(true) : close())}
      >
        <DialogContent className="sm:max-w-[560px] rounded-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold text-dashboard-text-primary">
              Add New Report
            </DialogTitle>
            <DialogDescription className="text-dashboard-text-secondary">
              Kindly enter the following information to continue
            </DialogDescription>
          </DialogHeader>
          <Form {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormFieldInput
                  label="Name of Report"
                  name="reportName"
                  placeholder="Enter name of report"
                  control={control}
                />
              </div>

              <Button
                size={"md"}
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-fit min-w-40 bg-[#7FE3DB] hover:bg-[#7FE3DB]/90 text-[#344054]"
              >
                {isSubmitting ? "Processing..." : "Proceed"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewReport;
