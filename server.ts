import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import { parseInvoiceExcel } from './src/services/excelService.ts';
import { marketService } from './src/services/marketService.ts';
import dotenv from 'dotenv';

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Handle Excel Upload and Parsing
  app.post('/api/invoices/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const results = parseInvoiceExcel(req.file.buffer);
      
      // In a real app, you would match these with your DB records here
      // and maybe return the matches to the frontend for confirmation.
      
      res.json({ 
        success: true, 
        count: results.length,
        data: results 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Bulk Register Invoices to Market (Mocked for safety if keys missing)
  app.post('/api/market/bulk-register', async (req, res) => {
    const { platform, orders } = req.body; // platform: '쿠팡' | '스마트스토어' | '토스'

    console.log(`[Market Register] Platform: ${platform}, Orders Count: ${orders?.length}`);

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid orders data' });
    }

    const results = [];
    for (const order of orders) {
      try {
        // Only attempt if keys are present, otherwise mock success for UI demo
        if (process.env.COUPANG_ACCESS_KEY) {
          const apiRes = await marketService.uploadCoupangInvoice(order.orderId, order.invoiceNo, order.carrierCode);
          results.push({ orderId: order.orderId, success: true, apiResponse: apiRes });
        } else {
          results.push({ orderId: order.orderId, success: true, message: 'Mock Success (Keys Missing)' });
        }
      } catch (err: any) {
        results.push({ orderId: order.orderId, success: false, error: err.message });
      }
    }

    res.json({ results });
  });

  // API Route: Fetch Market Orders (Proxy)
  app.get('/api/market/orders', async (req, res) => {
    try {
      if (process.env.COUPANG_ACCESS_KEY) {
        const orders = await marketService.fetchCoupangOrders();
        res.json(orders);
      } else {
        // Return dummy data if no keys
        res.json({ 
          data: [
            { orderId: '20240417-1011', productName: '[Demo] 연어 1kg', status: 'ACCEPT' },
            { orderId: '20240417-1012', productName: '[Demo] 대하 2kg', status: 'ACCEPT' }
          ] 
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexCommerce Server running on http://localhost:${PORT}`);
  });
}

startServer();
