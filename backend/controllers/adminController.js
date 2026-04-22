const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const AppError = require('../utils/appError');

exports.getDashboardStats = async (req, res, next) => {
    try {
        // Total Revenue from all orders
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Total Orders count
        const totalOrders = await Order.countDocuments();

        // Total Shops (Dealers)
        const totalShops = await User.countDocuments({ role: 'dealer' });

        // Pending Orders
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });

        // Total Dues from all dealers
        const duesResult = await User.aggregate([
            { $match: { role: 'dealer' } },
            { $group: { _id: null, total: { $sum: '$currentDue' } } }
        ]);
        const totalDues = duesResult.length > 0 ? duesResult[0].total : 0;

        // Low Stock Products (<= 10)
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

        res.status(200).json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                totalShops,
                pendingOrders,
                totalDues,
                lowStockProducts
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllShops = async (req, res, next) => {
    try {
        const { area, paymentTerm, isActive } = req.query;
        let query = { role: 'dealer' };

        if (area) query.area = area;
        if (paymentTerm) query.paymentTerm = paymentTerm;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const shops = await User.find(query).sort('-createdAt');

        // Add additional stats for each shop
        const shopsWithStats = await Promise.all(shops.map(async (shop) => {
            const orderStats = await Order.aggregate([
                { $match: { dealer: shop._id } },
                { $group: { _id: null, count: { $sum: 1 }, totalSpent: { $sum: '$totalPrice' } } }
            ]);

            return {
                ...shop.toObject(),
                orderCount: orderStats.length > 0 ? orderStats[0].count : 0,
                totalSpent: orderStats.length > 0 ? orderStats[0].totalSpent : 0
            };
        }));

        res.status(200).json({
            success: true,
            count: shopsWithStats.length,
            shops: shopsWithStats
        });
    } catch (error) {
        next(error);
    }
};

exports.updateShopCredit = async (req, res, next) => {
    try {
        const { creditLimit, paymentTerm, isActive } = req.body;
        const shop = await User.findById(req.params.id);

        if (!shop || shop.role !== 'dealer') {
            return next(new AppError('Shop not found', 404));
        }

        if (creditLimit !== undefined) shop.creditLimit = creditLimit;
        if (paymentTerm) shop.paymentTerm = paymentTerm;
        if (isActive !== undefined) shop.isActive = isActive;

        await shop.save();

        res.status(200).json({
            success: true,
            shop
        });
    } catch (error) {
        next(error);
    }
};
