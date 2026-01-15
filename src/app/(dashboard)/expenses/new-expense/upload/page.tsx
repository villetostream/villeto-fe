"use client";

import { useState, useCallback, useEffect } from "react";
import { ImagePlus, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  ImageUpload01FreeIcons,
  ImageUpload01Icon,
  ImageUploadIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { fi } from "date-fns/locale";
import { toast } from "sonner";

// Simulated OCR data - in real app this would come from an OCR service
const simulateOCR = (fileName: string): Promise<OCRData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate extracted data based on "receipt" content
      resolve({
        vendor: "StarBucks Coffee",
        amount: 45.99,
        transactionDate: new Date().toISOString(),
        category: "Meals & Entertainment",
        description: `Receipt from ${fileName}`,
      });
    }, 1500);
  });
};

interface OCRData {
  vendor: string;
  amount: number;
  transactionDate: string;
  category: string;
  description: string;
}

export default function UploadReceipt() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const reportName = searchParams.get("name") || "";
  const reportDate = searchParams.get("date") || "";

  // Always start this page clean for a new upload attempt.
  useEffect(() => {
    sessionStorage.removeItem("uploadedReceipts");
    setFiles([]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith("image/")
      );

      if (selectedFiles.length > 0) {
        setFiles((prev) => [...prev, ...selectedFiles]);
      }
    },
    []
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProceed = async () => {
    if (files.length == 0) {
      document.getElementById("file-input")?.click();
      toast.warning("upload a receipt");
      return;
    }
    setIsProcessing(true);

    try {
      let ocrData: OCRData[] = [];
      let receiptImages: string[] = [];

      if (files.length > 0) {
        // Simulate OCR for each file
        ocrData = await Promise.all(
          files.map((file) => simulateOCR(file.name))
        );

        // Convert files to base64 for storage
        receiptImages = await Promise.all(
          files.map((file) => fileToBase64(file))
        );

        // Store images in sessionStorage
        sessionStorage.setItem(
          "uploadedReceipts",
          JSON.stringify(receiptImages)
        );
      }

      // Navigate to expense form with OCR data
      const params = new URLSearchParams({
        name: reportName,
        date: reportDate,
        ...(ocrData.length > 0 && { ocr: JSON.stringify(ocrData) }),
      });

      router.push(`/expenses/new-expense?${params.toString()}`);
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    const params = new URLSearchParams({
      name: reportName,
      date: reportDate,
    });
    router.push(`/expenses/new-expense?${params.toString()}`);
  };

  return (
    <>
      <div className="flex gap-4 pb-4 border-b border-border mb-12">
        <div>
          <Label className="text-base leading-[125%] font-medium text-foreground mb-1.5 block">
            Name of Report
          </Label>
          <p className="text-foreground text-xs font-medium leading-[125%]">
            {reportName}
          </p>
        </div>
        <div>
          <Label className="text-base leading-[125%] font-medium text-foreground mb-1.5 block">
            Report Date
          </Label>
          <p className="text-foreground text-xs font-medium leading-[125%]">
            {reportDate}
          </p>
        </div>
      </div>
      <div className="space-y-5 w-3/4 mx-auto">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            files.length > 0 && "border-solid border-primary/30 bg-primary/5"
          )}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            aria-label="Upload receipt images"
            className="hidden"
            onChange={handleFileSelect}
          />

          {files.length === 0 ? (
            <>
              <div className="mx-auto w-16 h-16 rounded-full  flex items-center justify-center mb-4">
                <HugeiconsIcon
                  icon={ImageUpload01Icon}
                  className="w-8 h-8 text-muted-foreground"
                />
              </div>
              <p className="text-muted-foreground font-normal text-base">
                Have more than one receipt? Drop them here or tap to upload.
              </p>
            </>
          ) : (
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-card p-3 rounded-lg border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <p className="text-sm text-muted-foreground pt-2">
                Click or drop to add more receipts
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleProceed}
            disabled={isProcessing}
            className="min-w-[200px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : files.length > 0 ? (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Continue with {files.length} Receipt
                {files.length > 1 ? "s" : ""}
              </>
            ) : (
              "Upload Receipt"
            )}
          </Button>

          {files.length === 0 && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip, enter manually
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
