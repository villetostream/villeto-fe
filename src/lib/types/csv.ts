export interface ProcessingOptions {
    hasHeaders: boolean;
    delimiter: string;
    skipEmptyLines: boolean;
}

export interface CSVFileData {
    id: string;
    fileName: string;
    headers: string[];
    rows: any[];
    rowCount: number;
    processedAt: Date;
}