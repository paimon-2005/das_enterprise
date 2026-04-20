const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./createAdmin');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', // Vite frontend
    credentials: true
}));
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Routes
app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const areaRoutes = require('./routes/areaRoutes');
const dealerRoutes = require('./routes/dealerRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/areas', areaRoutes);
app.use('/api/v1/dealers', dealerRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// Seed admin and start server
const PORT = process.env.PORT || 5000;

createDefaultAdmin().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
});
