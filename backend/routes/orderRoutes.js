const express = require('express');
const { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus, 
    updatePaymentStatus 
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const { validateOrder } = require('../middleware/validate');

const router = express.Router();

// Publicly logged in (Dealer or Admin)
router.post('/', protect, validateOrder, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin Only
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);
router.put('/:id/payment', protect, restrictTo('admin'), updatePaymentStatus);

module.exports = router;
