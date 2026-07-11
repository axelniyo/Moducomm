const router = require('express').Router();
const { authenticate } = require('../auth/auth.middleware');
const ctrl = require('./cart.controller');

router.get('/',                authenticate, ctrl.getCart);
router.post('/items',          authenticate, ctrl.addItem);
router.patch('/items/:itemId', authenticate, ctrl.updateItemQuantity);
router.delete('/items/:itemId',authenticate, ctrl.removeItem);
router.delete('/',             authenticate, ctrl.clearCart);

module.exports = router;
