const express = require('express');
const { 
    getDashboardStats, 
    getRevenueData, 
    getAdminOrders, 
    updateOrderStatus,
    getAdminStock,
    updateProductStock,
    getAdminCustomers
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueData);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/stock', getAdminStock);
router.put('/stock/:id', updateProductStock);
router.get('/customers', getAdminCustomers);

module.exports = router;
