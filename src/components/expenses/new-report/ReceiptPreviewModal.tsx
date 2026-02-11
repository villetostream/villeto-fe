"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptImage: string;
  onChangeReceipt: (newReceipt: string) => void;
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  receiptImage,
  onChangeReceipt,
}: ReceiptPreviewModalProps) {
  const [isChanging, setIsChanging] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setIsChanging(true);
    try {
      const base64 = await fileToBase64(file);
      onChangeReceipt(base64);
    } catch (error) {
      console.error("Error converting file:", error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] sm:rounded-2xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Receipt Image */}
          <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
            {receiptImage ? (
              <img
                src={receiptImage}
                alt="Receipt"
                className="w-full h-auto max-h-[500px] object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <ImagePlus className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <input
              id="receipt-change-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() =>
                document.getElementById("receipt-change-input")?.click()
              }
              disabled={isChanging}
            >
              {isChanging ? "Changing..." : "Change Receipt"}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
