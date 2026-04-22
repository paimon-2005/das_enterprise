const express = require('express');
const { 
    getDashboardStats, 
    getAllShops, 
    updateShopCredit 
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are admin only
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getDashboardStats);
router.get('/shops', getAllShops);
router.put('/shops/:id/credit', updateShopCredit);

module.exports = router;
