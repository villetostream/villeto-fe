// components/ReceiptDataExtractor.ts
import { ReceiptData } from '@/lib/types/receipt';

const ReceiptDataExtractor = (text: string): ReceiptData => {
  const extractedData: ReceiptData = {
    total: null,
    date: null,
    merchant: null,
    items: [],
    tax: null
  };

  // Common patterns for receipt data
  const patterns = {
    total: /(total|amount due|balance|amnt|ttl|sum)\s*[:$]?\s*([0-9]+\.[0-9]{2})/gi,
    date: /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/gi,
    tax: /(tax|gst|hst|vat|tps|tvq)\s*[:$]?\s*([0-9]+\.[0-9]{2})/gi,
    merchant: /^(.*?)(?=\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
  };

  // Extract total
  const totalMatches = text.match(patterns.total);
  if (totalMatches) {
    const lastTotalMatch = totalMatches[totalMatches.length - 1];
    const amountMatch = lastTotalMatch.match(/([0-9]+\.[0-9]{2})/);
    if (amountMatch) {
      extractedData.total = parseFloat(amountMatch[1]);
    }
  }

  // Extract date
  const dateMatches = text.match(patterns.date);
  if (dateMatches) {
    extractedData.date = dateMatches[0];
  }

  // Extract tax
  const taxMatches = text.match(patterns.tax);
  if (taxMatches) {
    const taxMatch = taxMatches[taxMatches.length - 1].match(/([0-9]+\.[0-9]{2})/);
    if (taxMatch) {
      extractedData.tax = parseFloat(taxMatch[1]);
    }
  }

  // Extract merchant name (simplified approach)
  const lines = text.split('\n');
  if (lines.length > 0) {
    // First non-empty line is often the merchant name
    const firstLine = lines.find(line => line.trim().length > 0);
    if (firstLine) {
      extractedData.merchant = firstLine.trim();
    }
  }

  // Extract line items (simplified approach)
  lines.forEach(line => {
    const itemMatch = line.match(/(.*?)\s+([0-9]+\.[0-9]{2})$/);
    if (itemMatch && !line.match(/(total|tax|subtotal|change)/i)) {
      extractedData.items.push({
        description: itemMatch[1].trim(),
        amount: parseFloat(itemMatch[2])
      });
    }
  });

  return extractedData;
};

export default ReceiptDataExtractor;