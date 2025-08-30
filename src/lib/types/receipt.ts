// types/receipt.ts
export interface ReceiptData {
    total: number | null;
    date: string | null;
    merchant: string | null;
    items: ReceiptItem[];
    tax: number | null;
}

export interface ReceiptItem {
    description: string;
    amount: number;
}

export interface ProcessingOptions {
    languages: string[];
    compressImage: boolean;
    autoDetectFields: boolean;
}

export interface ScanResult {
    id: number;
    fileName: string;
    text: string;
    extractedData: ReceiptData;
    image: string;
    error?: string;
}

export interface FileWithPreview extends File {
    preview: string;
}