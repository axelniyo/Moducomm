const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // userId FK added via associations.js
}, {
  tableName: 'carts',
  timestamps: true,
});

module.exports = Cart;
