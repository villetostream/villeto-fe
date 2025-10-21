"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";

type UploadState = "idle" | "uploading" | "scanning" | "verified" | "failed";

export default function FileUpload({
  accept = { "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] },
  maxSize = 10 * 1024 * 1024,
  onUploaded,
  label,
  helper,
}: {
  accept?: any;
  maxSize?: number;
  onUploaded?: (meta: { name: string; s3Key?: string; text?: string }) => void;
  label?: string;
  helper?: string;
}) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      console.log
      if (!acceptedFiles || acceptedFiles.length === 0) {
        return;
      }

      const f = acceptedFiles[0];
      console.log(f.size, { maxSize })
      if (f.size > maxSize) {
        setError(`File too large. Maximum ${Math.round(maxSize / 1024 / 1024)} MB.`);
        setState("failed");
        return;
      }

      // Create preview URL for images
      if (f.type.startsWith('image/')) {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
      }

      setFile(f);
      setFilename(f.name);
      if (onUploaded) {

        onUploaded({ name: f.name });
      }

      try {

      } catch (e: any) {
        setState("failed");
        setError("Failed scanning document.");
      }
    },
    [maxSize, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setFilename(null);
    setPreviewUrl(null);
    setState("idle");
    setProgress(0);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base leading-[150%] font-semibold text-foreground">{label || "Upload File"}</div>
      </div>
      <div className="h-48">

        <div
          {...getRootProps()}
          className={`
              border-2 ${!file ? "border-dashed" : ""} rounded-lg overflow-hidden text-center cursor-pointer transition-all duration-200 ease-in-out h-full
              ${isDragActive
              ? isDragReject
                ? "border-red-400 bg-red-50"
                : "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }
              `}
        >
          <input {...getInputProps()} />
          {!file ? (

            <div className="flex flex-col items-center justify-center space-y-3 h-full">


              <p className="text-sm font-medium text-gray-700">
                {isDragActive
                  ? isDragReject
                    ? "File type not supported"
                    : "Drop the file here"
                  : "Drag & drop your file"}
              </p>
              <p className="text-xs text-gray-500">
                {helper || "PDF, JPG, PNG up to " + Math.round(maxSize / 1024 / 1024) + "MB"}
              </p>


            </div>
          ) : (
            <div className="">
              <div className="flex items-center space-x-3">
                {previewUrl && (
                  <div className="flex-shrink-0 size-full object-contain rounded border overflow-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain overflow-y-auto rounded"
                    />
                  </div>
                  // ) : (
                  // <div className="flex-shrink-0 text-2xl">
                  //   {getFileIcon(filename!)}
                  // </div>
                  // )}
                )}
                {/* <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {filename}
                    </p>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p> */}

                {/* Progress Bar */}
                {/* {state === "uploading" || state === "scanning" ? (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : state === "verified" ? (
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                    Verified
                  </div>
                ) : null} */}

                {/* Status Text */}
                {/* <p className="text-xs text-gray-500 mt-1">
                  {state === "uploading" && "Uploading..."}
                  {state === "scanning" && "Scanning document..."}
                  {state === "verified" && "Document ready"}
                </p> */}
                {/* </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Error Display */}
      {maxSize && (
        <div className="mt-2 flex items-center text-xs font-normal text-muted-foreground ">

          Max. {maxSize / 1024 / 1024}mb
        </div>
      )}
      {/* Error Display */}
      {error && (
        <div className="mt-2 flex items-center text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
          {error}
        </div>
      )}

      {/* Upload State Indicators */}
      {/* {state === "failed" && (
        <button
          onClick={removeFile}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Try again
        </button>
      )} */}
    </div>

  );
}