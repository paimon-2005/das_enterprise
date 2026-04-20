const express = require('express');
const {
    getAllProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);
router.patch('/:id/stock', protect, restrictTo('admin'), updateStock);

module.exports = router;
