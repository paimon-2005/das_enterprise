const Area = require('../models/Area');
const Dealer = require('../models/Dealer');
const Order = require('../models/Order');
const AppError = require('../utils/appError');

// @desc    Create new delivery area
// @route   POST /api/v1/areas
// @access  Private/Admin
exports.createArea = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const areaExists = await Area.findOne({ name });
        if (areaExists) {
            return next(new AppError('Area already exists', 400));
        }

        const area = await Area.create({
            name,
            description,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: area,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all areas with summary stats
// @route   GET /api/v1/areas
// @access  Public/Private
exports.getAllAreas = async (req, res, next) => {
    try {
        const areas = await Area.find();

        const areasWithStats = await Promise.all(
            areas.map(async (area) => {
                const totalShops = await Dealer.countDocuments({ area: area._id });
                const orders = await Order.find({ area: area._id });
                
                const totalOrders = orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

                return {
                    ...area.toObject(),
                    totalShops,
                    totalOrders,
                    totalRevenue,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: areasWithStats,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update area
// @route   PUT /api/v1/areas/:id
// @access  Private/Admin
exports.updateArea = async (req, res, next) => {
    try {
        const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!area) {
            return next(new AppError('Area not found', 404));
        }

        res.status(200).json({
            success: true,
            data: area,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete area
// @route   DELETE /api/v1/areas/:id
// @access  Private/Admin
exports.deleteArea = async (req, res, next) => {
    try {
        const shopCount = await Dealer.countDocuments({ area: req.params.id });
        if (shopCount > 0) {
            return next(new AppError('Cannot delete area with active shops', 400));
        }

        const area = await Area.findByIdAndDelete(req.params.id);
        if (!area) {
            return next(new AppError('Area not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Area deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get detailed stats for one area
// @route   GET /api/v1/areas/:id/stats
// @access  Private/Admin
exports.getAreaStats = async (req, res, next) => {
    try {
        const area = await Area.findById(req.params.id);
        if (!area) {
            return next(new AppError('Area not found', 404));
        }

        const shops = await Dealer.find({ area: area._id });
        const orders = await Order.find({ area: area._id }).sort('-createdAt');

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

        // Shop stats
        const shopsWithStats = await Promise.all(
            shops.map(async (shop) => {
                const shopOrders = orders.filter(o => o.user.toString() === shop._id.toString());
                return {
                    ...shop.toObject(),
                    ordersCount: shopOrders.length,
                    totalSpent: shopOrders.reduce((sum, o) => sum + o.totalPrice, 0),
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                areaName: area.name,
                totalShops: shops.length,
                totalOrders,
                totalRevenue,
                pendingOrders,
                shops: shopsWithStats,
                recentOrders: orders.slice(0, 20),
            },
        });
    } catch (error) {
        next(error);
    }
};
