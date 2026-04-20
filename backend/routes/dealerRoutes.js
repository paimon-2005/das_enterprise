const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealerController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));

router.get('/', dealerController.getAllDealers);
router.get('/:id', dealerController.getDealerById);
router.put('/:id', dealerController.updateDealerProfile);
router.put('/:id/approve', dealerController.approveDealer);
router.put('/:id/reject', dealerController.rejectDealer);
router.put('/:id/credit', dealerController.updateDealerCredit);
router.get('/:id/orders', dealerController.getDealerOrders);

module.exports = router;
