const fetch = require('node-fetch');
const Product = require('./Product.model');
const ExternalApiConfig = require('../admin/ExternalApiConfig.model');

/**
 * Resolves a dot-notation path like "images.0.url" from a nested object.
 * Mirrors Java's getNestedValue() in ProductService.java.
 */
function getNestedValue(obj, path) {
  if (!path) return '';
  try {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current == null) return '';
      if (Array.isArray(current)) {
        const idx = parseInt(part, 10);
        current = isNaN(idx) ? undefined : current[idx];
      } else {
        current = current[part];
      }
    }
    return current == null ? '' : String(current);
  } catch {
    return '';
  }
}

/**
 * Fetches & merges local DB products with optional external API products.
 * Exact port of ProductService.getMergedProducts() from Java.
 */
async function getMergedProducts() {
  // Start with DB products keyed by id
  const dbProducts = await Product.findAll({ raw: true });
  const map = {};
  for (const p of dbProducts) {
    map[p.id] = p;
  }

  // Try to find an active external API config
  const activeConfig = await ExternalApiConfig.findOne({ where: { active: true }, raw: true });

  if (activeConfig) {
    try {
      const headers = {};
      if (activeConfig.userAgent) headers['User-Agent'] = activeConfig.userAgent;
      if (activeConfig.apiKey && activeConfig.authHeaderName) {
        const value = (activeConfig.authHeaderValue || '{KEY}').replace('{KEY}', activeConfig.apiKey);
        headers[activeConfig.authHeaderName] = value;
      }

      const response = await fetch(activeConfig.url, { headers });
      if (!response.ok) throw new Error(`External API returned ${response.status}`);

      const json = await response.json();
      const items = json.items || json; // support both { items: [] } and plain []
      const externalItems = Array.isArray(items) ? items : [];

      for (const item of externalItems) {
        try {
          const id = getNestedValue(item, activeConfig.idField);
          if (!id) continue;

          const priceStr  = getNestedValue(item, activeConfig.priceField);
          const stockStr  = getNestedValue(item, activeConfig.stockField);

          map[id] = {
            id,
            name:        getNestedValue(item, activeConfig.nameField),
            description: getNestedValue(item, activeConfig.descriptionField),
            price:       priceStr  ? parseFloat(priceStr)  : 0,
            category:    getNestedValue(item, activeConfig.categoryField),
            image:       getNestedValue(item, activeConfig.imageField),
            stock:       stockStr  ? parseInt(stockStr, 10) : 0,
          };
        } catch (e) {
          console.warn('Skipping external product due to mapping error:', e.message);
        }
      }
    } catch (e) {
      console.warn('External API fetch failed (using local products only):', e.message);
    }
  }

  return Object.values(map);
}

module.exports = { getMergedProducts, getNestedValue };
