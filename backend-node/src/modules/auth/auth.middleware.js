const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT Bearer token from the Authorization header.
 * Attaches decoded payload as req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token.' });
  }
};

/**
 * Role-based authorization middleware.
 * Usage: authorize('ADMIN')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions.' });
  }
  next();
};

module.exports = { authenticate, authorize };
