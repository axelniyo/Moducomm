const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./User.model');
const PasswordResetToken = require('./PasswordResetToken.model');
const { sendPasswordResetEmail } = require('./email.service');

const SALT_ROUNDS = 10;

/** Generate a signed JWT for a user record */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 86400000 }
  );
}

/** POST /api/auth/register */
const registerValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
];

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', message: errors.array()[0].msg });
  }

  const { email, password, name } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Registration failed', message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hashedPassword, name, role: 'USER' });

    const token = generateToken(user);
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(400).json({ error: 'Registration failed', message: err.message });
  }
}

/** POST /api/auth/login */
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required'),
];

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', message: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Login failed', message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Login failed', message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(400).json({ error: 'Login failed', message: err.message });
  }
}

/** POST /api/auth/logout — stateless JWT, client drops the token */
function logout(req, res) {
  return res.json({ message: 'Logged out successfully' });
}

/** POST /api/auth/forgot-password */
const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Invalid email'),
];

async function forgotPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', message: errors.array()[0].msg });
  }

  const { email } = req.body;
  try {
    // Always return success to prevent email enumeration
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Invalidate any existing tokens for this user
    await PasswordResetToken.update(
      { used: true },
      { where: { userId: user.id, used: false } }
    );

    // Create the new reset token
    await PasswordResetToken.create({
      token,
      userId: user.id,
      expiresAt,
    });

    // Build the reset link (points to the frontend)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // Send the email
    await sendPasswordResetEmail(user.email, user.name, resetLink);

    return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Server error', message: 'Failed to process password reset request.' });
  }
}

/** POST /api/auth/reset-password */
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

async function resetPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', message: errors.array()[0].msg });
  }

  const { token, password } = req.body;
  try {
    // Find the token record
    const resetToken = await PasswordResetToken.findOne({ where: { token, used: false } });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid token', message: 'This reset link is invalid or has already been used.' });
    }

    // Check if expired
    if (new Date() > resetToken.expiresAt) {
      await resetToken.update({ used: true });
      return res.status(400).json({ error: 'Token expired', message: 'This reset link has expired. Please request a new one.' });
    }

    // Find the user and update their password
    const user = await User.findByPk(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found', message: 'Could not find the associated account.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await user.update({ password: hashedPassword });

    // Mark token as used
    await resetToken.update({ used: true });

    return res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Server error', message: 'Failed to reset password.' });
  }
}

module.exports = {
  register, registerValidation,
  login, loginValidation,
  logout,
  forgotPassword, forgotPasswordValidation,
  resetPassword, resetPasswordValidation,
};
