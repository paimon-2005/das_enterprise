const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', areaController.getAllAreas);
router.get('/:id/stats', protect, restrictTo('admin'), areaController.getAreaStats);

router.use(protect, restrictTo('admin'));

router.post('/', areaController.createArea);
router.put('/:id', areaController.updateArea);
router.delete('/:id', areaController.deleteArea);

module.exports = router;
