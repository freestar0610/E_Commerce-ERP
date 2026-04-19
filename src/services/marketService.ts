import axios from 'axios';
import crypto from 'crypto';

/**
 * Service to handle integrations with Coupang and Smart Store APIs.
 */
export class MarketService {
  private coupangVendorId = process.env.COUPANG_VENDOR_ID;
  private coupangAccessKey = process.env.COUPANG_ACCESS_KEY;
  private coupangSecretKey = process.env.COUPANG_SECRET_KEY;

  /**
   * Generates Coupang API Authorization Header
   */
  private getCoupangAuthHeader(method: string, path: string): string {
    if (!this.coupangAccessKey || !this.coupangSecretKey) {
      throw new Error('Coupang credentials are not configured');
    }

    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '').substring(0, 15) + 'Z';
    const algorithm = 'HmacSHA256';
    const message = timestamp + method + path;
    const signature = crypto.createHmac('sha256', this.coupangSecretKey).update(message).digest('hex');

    return `CEA algorithm=${algorithm}, access-key=${this.coupangAccessKey}, signed-date=${timestamp}, signature=${signature}`;
  }

  /**
   * Register invoice number to Coupang
   * API Ref: POST /v2/providers/openapi/apis/api/v4/vendors/{vendorId}/ordersheets/deliveries
   */
  async uploadCoupangInvoice(orderId: string, invoiceNo: string, deliveryCompanyCode: string) {
    if (!this.coupangVendorId) throw new Error('Coupang Vendor ID missing');

    const path = `/v2/providers/openapi/apis/api/v4/vendors/${this.coupangVendorId}/ordersheets/deliveries`;
    const host = 'https://api-gateway.coupang.com';
    const url = host + path;

    const body = {
      orderSheetId: orderId,
      invoiceNumber: invoiceNo,
      deliveryCompanyCode: deliveryCompanyCode, // e.g., CJGLS, HANJIN
      vendorId: this.coupangVendorId
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getCoupangAuthHeader('POST', path)
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Coupang API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetch Orders from Coupang
   */
  async fetchCoupangOrders(status: 'ACCEPT' | 'INSTRUCT' | 'DEPART' = 'ACCEPT') {
    if (!this.coupangVendorId) throw new Error('Coupang Vendor ID missing');

    const path = `/v2/providers/openapi/apis/api/v4/vendors/${this.coupangVendorId}/ordersheets`;
    const host = 'https://api-gateway.coupang.com';
    // Simplified query for demo
    const url = `${host}${path}?status=${status}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.getCoupangAuthHeader('GET', path)
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Coupang Fetch Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const marketService = new MarketService();
