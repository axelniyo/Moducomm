const router = require('express').Router();
const {
  register, registerValidation,
  login, loginValidation,
  logout,
  forgotPassword, forgotPasswordValidation,
  resetPassword, resetPasswordValidation,
} = require('./auth.controller');

router.post('/register',        registerValidation,       register);
router.post('/login',           loginValidation,          login);
router.post('/logout',                                    logout);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password',  resetPasswordValidation,  resetPassword);

module.exports = router;
