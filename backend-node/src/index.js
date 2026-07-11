require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db');

// --- Import all models to register them with Sequelize ---
require('./modules/auth/User.model');
require('./modules/auth/PasswordResetToken.model');
require('./modules/products/Product.model');
require('./modules/orders/Order.model');
require('./modules/orders/OrderItem.model');
require('./modules/cart/Cart.model');
require('./modules/cart/CartItem.model');
require('./modules/payment/Payment.model');
require('./modules/admin/ExternalApiConfig.model');

// --- Import associations (must run after models are defined) ---
require('./associations');

// --- Import routes ---
const authRoutes    = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/product.routes');
const orderRoutes   = require('./modules/orders/order.routes');
const cartRoutes    = require('./modules/cart/cart.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const adminRoutes   = require('./modules/admin/admin.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Middleware ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];
if (process.env.FRONTEND_URL) {
  const urls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...urls);
}
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// --- Routes ---
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/payment',  paymentRoutes);
app.use('/api/admin',    adminRoutes);

// --- Health check ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// --- Start ---
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Neon PostgreSQL connected successfully.');
    // Sync models (alter: true = non-destructive update, like JPA update mode)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced.');
    app.listen(PORT, () => {
      console.log(`🚀 ModuComm Node.js backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();
