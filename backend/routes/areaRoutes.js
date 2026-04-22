const express = require('express');
const { 
    createArea, 
    getAllAreas, 
    updateArea, 
    deleteArea,
    getAreaStats
} = require('../controllers/areaController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Publicly available (used in registration)
router.get('/', getAllAreas);

// Admin Only
router.post('/', protect, restrictTo('admin'), createArea);
router.get('/:id/stats', protect, restrictTo('admin'), getAreaStats);
router.put('/:id', protect, restrictTo('admin'), updateArea);
router.delete('/:id', protect, restrictTo('admin'), deleteArea);

module.exports = router;
