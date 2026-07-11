const Cart     = require('./Cart.model');
const CartItem = require('./CartItem.model');

/** Get or create a cart for the current user */
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, as: 'items' }],
  });
  if (!cart) {
    cart = await Cart.create({ userId });
    cart.items = [];
  }
  return cart;
}

/** GET /api/cart */
async function getCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /api/cart/items — add item or increment quantity */
async function addItem(req, res) {
  const { productId, productName, price, quantity = 1, image } = req.body;
  if (!productId || !productName || price == null) {
    return res.status(400).json({ error: 'productId, productName and price are required.' });
  }
  try {
    const cart = await getOrCreateCart(req.user.id);

    let existingItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      existingItem = await CartItem.create({
        cartId: cart.id,
        productId,
        productName,
        price,
        quantity,
        image,
      });
    }

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: 'items' }],
    });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** DELETE /api/cart/items/:itemId — remove a specific item */
async function removeItem(req, res) {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    const cart = await Cart.findByPk(item.cartId);
    if (cart.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await item.destroy();
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: 'items' }],
    });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** DELETE /api/cart — clear all items from cart */
async function clearCart(req, res) {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.json({ message: 'Cart is already empty' });

    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** PATCH /api/cart/items/:itemId — update item quantity */
async function updateItemQuantity(req, res) {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1.' });
  }
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    item.quantity = quantity;
    await item.save();

    const cart = await Cart.findByPk(item.cartId, {
      include: [{ model: CartItem, as: 'items' }],
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getCart, addItem, removeItem, clearCart, updateItemQuantity };
