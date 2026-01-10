"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Path } from "react-hook-form";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface FormFieldLogoUploadProps<T extends Record<string, any>> {
  control: any;
  name: Path<T>;
  label: string;
  description?: string;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

interface LogoUploadContentProps {
  value: File | string | undefined;
  onChange: (value: File | undefined) => void;
  maxSize: number;
  accept: Record<string, string[]>;
}

const LogoUploadContent: React.FC<LogoUploadContentProps> = ({
  value,
  onChange,
  maxSize,
  accept,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    } else if (typeof value === "string" && value) {
      return value;
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);

  // Sync preview with field value
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string" && value) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(
            `File too large. Maximum ${Math.round(maxSize / 1024 / 1024)} MB.`
          );
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError(
            "Please upload a valid image file (PNG, JPG, JPEG, SVG, WEBP)."
          );
        } else {
          setError("File upload failed. Please try again.");
        }
        return;
      }

      if (!acceptedFiles || acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];
      onChange(file);
    },
    [maxSize, onChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onChange(undefined);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg overflow-hidden text-center cursor-pointer transition-all duration-200 ease-in-out",
          isDragActive
            ? isDragReject
              ? "border-destructive bg-destructive/5"
              : "border-primary bg-primary/5"
            : "border-input bg-background hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input ref={inputRef} {...getInputProps()} />
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center space-y-3 p-8 min-h-[200px]">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {isDragActive
                  ? isDragReject
                    ? "File type not supported"
                    : "Drop the logo here"
                  : "Drag & drop your business logo"}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, JPEG, SVG, WEBP up to{" "}
                {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[200px]">
            <div className="relative w-13 h-13 bg-muted rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Business logo preview"
                className="w-full h-full object-contain place-self-center"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Change Logo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          <span className="w-2 h-2 bg-destructive rounded-full mr-2"></span>
          {error}
        </div>
      )}
    </div>
  );
};

const FormFieldLogoUpload = <T extends Record<string, any>>({
  control,
  name,
  label,
  description,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] },
}: FormFieldLogoUploadProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <LogoUploadContent
              value={field.value}
              onChange={field.onChange}
              maxSize={maxSize}
              accept={accept}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldLogoUpload;
