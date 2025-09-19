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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      if (!acceptedFiles || acceptedFiles.length === 0) {
        return;
      }
      const f = acceptedFiles[0];
      if (f.size > maxSize) {
        setError("File too large. Maximum 10 MB.");
        setState("failed");
        return;
      }
      setFilename(f.name);
      setState("uploading");
      setProgress(20);
      try {
        // Simulate upload (replace with presigned S3 upload in prod)
        await new Promise((r) => setTimeout(r, 700));
        setProgress(60);
        setState("scanning");
        // Try OCR with tesseract for images and PDFs (PDF uses tesseract fallback)
        let extractedText = "";
        if (f.type.startsWith("image/")) {
          const arrayBuffer = await f.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const { data } = await Tesseract.recognize(uint8Array as any, "eng", {
            logger: (m) => {
              if (m.status === "recognizing text" && m.progress) {
                setProgress(60 + Math.floor(m.progress * 30));
              }
            },
          });
          extractedText = data.text;
        } else {
          // For PDF we skip heavy OCR in this demo; set as scanned with empty text
          extractedText = "";
          setProgress(90);
        }
        // Simulate server verify
        await new Promise((r) => setTimeout(r, 500));
        setState("verified");
        setProgress(100);
        onUploaded?.({ name: f.name, s3Key: `uploads/mock/${Date.now()}_${f.name}`, text: extractedText });
      } catch (e: any) {
        setState("failed");
        setError("Failed scanning document.");
      }
    },
    [maxSize, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        {helper && <div className="text-xs text-gray-500">{helper}</div>}
      </div>

      <div {...getRootProps()} className="border-dashed border-2 border-gray-300 rounded p-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        <div>
          {isDragActive ? <p>Drop the file here ...</p> : <p>Click or drag file to upload (PDF, JPG, PNG). Max 10MB</p>}
          {filename && <p className="text-xs mt-2">Selected: {filename}</p>}
          <div className="mt-3 h-2 bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-gray-600">State: {state}</div>
          {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
}
