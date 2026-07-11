/**
 * Defines all Sequelize model associations in one place.
 * Must be required AFTER all models are defined.
 */
const User             = require('./modules/auth/User.model');
const Order            = require('./modules/orders/Order.model');
const OrderItem        = require('./modules/orders/OrderItem.model');
const Cart             = require('./modules/cart/Cart.model');
const CartItem         = require('./modules/cart/CartItem.model');
const Payment          = require('./modules/payment/Payment.model');

// User → Orders (one-to-many)
User.hasMany(Order,   { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User → PasswordResetTokens (one-to-many)
const PasswordResetToken = require('./modules/auth/PasswordResetToken.model');
User.hasMany(PasswordResetToken,   { foreignKey: 'userId', as: 'resetTokens' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order → OrderItems (one-to-many)
Order.hasMany(OrderItem,     { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order,   { foreignKey: 'orderId', as: 'order' });

// User → Cart (one-to-one)
User.hasOne(Cart,    { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart → CartItems (one-to-many)
Cart.hasMany(CartItem,     { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart,   { foreignKey: 'cartId', as: 'cart' });

// User → Payments (one-to-many)
User.hasMany(Payment,    { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User,  { foreignKey: 'userId', as: 'user' });
