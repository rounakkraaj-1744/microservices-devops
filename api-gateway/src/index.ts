import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

app.use(cors());
app.use(limiter);
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

const proxyOptions = {
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1': '',
    },
    onError: (err: any, req: any, res: any) => {
        console.error('Proxy Error:', err);
        res.status(502).json({ error: 'Service Unavailable' });
    }
};

app.use('/auth', createProxyMiddleware({
    ...proxyOptions,
    target: process.env.USER_SERVICE_URL || 'http://localhost:4003'
}));

app.use('/products', authMiddleware, createProxyMiddleware({
    ...proxyOptions,
    target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:4002'
}));

app.use('/orders', authMiddleware, createProxyMiddleware({
    ...proxyOptions,
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:4001'
}));

app.get('/health', (req, res) => {
    res.json({
        status: 'API Gateway is operational',
        timestamp: new Date().toISOString(),
        services: {
            user_service: process.env.USER_SERVICE_URL,
            product_service: process.env.PRODUCT_SERVICE_URL,
            order_service: process.env.ORDER_SERVICE_URL
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
    console.log(`- Auth Service: ${process.env.USER_SERVICE_URL}`);
    console.log(`- Product Service: ${process.env.PRODUCT_SERVICE_URL}`);
    console.log(`- Order Service: ${process.env.ORDER_SERVICE_URL}`);
});