import * as XLSX from 'xlsx';
import path from 'path';

export interface InvoiceData {
  orderNumber: string;
  trackingNumber: string;
  shippingCarrier: string;
}

/**
 * Parses the uploaded Excel file from the supplier.
 * Assumes a standard format where:
 * Column A: Order Number (주문번호)
 * Column B: Tracking Number (송장번호)
 * Column C: Carrier (택배사)
 */
export function parseInvoiceExcel(buffer: Buffer): InvoiceData[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to JSON array
  // We skip the header row (header: 1 means array of arrays)
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  const data: InvoiceData[] = [];
  
  // Start from index 1 to skip header
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row && row.length >= 2) {
      data.push({
        orderNumber: String(row[0] || '').trim(),
        trackingNumber: String(row[1] || '').trim(),
        shippingCarrier: String(row[2] || 'CJ대한통운').trim()
      });
    }
  }
  
  return data.filter(item => item.orderNumber && item.trackingNumber);
}
