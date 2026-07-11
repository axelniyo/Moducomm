const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const ExternalApiConfig = sequelize.define('ExternalApiConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  authHeaderName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  authHeaderValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Field mapping config
  idField:          { type: DataTypes.STRING, allowNull: true },
  nameField:        { type: DataTypes.STRING, allowNull: true },
  descriptionField: { type: DataTypes.STRING, allowNull: true },
  priceField:       { type: DataTypes.STRING, allowNull: true },
  categoryField:    { type: DataTypes.STRING, allowNull: true },
  imageField:       { type: DataTypes.STRING, allowNull: true },
  stockField:       { type: DataTypes.STRING, allowNull: true },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'external_api_configs',
  timestamps: true,
});

module.exports = ExternalApiConfig;
