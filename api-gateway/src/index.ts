import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Proxy routes
app.use('/auth', createProxyMiddleware({ 
  target: process.env.USER_SERVICE_URL || 'http://localhost:4003', 
  changeOrigin: true 
}));

app.use('/products', createProxyMiddleware({ 
  target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:4002', 
  changeOrigin: true 
}));

app.use('/orders', createProxyMiddleware({ 
  target: process.env.ORDER_SERVICE_URL || 'http://localhost:4001', 
  changeOrigin: true 
}));

app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is healthy' });
});

app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
});
