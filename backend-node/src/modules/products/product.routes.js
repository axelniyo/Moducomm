const router = require('express').Router();
const { authenticate, authorize } = require('../auth/auth.middleware');
const ctrl = require('./product.controller');

// NOTE: specific paths must come before /:id to avoid route conflicts
router.get('/search',           ctrl.searchProductsByName);
router.get('/category/:category', ctrl.getProductsByCategory);
router.get('/',                 ctrl.getAllProducts);
router.get('/:id',              ctrl.getProductById);
router.post('/',   authenticate, authorize('ADMIN'), ctrl.createProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.deleteProduct);

module.exports = router;
