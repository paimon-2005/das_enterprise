const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const AppError = require('../utils/appError');

exports.createOrder = async (req, res, next) => {
    try {
        const { items, notes } = req.body;

        if (!items || items.length === 0) {
            return next(new AppError('No order items provided', 400));
        }

        // Fetch user (area is a plain string now — no populate needed)
        const user = await User.findById(req.user._id);
        if (!user) return next(new AppError('User not found', 404));

        let totalSubtotal = 0;
        let totalTax = 0;
        const processedItems = [];
        const taxSlabs = {
            5: { taxable: 0, cgst: 0, sgst: 0 },
            12: { taxable: 0, cgst: 0, sgst: 0 },
            18: { taxable: 0, cgst: 0, sgst: 0 },
            28: { taxable: 0, cgst: 0, sgst: 0 }
        };

        // Process items, fetch product details, snapshot them
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return next(new AppError(`Product not found: ${item.product}`, 404));
            if (product.stock < item.quantity) {
                return next(new AppError(`Insufficient stock for ${product.name}`, 400));
            }

            const baseAmount = product.price * item.quantity;
            const discountAmount = (baseAmount * (product.discountPercent || 0)) / 100;
            const taxableAmount = baseAmount - discountAmount;
            const gstAmount = (taxableAmount * (product.gstPercent || 0)) / 100;
            const itemTotal = taxableAmount + gstAmount;

            totalSubtotal += taxableAmount;
            totalTax += gstAmount;

            // Update tax slab info
            const slab = product.gstPercent || 18;
            if (taxSlabs[slab]) {
                taxSlabs[slab].taxable += taxableAmount;
                taxSlabs[slab].cgst += gstAmount / 2;
                taxSlabs[slab].sgst += gstAmount / 2;
            }

            processedItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
                mrp: product.mrp,
                hsnCode: product.hsnCode,
                gstPercent: product.gstPercent,
                discountPercent: product.discountPercent,
                taxableAmount: Math.round(taxableAmount * 100) / 100,
                gstAmount: Math.round(gstAmount * 100) / 100,
                total: Math.round(itemTotal * 100) / 100
            });

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const taxBreakdown = Object.entries(taxSlabs)
            .filter(([_, data]) => data.taxable > 0)
            .map(([slab, data]) => ({
                slab: parseInt(slab),
                taxableValue: Math.round(data.taxable * 100) / 100,
                cgst: Math.round(data.cgst * 100) / 100,
                sgst: Math.round(data.sgst * 100) / 100
            }));

        const totalPrice = Math.round((totalSubtotal + totalTax) * 100) / 100;

        // Create Order
        const order = await Order.create({
            dealer: user._id,
            shopName: user.shopName,
            ownerName: user.name,
            area: user.area,
            shopAddress: user.shopAddress,
            phone: user.phone,
            paymentTerm: user.paymentTerm,
            items: processedItems,
            taxBreakdown,
            subtotal: Math.round(totalSubtotal * 100) / 100,
            tax: Math.round(totalTax * 100) / 100,
            totalPrice,
            notes
        });

        // Update dealer dues if on credit
        if (user.paymentTerm === 'credit' || user.paymentTerm === 'weekly') {
            user.currentDue += totalPrice;
            await user.save();
        }

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ dealer: req.user._id }).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, area, dealer, paymentTerm, from, to } = req.query;
        let query = {};

        if (status) query.orderStatus = status;
        if (area) query.area = area;
        if (dealer) query.dealer = dealer;
        if (paymentTerm) query.paymentTerm = paymentTerm;
        
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const orders = await Order.find(query)
            .populate('dealer', 'shopName name phone')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('dealer', 'shopName name phone email shopAddress');

        if (!order) return next(new AppError('Order not found', 404));

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return next(new AppError('Order not found', 404));

        // Restore stock if cancelled
        if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        order.orderStatus = status;
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return next(new AppError('Order not found', 404));

        // If marked as paid, reduce dealer's currentDue
        if (status === 'paid' && order.paymentStatus !== 'paid') {
            const dealer = await User.findById(order.dealer);
            if (dealer) {
                dealer.currentDue = Math.max(0, dealer.currentDue - order.totalPrice);
                await dealer.save();
            }
            order.isPaid = true;
        }

        order.paymentStatus = status;
        await order.save();

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};
