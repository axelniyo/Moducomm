const router = require('express').Router();
const { authenticate } = require('../auth/auth.middleware');
const ctrl = require('./payment.controller');

router.post('/create-intent', authenticate, ctrl.createPaymentIntent);
router.get('/history',        authenticate, ctrl.getPaymentHistory);

module.exports = router;
