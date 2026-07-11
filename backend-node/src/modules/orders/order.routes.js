const router = require('express').Router();
const { authenticate, authorize } = require('../auth/auth.middleware');
const ctrl = require('./order.controller');

router.post('/',     authenticate,                       ctrl.createOrder);
router.get('/',      authenticate,                       ctrl.getUserOrders);
router.get('/all',   authenticate, authorize('ADMIN'),   ctrl.getAllOrders);

module.exports = router;
