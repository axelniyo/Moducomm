const Order     = require('./Order.model');
const OrderItem = require('./OrderItem.model');
const Cart      = require('../cart/Cart.model');
const CartItem  = require('../cart/CartItem.model');

/** POST /api/orders — create order from the current user's cart */
async function createOrder(req, res) {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, as: 'items' }],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const order = await Order.create({ userId, totalAmount, status: 'NEW' });

    const orderItems = cart.items.map(item => ({
      orderId:     order.id,
      productId:   item.productId,
      productName: item.productName,
      price:       item.price,
      quantity:    item.quantity,
    }));
    await OrderItem.bulkCreate(orderItems);

    // Clear cart after checkout
    await CartItem.destroy({ where: { cartId: cart.id } });

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });
    res.json(fullOrder);
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/orders — get current user's orders */
async function getUserOrders(req, res) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/orders/all — admin only */
async function getAllOrders(req, res) {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createOrder, getUserOrders, getAllOrders };
