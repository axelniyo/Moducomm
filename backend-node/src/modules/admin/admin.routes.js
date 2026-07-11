const router = require('express').Router();
const { authenticate, authorize } = require('../auth/auth.middleware');
const ctrl = require('./admin.controller');

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/api-configs',             ctrl.getAllConfigs);
router.get('/api-configs/:id',         ctrl.getConfigById);
router.post('/api-configs',            ctrl.createConfig);
router.put('/api-configs/:id',         ctrl.updateConfig);
router.delete('/api-configs/:id',      ctrl.deleteConfig);
router.post('/api-configs/:id/activate', ctrl.activateConfig);

module.exports = router;
