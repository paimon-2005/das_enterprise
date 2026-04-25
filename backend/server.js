const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./createAdmin');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();


// Initialize express
const app = express();

// 11. Disable x-powered-by
app.disable('x-powered-by');

// 1. Helmet (Security headers)
app.use(helmet({
    contentSecurityPolicy: false
}));

// 12. Manual Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// 2. CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'development' ? true : process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));

// 10. Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// 3. Global Rate Limiting (100 requests / 15 min)
const globalLimiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes'
});
app.use('/api', globalLimiter);

// 4. Login Rate Limiting (5 attempts / 15 min)
const loginLimiter = rateLimit({
    max: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Too many login attempts, please try again in 15 minutes'
});
app.use('/api/v1/auth/login', loginLimiter);

// 5. Register Rate Limiting (10 attempts / hour)
const registerLimiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many registration attempts, please try again in an hour'
});
app.use('/api/v1/auth/register', registerLimiter);

// 6. Body parser
app.use(express.json({ limit: '10kb' }));

// Routes
app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const areaRoutes = require('./routes/areaRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/areas', areaRoutes);

// 404 handler
app.use((req, res, next) => {
    const AppError = require('./utils/appError');
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handling Middleware
app.use(errorHandler);

// Seed admin and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await createDefaultAdmin();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            if (process.env.NODE_ENV === 'development') {
                console.log(`📡 Accessible on your network at: http://YOUR_IP:${PORT}`);
            }
        });
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
