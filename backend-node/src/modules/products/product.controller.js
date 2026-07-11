const Product = require('./Product.model');
const { getMergedProducts } = require('./product.service');

/** GET /api/products */
async function getAllProducts(req, res) {
  try {
    const products = await getMergedProducts();
    res.json(products);
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/products/:id */
async function getProductById(req, res) {
  try {
    const products = await getMergedProducts();
    const product  = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /api/products  (admin only) */
async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/** DELETE /api/products/:id  (admin only) */
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/products/category/:category */
async function getProductsByCategory(req, res) {
  try {
    const products = await getMergedProducts();
    const filtered = products.filter(
      p => (p.category || '').toLowerCase() === req.params.category.toLowerCase()
    );
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/products/search?name= */
async function searchProductsByName(req, res) {
  try {
    const name = (req.query.name || '').toLowerCase();
    const products = await getMergedProducts();
    const results  = products.filter(p => (p.name || '').toLowerCase().includes(name));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductsByCategory,
  searchProductsByName,
};
