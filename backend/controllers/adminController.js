const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const AppError = require('../utils/appError');

const getDashboardStats = async (req, res, next) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        
        const avgOrderValue = totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0;

        // Recently added orders for dynamic feel
        const recentOrders = await Order.find()
            .populate('user')
            .sort('-createdAt')
            .limit(5);

        const stockAlerts = await Product.find({ stock: { $lte: 10 } })
            .sort('stock')
            .limit(3);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                revenueGrowth: 12.5,
                totalOrders,
                ordersGrowth: 8.2,
                totalCustomers,
                customersGrowth: 15.1,
                avgOrderValue,
                avgOrderValueGrowth: 2.4,
                recentOrders,
                stockAlerts
            }
        });
    } catch (error) {
        next(error);
    }
};


const getRevenueData = async (req, res, next) => {
    try {
        // Mock data for Recharts as requested
        const revenueData = [
            { month: 'Oct', revenue: 450000, orders: 120 },
            { month: 'Nov', revenue: 520000, orders: 145 },
            { month: 'Dec', revenue: 610000, orders: 190 },
            { month: 'Jan', revenue: 580000, orders: 170 },
            { month: 'Feb', revenue: 720000, orders: 210 },
            { month: 'Mar', revenue: 850000, orders: 240 },
            { month: 'Apr', revenue: 912450, orders: 265 },
        ];

        const categoryRevenue = [
            { name: 'Grains & Rice', value: 34 },
            { name: 'Oils & Fats', value: 22 },
            { name: 'Spices', value: 18 },
            { name: 'Dairy', value: 14 },
            { name: 'Beverages', value: 12 },
        ];

        res.status(200).json({
            success: true,
            data: {
                revenueHistory: revenueData,
                categoryDistribution: categoryRevenue
            }
        });
    } catch (error) {
        next(error);
    }
};

const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .sort('-createdAt');


        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        order.orderStatus = status;
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

const getAdminStock = async (req, res, next) => {
    try {
        const products = await Product.find()
            .sort('stock');

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

const updateProductStock = async (req, res, next) => {
    try {
        const { stock } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

const getAdminCustomers = async (req, res, next) => {
    try {
        const customers = await User.find({ role: 'customer' });
        
        // Enrich customer data with order totals
        const customersWithStats = await Promise.all(customers.map(async (customer) => {
            const orders = await Order.find({ user: customer._id });
            const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            const lastOrder = orders.length > 0 ? orders[orders.length - 1].createdAt : null;

            return {
                ...customer.toObject(),
                totalOrders: orders.length,
                totalSpent,
                lastOrderDate: lastOrder
            };
        }));

        res.status(200).json({
            success: true,
            data: customersWithStats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getRevenueData,
    getAdminOrders,
    updateOrderStatus,
    getAdminStock,
    updateProductStock,
    getAdminCustomers
};
