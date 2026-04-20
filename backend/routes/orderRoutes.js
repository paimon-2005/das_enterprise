const express = require('express');
const { 
    getCart, 
    addToCart, 
    updateCartItem,
    createOrder,
    getMyOrders,
    getOrderById,
    createPaymentIntent
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Cart
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart', protect, updateCartItem);

// Orders
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);
router.post('/orders', protect, createOrder);

// Payments
router.post('/orders/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
