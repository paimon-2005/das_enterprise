const Dealer = require('../models/Dealer');
const Order = require('../models/Order');
const AppError = require('../utils/appError');

// @desc    Get all dealers with filters and stats
// @route   GET /api/v1/dealers
// @access  Private/Admin
exports.getAllDealers = async (req, res, next) => {
    try {
        const { area, isApproved, paymentTerm, search } = req.query;
        let query = {};

        if (area) query.area = area;
        if (isApproved !== undefined) query.isApproved = isApproved === 'true';
        if (paymentTerm) query.paymentTerm = paymentTerm;
        if (search) {
            query.$or = [
                { shopName: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } }
            ];
        }

        const dealers = await Dealer.find(query);

        const dealersWithStats = await Promise.all(
            dealers.map(async (dealer) => {
                const orders = await Order.find({ user: dealer._id });
                return {
                    ...dealer.toObject(),
                    totalOrders: orders.length,
                    totalSpent: orders.reduce((sum, o) => sum + o.totalPrice, 0),
                };
            })
        );

        // Global stats for the page
        const allDealers = await Dealer.find();
        const stats = {
            total: allDealers.length,
            approved: allDealers.filter(d => d.isApproved).length,
            pending: allDealers.filter(d => !d.isApproved).length,
            totalDues: allDealers.reduce((sum, d) => sum + d.currentDue, 0),
        };

        res.status(200).json({
            success: true,
            stats,
            data: dealersWithStats,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single dealer details
// @route   GET /api/v1/dealers/:id
// @access  Private/Admin
exports.getDealerById = async (req, res, next) => {
    try {
        const dealer = await Dealer.findById(req.params.id)
            .populate('approvedBy', 'name');

        if (!dealer) {
            return next(new AppError('Dealer not found', 404));
        }

        const orders = await Order.find({ user: dealer._id }).sort('-createdAt').limit(10);
        const allOrders = await Order.find({ user: dealer._id });

        const stats = {
            totalOrders: allOrders.length,
            totalSpent: allOrders.reduce((sum, o) => sum + o.totalPrice, 0),
            thisMonthSpent: allOrders
                .filter(o => {
                    const d = new Date(o.createdAt);
                    const now = new Date();
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                })
                .reduce((sum, o) => sum + o.totalPrice, 0),
        };

        res.status(200).json({
            success: true,
            data: {
                ...dealer.toObject(),
                stats,
                orderHistory: orders,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve dealer
// @route   PUT /api/v1/dealers/:id/approve
// @access  Private/Admin
exports.approveDealer = async (req, res, next) => {
    try {
        const dealer = await Dealer.findById(req.params.id);
        if (!dealer) {
            return next(new AppError('Dealer not found', 404));
        }

        dealer.isApproved = true;
        dealer.approvedBy = req.user._id;
        dealer.approvedAt = Date.now();
        await dealer.save();

        res.status(200).json({
            success: true,
            message: 'Dealer approved successfully',
            data: dealer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject dealer
// @route   PUT /api/v1/dealers/:id/reject
// @access  Private/Admin
exports.rejectDealer = async (req, res, next) => {
    try {
        const dealer = await Dealer.findById(req.params.id);
        if (!dealer) {
            return next(new AppError('Dealer not found', 404));
        }

        dealer.isApproved = false;
        await dealer.save();

        res.status(200).json({
            success: true,
            message: 'Dealer registration rejected',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update dealer financial info
// @route   PUT /api/v1/dealers/:id/credit
// @access  Private/Admin
exports.updateDealerCredit = async (req, res, next) => {
    try {
        const { creditLimit, paymentTerm } = req.body;
        const dealer = await Dealer.findByIdAndUpdate(
            req.params.id,
            { creditLimit, paymentTerm },
            { new: true, runValidators: true }
        );

        if (!dealer) {
            return next(new AppError('Dealer not found', 404));
        }

        res.status(200).json({
            success: true,
            data: dealer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update dealer profile
// @route   PUT /api/v1/dealers/:id
// @access  Private/Admin
exports.updateDealerProfile = async (req, res, next) => {
    try {
        const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!dealer) {
            return next(new AppError('Dealer not found', 404));
        }

        res.status(200).json({
            success: true,
            data: dealer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dealer orders
// @route   GET /api/v1/dealers/:id/orders
// @access  Private/Admin
exports.getDealerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.params.id }).sort('-createdAt');
        
        const summary = {
            count: orders.length,
            totalValue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
        };

        res.status(200).json({
            success: true,
            summary,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};
