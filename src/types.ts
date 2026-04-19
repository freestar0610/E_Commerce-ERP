/**
 * NexCommerce ERP System Types
 */

export type OrderStatus = 'PENDING_COLLECTION' | 'COLLECTED' | 'ORDERED' | 'INVOICE_UPLOADED';

export interface MarketAccount {
  id: string;
  type: 'COUPANG' | 'SMART_STORE';
  name: string;
  connected: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  excelFormId: string; // Mapping to specific supplier excel formats
}

export interface Product {
  id: string;
  marketSku: string;
  internalCode: string;
  name: string;
  supplierId: string;
  price: number;
}

export interface ProductMapping {
  id: string;
  marketProductId: string;
  marketOptionId: string;
  internalProductId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  marketType: 'COUPANG' | 'SMART_STORE';
  productName: string;
  quantity: number;
  buyerName: string;
  buyerPhone: string;
  address: string;
  orderDate: string;
  status: OrderStatus;
  supplierId?: string;
  invoiceNumber?: string;
  shippingCarrier?: string;
}

export interface CSMessage {
  id: string;
  marketType: 'COUPANG' | 'SMART_STORE';
  orderNumber?: string;
  type: 'INQUIRY' | 'CANCEL' | 'RETURN';
  content: string;
  createdAt: string;
  isReplied: boolean;
}

export interface DashboardStats {
  todayOrders: number;
  collectedCount: number;
  orderedCount: number;
  invoicedCount: number;
  csPendingCount: number;
}
