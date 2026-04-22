const Area = require('../models/Area');
const User = require('../models/User');
const Order = require('../models/Order');
const AppError = require('../utils/appError');

exports.createArea = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const areaExists = await Area.findOne({ name });
        if (areaExists) return next(new AppError('Area already exists', 400));

        const area = await Area.create({
            name,
            description,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            area
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllAreas = async (req, res, next) => {
    try {
        // Hardcoded static areas — no more DB management
        const staticAreas = [
            { name: 'Mogra', description: 'Mogra local region' },
            { name: 'Jirat', description: 'Jirat and surrounding zones' },
            { name: 'Kuntighat', description: 'Kuntighat area' }
        ];
        
        // Calculate stats for each static area
        const areasWithStats = await Promise.all(staticAreas.map(async (area) => {
            const shopCount = await User.countDocuments({ role: 'dealer', area: area.name });
            const ordersResult = await Order.aggregate([
                { $match: { area: area.name, orderStatus: { $ne: 'cancelled' } } },
                { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
            ]);

            return {
                _id: area.name, // Use name as ID for keys
                ...area,
                shopCount,
                totalRevenue: ordersResult.length > 0 ? ordersResult[0].totalRevenue : 0
            };
        }));

        res.status(200).json({
            success: true,
            areas: areasWithStats
        });
    } catch (error) {
        next(error);
    }
};

exports.getAreaStats = async (req, res, next) => {
    return next(new AppError('Static area management enabled. Custom stats disabled.', 400));
};

exports.updateArea = async (req, res, next) => {
    return next(new AppError('Areas are now static and cannot be modified.', 403));
};

exports.deleteArea = async (req, res, next) => {
    return next(new AppError('Areas are now static and cannot be deleted.', 403));
};

