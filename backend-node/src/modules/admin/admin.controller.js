const ExternalApiConfig = require('./ExternalApiConfig.model');

/** GET /api/admin/api-configs */
async function getAllConfigs(req, res) {
  try {
    const configs = await ExternalApiConfig.findAll({ order: [['createdAt', 'DESC']] });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/admin/api-configs/:id */
async function getConfigById(req, res) {
  try {
    const config = await ExternalApiConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ error: 'Config not found' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /api/admin/api-configs */
async function createConfig(req, res) {
  try {
    const config = await ExternalApiConfig.create(req.body);
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/** PUT /api/admin/api-configs/:id */
async function updateConfig(req, res) {
  try {
    const config = await ExternalApiConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ error: 'Config not found' });

    // If activating this config, deactivate all others first
    if (req.body.active === true) {
      await ExternalApiConfig.update({ active: false }, { where: {} });
    }

    await config.update(req.body);
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/** DELETE /api/admin/api-configs/:id */
async function deleteConfig(req, res) {
  try {
    const config = await ExternalApiConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ error: 'Config not found' });
    await config.destroy();
    res.json({ message: 'Config deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /api/admin/api-configs/:id/activate */
async function activateConfig(req, res) {
  try {
    // Deactivate all, then activate the specified one
    await ExternalApiConfig.update({ active: false }, { where: {} });
    const config = await ExternalApiConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ error: 'Config not found' });
    await config.update({ active: true });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllConfigs,
  getConfigById,
  createConfig,
  updateConfig,
  deleteConfig,
  activateConfig,
};
