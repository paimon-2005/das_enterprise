const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AppError = require('../utils/appError');
const stripe = require('../config/stripe');

// CART
const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const Dealer = require('../models/Dealer');
const Area = require('../models/Area');

// ORDERS
const createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            notes
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return next(new AppError('No order items', 400));
        }

        const orderData = {
            user: req.user._id,
            userModel: req.user.role === 'dealer' ? 'Dealer' : 'User',
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            notes,
            isPaid: paymentMethod === 'stripe' ? true : false,
            paidAt: paymentMethod === 'stripe' ? Date.now() : null
        };

        // If dealer, snapshot their shop details
        if (req.user.role === 'dealer') {
            const dealer = await Dealer.findById(req.user._id).populate('area');
            if (dealer) {
                orderData.shopName = dealer.shopName;
                orderData.ownerName = dealer.ownerName;
                orderData.area = dealer.area?._id;
                orderData.areaName = dealer.area?.name;
                orderData.phone = dealer.phone;
                orderData.paymentTerm = dealer.paymentTerm;
                
                // For dealers, the shipping address is usually their physical shop address
                if (!shippingAddress.street || shippingAddress.street === 'Business Address') {
                    orderData.shippingAddress = {
                        street: dealer.shopAddress,
                        city: dealer.city || 'Mumbai',
                        state: dealer.state || 'Maharashtra',
                        zipCode: dealer.zipCode || '400001',
                        country: 'India'
                    };
                }
                
                // If payment method is 'credit', or if it's their default, record as due
                if (paymentMethod === 'credit' || dealer.paymentTerm === 'credit') {
                    orderData.dueAmount = totalPrice;
                    dealer.currentDue += totalPrice;
                    await dealer.save({ validateBeforeSave: false });
                }
            }
        }


        const order = new Order(orderData);
        const createdOrder = await order.save();


        // Clear cart after order
        await Cart.findOneAndDelete({ user: req.user._id });

        res.status(201).json({
            success: true,
            data: createdOrder,
        });
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return next(new AppError('Order not found', 404));
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

const createPaymentIntent = async (req, res, next) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // amount in paisa
            currency: 'inr',
            metadata: { integration_check: 'accept_a_payment' },
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    createOrder,
    getMyOrders,
    getOrderById,
    createPaymentIntent
};
